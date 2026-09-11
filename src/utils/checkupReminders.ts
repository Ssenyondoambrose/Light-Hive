import { Hive, CheckupReminder } from '../types';
import { getActiveSevereOrCriticalPest, getRecurringPestOutbreaks } from './pestAlerts';

export function getCheckupIntervalDays(hive: Hive): number {
  const severePest = getActiveSevereOrCriticalPest(hive);
  if (severePest) {
    return 0; // Immediate checkup required for severe or critical infestations
  }

  if (hive.healthStatus === 'Disease / Treatment Needed') {
    return 0; // Immediate checkup required
  }
  if (hive.healthStatus === 'Pest Spotted') {
    return 2;
  }

  let baseInterval = 14; // Default for strong
  if (hive.colonyStrength === 'Weak') {
    baseInterval = 3;
  } else if (hive.colonyStrength === 'Moderate') {
    baseInterval = 7;
  } else if (hive.colonyStrength === 'Strong') {
    baseInterval = 14;
  }

  // If recovering, halve the inspection interval
  if (hive.healthStatus === 'Recovering') {
    baseInterval = Math.max(2, Math.floor(baseInterval / 2));
  }

  return baseInterval;
}

export function calculateHiveReminder(hive: Hive): CheckupReminder {
  const interval = getCheckupIntervalDays(hive);
  const lastInspectedDate = new Date(hive.lastInspected);
  
  // Calculate next due date
  const dueDateObj = new Date(lastInspectedDate);
  dueDateObj.setDate(dueDateObj.getDate() + interval);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDateObj.setHours(0, 0, 0, 0);

  const diffTime = dueDateObj.getTime() - today.getTime();
  const dueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let urgency: 'urgent' | 'due_soon' | 'healthy' = 'healthy';
  let reason = '';

  const activeSeverePest = getActiveSevereOrCriticalPest(hive);
  const recurringOutbreaks = getRecurringPestOutbreaks(hive).filter((r) => r.activeOccurrences > 0);

  if (activeSeverePest) {
    urgency = 'urgent';
    reason = `Critical Alert: ${activeSeverePest.severity} ${activeSeverePest.name} active — action needed!`;
  } else if (recurringOutbreaks.length > 0) {
    urgency = 'urgent';
    reason = `Recurring Threat: ${recurringOutbreaks[0].pestName} reappeared (${recurringOutbreaks[0].totalOccurrences}x outbreaks)`;
  } else if (hive.healthStatus === 'Disease / Treatment Needed') {
    urgency = 'urgent';
    reason = 'Immediate treatment & medical checkup needed';
  } else if (hive.healthStatus === 'Pest Spotted') {
    urgency = dueDays <= 0 ? 'urgent' : 'due_soon';
    reason = 'Pest presence spotted — monitor hive defense';
  } else if (dueDays <= 0) {
    urgency = 'urgent';
    reason = `Overdue by ${Math.abs(dueDays)} day${Math.abs(dueDays) === 1 ? '' : 's'} (${hive.colonyStrength.toLowerCase()} colony protocol)`;
  } else if (dueDays <= 2) {
    urgency = 'due_soon';
    reason = `Due in ${dueDays} day${dueDays === 1 ? '' : 's'} (${hive.colonyStrength.toLowerCase()} colony cycle)`;
  } else {
    urgency = 'healthy';
    reason = `Routine inspection scheduled in ${dueDays} days`;
  }

  return {
    hiveId: hive.id,
    hiveName: hive.name,
    apiaryLocation: hive.apiaryLocation,
    dueDays,
    dueDate: dueDateObj.toISOString().split('T')[0],
    urgency,
    reason,
    colonyStrength: hive.colonyStrength,
    healthStatus: hive.healthStatus,
    lastInspected: hive.lastInspected,
  };
}

export function calculateAllReminders(hives: Hive[]): CheckupReminder[] {
  return hives
    .map(calculateHiveReminder)
    .sort((a, b) => a.dueDays - b.dueDays);
}
