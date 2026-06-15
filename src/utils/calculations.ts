import type { UserProfile, Macros } from '../types';

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMR(profile: UserProfile): number {
  // Mifflin-St Jeor
  if (profile.gender === 'male') {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  }
  return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
}

export function calculateTDEE(profile: UserProfile): number {
  return calculateBMR(profile) * ACTIVITY_MULTIPLIERS[profile.activityLevel];
}

export function calculateTargets(profile: UserProfile): Macros {
  const tdee = calculateTDEE(profile);

  let calories: number;
  switch (profile.goal) {
    case 'bulk':
      calories = Math.round(tdee + 400);
      break;
    case 'lean_bulk':
      calories = Math.round(tdee + 200);
      break;
    default:
      calories = Math.round(tdee);
  }

  // High protein for muscle building: 2.2g per kg bodyweight
  const protein = Math.round(profile.weight * 2.2);
  // Fat: 25% of calories
  const fat = Math.round((calories * 0.25) / 9);
  // Carbs: remaining calories
  const proteinCals = protein * 4;
  const fatCals = fat * 9;
  const carbs = Math.round((calories - proteinCals - fatCals) / 4);

  return { calories, protein, carbs, fat };
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getTodayKey(): string {
  return formatDate(new Date());
}

export function formatWeight(w: number): string {
  return `${w.toFixed(1)} kg`;
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getMacroColor(macro: 'protein' | 'carbs' | 'fat'): string {
  switch (macro) {
    case 'protein': return '#4ade80';
    case 'carbs': return '#60a5fa';
    case 'fat': return '#f59e0b';
  }
}
