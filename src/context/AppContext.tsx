import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hive, Harvest, UserProfile, SurveySubmission, CheckupReminder, PestDiseaseRecord } from '../types';
import { INITIAL_HIVES, INITIAL_HARVESTS, INITIAL_SURVEYS, INITIAL_USER } from '../data/mockData';
import { calculateAllReminders } from '../utils/checkupReminders';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  hives: Hive[];
  harvests: Harvest[];
  surveys: SurveySubmission[];
  user: UserProfile;
  reminders: CheckupReminder[];
  urgentRemindersCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedHiveId: string | null;
  setSelectedHiveId: (id: string | null) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  addHive: (hive: Omit<Hive, 'id'>) => Hive;
  updateHive: (id: string, updates: Partial<Hive>) => void;
  deleteHive: (id: string) => void;
  markHiveInspected: (id: string, notes?: string, strength?: Hive['colonyStrength'], status?: Hive['healthStatus']) => void;
  addPestRecord: (hiveId: string, record: Omit<PestDiseaseRecord, 'id' | 'hiveId'>) => PestDiseaseRecord;
  updatePestRecord: (hiveId: string, recordId: string, updates: Partial<PestDiseaseRecord>) => void;
  deletePestRecord: (hiveId: string, recordId: string) => void;
  addHarvest: (harvest: Omit<Harvest, 'id'>) => Harvest;
  deleteHarvest: (id: string) => void;
  submitSurvey: (survey: Omit<SurveySubmission, 'id' | 'submittedAt'>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  resetToSampleData: () => void;
  exportDataJson: () => void;
  getGreeting: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hives, setHives] = useState<Hive[]>(() => {
    try {
      const saved = localStorage.getItem('the_light_hive_hives');
      return saved ? JSON.parse(saved) : INITIAL_HIVES;
    } catch {
      return INITIAL_HIVES;
    }
  });

  const [harvests, setHarvests] = useState<Harvest[]>(() => {
    try {
      const saved = localStorage.getItem('the_light_hive_harvests');
      return saved ? JSON.parse(saved) : INITIAL_HARVESTS;
    } catch {
      return INITIAL_HARVESTS;
    }
  });

  const [surveys, setSurveys] = useState<SurveySubmission[]>(() => {
    try {
      const saved = localStorage.getItem('the_light_hive_surveys');
      return saved ? JSON.parse(saved) : INITIAL_SURVEYS;
    } catch {
      return INITIAL_SURVEYS;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('the_light_hive_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHiveId, setSelectedHiveId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('the_light_hive_hives', JSON.stringify(hives));
  }, [hives]);

  useEffect(() => {
    localStorage.setItem('the_light_hive_harvests', JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem('the_light_hive_surveys', JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem('the_light_hive_user', JSON.stringify(user));
  }, [user]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const reminders = calculateAllReminders(hives);
  const urgentRemindersCount = user.remindersEnabled
    ? reminders.filter((r) => r.urgency === 'urgent' || r.urgency === 'due_soon').length
    : 0;

  const addHive = (newHiveData: Omit<Hive, 'id'>) => {
    const id = `HIVE-${String(hives.length + 1).padStart(2, '0')}`;
    const newHive: Hive = {
      ...newHiveData,
      id,
    };
    setHives((prev) => [newHive, ...prev]);
    showToast(`Hive "${newHive.name}" registered successfully!`);
    return newHive;
  };

  const updateHive = (id: string, updates: Partial<Hive>) => {
    setHives((prev) =>
      prev.map((hive) => (hive.id === id ? { ...hive, ...updates } : hive))
    );
    showToast('Hive details updated.');
  };

  const deleteHive = (id: string) => {
    const target = hives.find((h) => h.id === id);
    setHives((prev) => prev.filter((h) => h.id !== id));
    if (selectedHiveId === id) setSelectedHiveId(null);
    showToast(`Hive "${target?.name || id}" removed.`, 'info');
  };

  const markHiveInspected = (
    id: string,
    notes?: string,
    strength?: Hive['colonyStrength'],
    status?: Hive['healthStatus']
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setHives((prev) =>
      prev.map((hive) => {
        if (hive.id === id) {
          return {
            ...hive,
            lastInspected: today,
            notes: notes ? `${notes} (Logged on ${today})` : hive.notes,
            colonyStrength: strength || hive.colonyStrength,
            healthStatus: status || (hive.healthStatus === 'Disease / Treatment Needed' ? 'Recovering' : hive.healthStatus),
          };
        }
        return hive;
      })
    );
    showToast('Colony checkup logged! Reminder schedule reset.');
  };

  const addPestRecord = (
    hiveId: string,
    recordData: Omit<PestDiseaseRecord, 'id' | 'hiveId'>
  ): PestDiseaseRecord => {
    const newRecord: PestDiseaseRecord = {
      ...recordData,
      id: `PEST-${Date.now().toString().slice(-6)}`,
      hiveId,
    };

    setHives((prev) =>
      prev.map((hive) => {
        if (hive.id === hiveId) {
          const updatedRecords = [newRecord, ...(hive.pestRecords || [])];
          let updatedHealth = hive.healthStatus;
          if (newRecord.status !== 'Resolved') {
            if (newRecord.severity === 'Severe' || newRecord.severity === 'Critical') {
              updatedHealth = 'Disease / Treatment Needed';
            } else if (hive.healthStatus === 'Healthy' || hive.healthStatus === 'Active Queen') {
              updatedHealth = 'Pest Spotted';
            }
          }
          return {
            ...hive,
            healthStatus: updatedHealth,
            pestRecords: updatedRecords,
          };
        }
        return hive;
      })
    );

    if (newRecord.severity === 'Critical' || newRecord.severity === 'Severe') {
      showToast(`CRITICAL ALERT: ${newRecord.severity} ${newRecord.name} logged! Urgent treatment required.`, 'error');
    } else {
      showToast(`${newRecord.name} incident logged. Monitoring schedule updated.`, 'warning');
    }

    return newRecord;
  };

  const updatePestRecord = (
    hiveId: string,
    recordId: string,
    updates: Partial<PestDiseaseRecord>
  ) => {
    setHives((prev) =>
      prev.map((hive) => {
        if (hive.id === hiveId && hive.pestRecords) {
          const updatedRecords = hive.pestRecords.map((rec) =>
            rec.id === recordId ? { ...rec, ...updates } : rec
          );

          // Check if any active severe/critical pest remains
          const activeSevere = updatedRecords.find(
            (r) => r.status !== 'Resolved' && (r.severity === 'Critical' || r.severity === 'Severe')
          );
          const anyActive = updatedRecords.some((r) => r.status !== 'Resolved');

          let updatedHealth = hive.healthStatus;
          if (!anyActive && (hive.healthStatus === 'Disease / Treatment Needed' || hive.healthStatus === 'Pest Spotted')) {
            updatedHealth = 'Recovering';
          } else if (!activeSevere && hive.healthStatus === 'Disease / Treatment Needed') {
            updatedHealth = 'Pest Spotted';
          }

          return {
            ...hive,
            healthStatus: updatedHealth,
            pestRecords: updatedRecords,
          };
        }
        return hive;
      })
    );
    showToast('Pest / disease record updated.');
  };

  const deletePestRecord = (hiveId: string, recordId: string) => {
    setHives((prev) =>
      prev.map((hive) => {
        if (hive.id === hiveId && hive.pestRecords) {
          return {
            ...hive,
            pestRecords: hive.pestRecords.filter((rec) => rec.id !== recordId),
          };
        }
        return hive;
      })
    );
    showToast('Pest entry removed.', 'info');
  };

  const addHarvest = (harvestData: Omit<Harvest, 'id'>) => {
    const id = `HARV-${Date.now().toString().slice(-6)}`;
    const newHarvest: Harvest = {
      ...harvestData,
      id,
    };
    setHarvests((prev) => [newHarvest, ...prev]);
    showToast(`Harvest of ${newHarvest.quantityKg}kg recorded for ${newHarvest.season}!`);
    return newHarvest;
  };

  const deleteHarvest = (id: string) => {
    setHarvests((prev) => prev.filter((h) => h.id !== id));
    showToast('Harvest record deleted.', 'info');
  };

  const submitSurvey = (surveyData: Omit<SurveySubmission, 'id' | 'submittedAt'>) => {
    const id = `SRV-${Date.now().toString().slice(-4)}`;
    const newSurvey: SurveySubmission = {
      ...surveyData,
      id,
      submittedAt: new Date().toISOString(),
    };
    setSurveys((prev) => [newSurvey, ...prev]);

    // Optional auto-registration of new hive if non-existing
    showToast(`Survey submission recorded for ${surveyData.beekeeperName}!`);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Preferences updated successfully.');
  };

  const deleteAccount = () => {
    localStorage.clear();
    setHives(INITIAL_HIVES);
    setHarvests(INITIAL_HARVESTS);
    setSurveys(INITIAL_SURVEYS);
    setUser(INITIAL_USER);
    showToast('Account data reset to fresh default.', 'info');
  };

  const resetToSampleData = () => {
    setHives(INITIAL_HIVES);
    setHarvests(INITIAL_HARVESTS);
    setSurveys(INITIAL_SURVEYS);
    setUser(INITIAL_USER);
    showToast('Sample Ugandan apiary data reloaded.');
  };

  const exportDataJson = () => {
    const data = {
      user,
      hives,
      harvests,
      surveys,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-light-hive-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported as JSON file.');
  };

  // Custom greeting logic based on prompt requirement:
  // "could you remove the user name from greetings and add customise it to sir if the person is male and madam if the person is female"
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeOfDay = 'Good morning';
    if (hour >= 12 && hour < 17) {
      timeOfDay = 'Good afternoon';
    } else if (hour >= 17 || hour < 5) {
      timeOfDay = 'Good evening';
    }

    let honorific = 'Beekeeper';
    if (user.gender === 'male') {
      honorific = 'sir';
    } else if (user.gender === 'female') {
      honorific = 'madam';
    }

    return `${timeOfDay}, ${honorific}`;
  };

  return (
    <AppContext.Provider
      value={{
        hives,
        harvests,
        surveys,
        user,
        reminders,
        urgentRemindersCount,
        searchQuery,
        setSearchQuery,
        selectedHiveId,
        setSelectedHiveId,
        toasts,
        showToast,
        dismissToast,
        addHive,
        updateHive,
        deleteHive,
        markHiveInspected,
        addPestRecord,
        updatePestRecord,
        deletePestRecord,
        addHarvest,
        deleteHarvest,
        submitSurvey,
        updateUserProfile,
        deleteAccount,
        resetToSampleData,
        exportDataJson,
        getGreeting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
