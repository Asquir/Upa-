import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MealPlan from './pages/MealPlan';
import FoodLog from './pages/FoodLog';
import Progress from './pages/Progress';
import Guide from './pages/Guide';

type Tab = 'dashboard' | 'meals' | 'log' | 'progress' | 'guide';

function AppContent() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (!state.onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-md mx-auto">
        {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => setActiveTab(tab as Tab)} />}
        {activeTab === 'meals' && <MealPlan />}
        {activeTab === 'log' && <FoodLog />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'guide' && <Guide />}
      </div>
      <Navigation active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
