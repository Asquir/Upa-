export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'bulk' | 'lean_bulk' | 'maintain';
}

export interface Macros {
  calories: number;
  protein: number; // g
  carbs: number;   // g
  fat: number;     // g
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

export interface MealEntry {
  id: string;
  foodId: string;
  foodName: string;
  emoji: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  timestamp: string;
  date: string;
}

export interface DayLog {
  date: string;
  entries: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  weight?: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface AppState {
  profile: UserProfile | null;
  targets: Macros | null;
  logs: Record<string, DayLog>;
  weightHistory: WeightEntry[];
  onboardingComplete: boolean;
}
