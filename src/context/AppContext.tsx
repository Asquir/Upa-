import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, UserProfile, MealEntry, WeightEntry, Macros, CustomFood } from '../types';
import { calculateTargets, getTodayKey } from '../utils/calculations';

type Action =
  | { type: 'COMPLETE_ONBOARDING'; profile: UserProfile }
  | { type: 'ADD_MEAL_ENTRY'; entry: MealEntry }
  | { type: 'REMOVE_MEAL_ENTRY'; entryId: string; date: string }
  | { type: 'LOG_WEIGHT'; entry: WeightEntry }
  | { type: 'UPDATE_PROFILE'; profile: UserProfile }
  | { type: 'ADD_WATER'; amount: number; date: string }
  | { type: 'SET_WATER'; amount: number; date: string }
  | { type: 'TOGGLE_FAVORITE'; foodId: string }
  | { type: 'ADD_CUSTOM_FOOD'; food: CustomFood }
  | { type: 'REMOVE_CUSTOM_FOOD'; foodId: string }
  | { type: 'RESET' };

const initialState: AppState = {
  profile: null,
  targets: null,
  logs: {},
  weightHistory: [],
  onboardingComplete: false,
  favorites: [],
  recentFoodIds: [],
  customFoods: [],
  waterGoal: 3000,
};

function sumEntries(entries: MealEntry[]) {
  return entries.reduce((acc, e) => ({
    totalCalories: acc.totalCalories + e.calories,
    totalProtein: acc.totalProtein + e.protein,
    totalCarbs: acc.totalCarbs + e.carbs,
    totalFat: acc.totalFat + e.fat,
  }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
}

function ensureDay(state: AppState, date: string) {
  return state.logs[date] ?? {
    date, entries: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, water: 0,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING': {
      const targets = calculateTargets(action.profile);
      // hydration goal: ~40ml per kg, rounded to 250ml
      const waterGoal = Math.round((action.profile.weight * 40) / 250) * 250;
      return { ...state, profile: action.profile, targets, onboardingComplete: true, waterGoal };
    }
    case 'UPDATE_PROFILE': {
      const targets = calculateTargets(action.profile);
      const waterGoal = Math.round((action.profile.weight * 40) / 250) * 250;
      return { ...state, profile: action.profile, targets, waterGoal };
    }
    case 'ADD_MEAL_ENTRY': {
      const { date } = action.entry;
      const day = ensureDay(state, date);
      const entries = [...day.entries, action.entry];
      const totals = sumEntries(entries);
      const recentFoodIds = [action.entry.foodId, ...state.recentFoodIds.filter(id => id !== action.entry.foodId)].slice(0, 12);
      return {
        ...state,
        recentFoodIds,
        logs: { ...state.logs, [date]: { ...day, entries, ...totals } },
      };
    }
    case 'REMOVE_MEAL_ENTRY': {
      const { entryId, date } = action;
      const day = ensureDay(state, date);
      const entries = day.entries.filter(e => e.id !== entryId);
      const totals = sumEntries(entries);
      return {
        ...state,
        logs: { ...state.logs, [date]: { ...day, entries, ...totals } },
      };
    }
    case 'ADD_WATER': {
      const day = ensureDay(state, action.date);
      const water = Math.max(0, day.water + action.amount);
      return { ...state, logs: { ...state.logs, [action.date]: { ...day, water } } };
    }
    case 'SET_WATER': {
      const day = ensureDay(state, action.date);
      return { ...state, logs: { ...state.logs, [action.date]: { ...day, water: Math.max(0, action.amount) } } };
    }
    case 'TOGGLE_FAVORITE': {
      const favorites = state.favorites.includes(action.foodId)
        ? state.favorites.filter(id => id !== action.foodId)
        : [...state.favorites, action.foodId];
      return { ...state, favorites };
    }
    case 'ADD_CUSTOM_FOOD': {
      return { ...state, customFoods: [action.food, ...state.customFoods] };
    }
    case 'REMOVE_CUSTOM_FOOD': {
      return { ...state, customFoods: state.customFoods.filter(f => f.id !== action.foodId) };
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

const STORAGE_KEY = 'gym_nutrition_app_v2';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
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
