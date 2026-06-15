import type { FoodItem } from '../types';

export const FOOD_DATABASE: FoodItem[] = [
  // Proteínas
  { id: 'chicken_breast', name: 'Pechuga de pollo', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { id: 'tuna_can', name: 'Atún en lata', emoji: '🐟', calories: 132, protein: 29, carbs: 0, fat: 1, serving: '100g' },
  { id: 'eggs', name: 'Huevos enteros', emoji: '🥚', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '100g (≈2 huevos)' },
  { id: 'egg_white', name: 'Claras de huevo', emoji: '🥚', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, serving: '100g (≈3 claras)' },
  { id: 'ground_beef', name: 'Carne molida (90/10)', emoji: '🥩', calories: 196, protein: 26, carbs: 0, fat: 10, serving: '100g' },
  { id: 'salmon', name: 'Salmón', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g' },
  { id: 'cottage_cheese', name: 'Queso cottage', emoji: '🧀', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: '100g' },
  { id: 'greek_yogurt', name: 'Yogur griego 0%', emoji: '🫙', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: '100g' },
  { id: 'whey_protein', name: 'Proteína whey', emoji: '💪', calories: 120, protein: 24, carbs: 3, fat: 2, serving: '1 scoop (30g)' },
  { id: 'turkey', name: 'Pechuga de pavo', emoji: '🦃', calories: 157, protein: 30, carbs: 0, fat: 3.5, serving: '100g' },
  { id: 'tilapia', name: 'Tilapia', emoji: '🐠', calories: 96, protein: 20, carbs: 0, fat: 1.7, serving: '100g' },

  // Carbohidratos
  { id: 'oats', name: 'Avena', emoji: '🌾', calories: 389, protein: 17, carbs: 66, fat: 7, serving: '100g (seca)' },
  { id: 'rice', name: 'Arroz blanco', emoji: '🍚', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g (cocido)' },
  { id: 'brown_rice', name: 'Arroz integral', emoji: '🍚', calories: 123, protein: 2.7, carbs: 26, fat: 1, serving: '100g (cocido)' },
  { id: 'sweet_potato', name: 'Batata/Camote', emoji: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: '100g' },
  { id: 'pasta', name: 'Pasta integral', emoji: '🍝', calories: 158, protein: 5.5, carbs: 31, fat: 1, serving: '100g (cocida)' },
  { id: 'banana', name: 'Plátano/Banana', emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 mediano (100g)' },
  { id: 'bread', name: 'Pan integral', emoji: '🍞', calories: 247, protein: 13, carbs: 41, fat: 4, serving: '100g (≈2-3 rebanadas)' },
  { id: 'quinoa', name: 'Quinoa', emoji: '🌿', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, serving: '100g (cocida)' },
  { id: 'potato', name: 'Papa/Patata', emoji: '🥔', calories: 77, protein: 2, carbs: 17, fat: 0.1, serving: '100g' },

  // Grasas saludables
  { id: 'avocado', name: 'Aguacate/Palta', emoji: '🥑', calories: 160, protein: 2, carbs: 9, fat: 15, serving: '100g (≈½ pieza)' },
  { id: 'olive_oil', name: 'Aceite de oliva', emoji: '🫙', calories: 119, protein: 0, carbs: 0, fat: 13.5, serving: '1 cucharada (13.5ml)' },
  { id: 'almonds', name: 'Almendras', emoji: '🥜', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g (≈23 almendras)' },
  { id: 'peanut_butter', name: 'Mantequilla de maní', emoji: '🥜', calories: 188, protein: 7, carbs: 7, fat: 16, serving: '2 cucharadas (32g)' },

  // Verduras
  { id: 'broccoli', name: 'Brócoli', emoji: '🥦', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: '100g' },
  { id: 'spinach', name: 'Espinaca', emoji: '🥬', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '100g' },
  { id: 'tomato', name: 'Tomate', emoji: '🍅', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: '100g' },

  // Lácteos
  { id: 'milk', name: 'Leche entera', emoji: '🥛', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, serving: '100ml' },
  { id: 'milk_skim', name: 'Leche descremada', emoji: '🥛', calories: 35, protein: 3.4, carbs: 5, fat: 0.1, serving: '100ml' },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DATABASE.slice(0, 12);
  return FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(q)
  );
}
