import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, UserProfile, MealEntry, WeightEntry, Macros } from '../types';
import { calculateTargets, getTodayKey } from '../utils/calculations';

type Action =
  | { type: 'COMPLETE_ONBOARDING'; profile: UserProfile }
  | { type: 'ADD_MEAL_ENTRY'; entry: MealEntry }
  | { type: 'REMOVE_MEAL_ENTRY'; entryId: string; date: string }
  | { type: 'LOG_WEIGHT'; entry: WeightEntry }
  | { type: 'UPDATE_PROFILE'; profile: UserProfile }
  | { type: 'RESET' };

const initialState: AppState = {
  profile: null,
  targets: null,
  logs: {},
  weightHistory: [],
  onboardingComplete: false,
};

function sumEntries(entries: MealEntry[]): { totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number } {
  return entries.reduce((acc, e) => ({
    totalCalories: acc.totalCalories + e.calories,
    totalProtein: acc.totalProtein + e.protein,
    totalCarbs: acc.totalCarbs + e.carbs,
    totalFat: acc.totalFat + e.fat,
  }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING': {
      const targets = calculateTargets(action.profile);
      return { ...state, profile: action.profile, targets, onboardingComplete: true };
    }
    case 'UPDATE_PROFILE': {
      const targets = calculateTargets(action.profile);
      return { ...state, profile: action.profile, targets };
    }
    case 'ADD_MEAL_ENTRY': {
      const { date } = action.entry;
      const prevEntries = state.logs[date]?.entries ?? [];
      const entries = [...prevEntries, action.entry];
      const totals = sumEntries(entries);
      return {
        ...state,
        logs: {
          ...state.logs,
          [date]: { date, entries, ...totals },
        },
      };
    }
    case 'REMOVE_MEAL_ENTRY': {
      const { entryId, date } = action;
      const prevEntries = state.logs[date]?.entries ?? [];
      const entries = prevEntries.filter(e => e.id !== entryId);
      const totals = sumEntries(entries);
      return {
        ...state,
        logs: {
          ...state.logs,
          [date]: { date, entries, ...totals },
        },
      };
    }
    case 'LOG_WEIGHT': {
      const exists = state.weightHistory.findIndex(w => w.date === action.entry.date);
      const weightHistory = exists >= 0
        ? state.weightHistory.map((w, i) => i === exists ? action.entry : w)
        : [...state.weightHistory, action.entry];
      return { ...state, weightHistory };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const STORAGE_KEY = 'gym_nutrition_app_v1';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    // Re-calculate targets in case formula changed
    if (parsed.profile) {
      parsed.targets = calculateTargets(parsed.profile);
    }
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  todayLog: AppState['logs'][string] | null;
  targets: Macros | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const todayKey = getTodayKey();
  const todayLog = state.logs[todayKey] ?? null;

  return (
    <AppContext.Provider value={{ state, dispatch, todayLog, targets: state.targets }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
