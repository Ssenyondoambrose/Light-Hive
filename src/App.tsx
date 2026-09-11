/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { ActiveTab } from './components/MobileTabBar';
import { DashboardPage } from './pages/DashboardPage';
import { HivesPage } from './pages/HivesPage';
import { HarvestsPage } from './pages/HarvestsPage';
import { SurveyPage } from './pages/SurveyPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isNewHiveModalOpen, setIsNewHiveModalOpen] = useState(false);
  const [isNewHarvestModalOpen, setIsNewHarvestModalOpen] = useState(false);

  return (
    <Layout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <DashboardPage
          onNavigate={setActiveTab}
          onOpenNewHiveModal={() => {
            setActiveTab('hives');
            setIsNewHiveModalOpen(true);
          }}
          onOpenNewHarvestModal={() => {
            setActiveTab('harvests');
            setIsNewHarvestModalOpen(true);
          }}
        />
      )}

      {activeTab === 'hives' && (
        <HivesPage
          isCreateModalOpen={isNewHiveModalOpen}
          onOpenCreateModal={() => setIsNewHiveModalOpen(true)}
          onCloseCreateModal={() => setIsNewHiveModalOpen(false)}
        />
      )}

      {activeTab === 'harvests' && (
        <HarvestsPage
          isCreateModalOpen={isNewHarvestModalOpen}
          onOpenCreateModal={() => setIsNewHarvestModalOpen(true)}
          onCloseCreateModal={() => setIsNewHarvestModalOpen(false)}
        />
      )}

      {activeTab === 'survey' && <SurveyPage />}

      {activeTab === 'settings' && <SettingsPage />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
