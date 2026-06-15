import type { FoodItem } from '../types';

export type FoodCategory = 'protein' | 'carbs' | 'fats' | 'veggies' | 'fruits' | 'dairy' | 'snacks' | 'drinks' | 'meals';

export interface CategoryInfo {
  id: FoodCategory;
  label: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'meals', label: 'Platos', emoji: '🍽️', color: '#f97316' },
  { id: 'protein', label: 'Proteínas', emoji: '🍗', color: '#4ade80' },
  { id: 'carbs', label: 'Carbohidratos', emoji: '🍚', color: '#60a5fa' },
  { id: 'fats', label: 'Grasas', emoji: '🥑', color: '#f59e0b' },
  { id: 'veggies', label: 'Verduras', emoji: '🥦', color: '#34d399' },
  { id: 'fruits', label: 'Frutas', emoji: '🍎', color: '#fb7185' },
  { id: 'dairy', label: 'Lácteos', emoji: '🥛', color: '#a78bfa' },
  { id: 'snacks', label: 'Snacks', emoji: '🍫', color: '#f472b6' },
  { id: 'drinks', label: 'Bebidas', emoji: '🥤', color: '#22d3ee' },
];

interface ExtendedFood extends FoodItem {
  category: FoodCategory;
}

export const FOOD_DATABASE: ExtendedFood[] = [
  // ===== PROTEÍNAS =====
  { id: 'chicken_breast', name: 'Pechuga de pollo', emoji: '🍗', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', category: 'protein' },
  { id: 'chicken_thigh', name: 'Muslo de pollo', emoji: '🍗', calories: 209, protein: 26, carbs: 0, fat: 11, serving: '100g', category: 'protein' },
  { id: 'turkey', name: 'Pechuga de pavo', emoji: '🦃', calories: 157, protein: 30, carbs: 0, fat: 3.5, serving: '100g', category: 'protein' },
  { id: 'ground_beef_90', name: 'Carne molida (90/10)', emoji: '🥩', calories: 196, protein: 26, carbs: 0, fat: 10, serving: '100g', category: 'protein' },
  { id: 'beef_steak', name: 'Bistec de res', emoji: '🥩', calories: 271, protein: 25, carbs: 0, fat: 19, serving: '100g', category: 'protein' },
  { id: 'pork_loin', name: 'Lomo de cerdo', emoji: '🥩', calories: 143, protein: 26, carbs: 0, fat: 3.5, serving: '100g', category: 'protein' },
  { id: 'salmon', name: 'Salmón', emoji: '🐟', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g', category: 'protein' },
  { id: 'tuna_can', name: 'Atún en lata (agua)', emoji: '🐟', calories: 116, protein: 26, carbs: 0, fat: 1, serving: '100g', category: 'protein' },
  { id: 'tuna_fresh', name: 'Atún fresco', emoji: '🐟', calories: 144, protein: 23, carbs: 0, fat: 5, serving: '100g', category: 'protein' },
  { id: 'tilapia', name: 'Tilapia', emoji: '🐠', calories: 96, protein: 20, carbs: 0, fat: 1.7, serving: '100g', category: 'protein' },
  { id: 'cod', name: 'Bacalao', emoji: '🐟', calories: 82, protein: 18, carbs: 0, fat: 0.7, serving: '100g', category: 'protein' },
  { id: 'shrimp', name: 'Camarones', emoji: '🦐', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, serving: '100g', category: 'protein' },
  { id: 'eggs', name: 'Huevos enteros', emoji: '🥚', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '100g (≈2 huevos)', category: 'protein' },
  { id: 'egg_white', name: 'Claras de huevo', emoji: '🥚', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, serving: '100g (≈3 claras)', category: 'protein' },
  { id: 'whey_protein', name: 'Proteína whey', emoji: '💪', calories: 120, protein: 24, carbs: 3, fat: 2, serving: '1 scoop (30g)', category: 'protein' },
  { id: 'casein', name: 'Caseína', emoji: '💪', calories: 110, protein: 24, carbs: 3, fat: 1, serving: '1 scoop (30g)', category: 'protein' },
  { id: 'tofu', name: 'Tofu firme', emoji: '🧊', calories: 144, protein: 17, carbs: 3, fat: 9, serving: '100g', category: 'protein' },
  { id: 'lentils', name: 'Lentejas (cocidas)', emoji: '🫘', calories: 116, protein: 9, carbs: 20, fat: 0.4, serving: '100g', category: 'protein' },
  { id: 'chickpeas', name: 'Garbanzos (cocidos)', emoji: '🫘', calories: 164, protein: 9, carbs: 27, fat: 2.6, serving: '100g', category: 'protein' },
  { id: 'black_beans', name: 'Frijoles negros', emoji: '🫘', calories: 132, protein: 9, carbs: 24, fat: 0.5, serving: '100g', category: 'protein' },
  { id: 'edamame', name: 'Edamame', emoji: '🫛', calories: 122, protein: 11, carbs: 10, fat: 5, serving: '100g', category: 'protein' },
  { id: 'ham', name: 'Jamón de pavo', emoji: '🍖', calories: 104, protein: 17, carbs: 2, fat: 3, serving: '100g', category: 'protein' },
  { id: 'sardines', name: 'Sardinas', emoji: '🐟', calories: 208, protein: 25, carbs: 0, fat: 11, serving: '100g', category: 'protein' },

  // ===== CARBOHIDRATOS =====
  { id: 'oats', name: 'Avena', emoji: '🌾', calories: 389, protein: 17, carbs: 66, fat: 7, serving: '100g (seca)', category: 'carbs' },
  { id: 'rice_white', name: 'Arroz blanco', emoji: '🍚', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: '100g (cocido)', category: 'carbs' },
  { id: 'rice_brown', name: 'Arroz integral', emoji: '🍚', calories: 123, protein: 2.7, carbs: 26, fat: 1, serving: '100g (cocido)', category: 'carbs' },
  { id: 'sweet_potato', name: 'Batata/Camote', emoji: '🍠', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: '100g', category: 'carbs' },
  { id: 'potato', name: 'Papa/Patata', emoji: '🥔', calories: 77, protein: 2, carbs: 17, fat: 0.1, serving: '100g', category: 'carbs' },
  { id: 'pasta', name: 'Pasta integral', emoji: '🍝', calories: 158, protein: 5.5, carbs: 31, fat: 1, serving: '100g (cocida)', category: 'carbs' },
  { id: 'pasta_white', name: 'Pasta blanca', emoji: '🍝', calories: 157, protein: 5.8, carbs: 31, fat: 0.9, serving: '100g (cocida)', category: 'carbs' },
  { id: 'bread_whole', name: 'Pan integral', emoji: '🍞', calories: 247, protein: 13, carbs: 41, fat: 4, serving: '100g (≈3 rebanadas)', category: 'carbs' },
  { id: 'bread_white', name: 'Pan blanco', emoji: '🍞', calories: 265, protein: 9, carbs: 49, fat: 3.2, serving: '100g', category: 'carbs' },
  { id: 'quinoa', name: 'Quinoa', emoji: '🌿', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, serving: '100g (cocida)', category: 'carbs' },
  { id: 'couscous', name: 'Cuscús', emoji: '🌾', calories: 112, protein: 3.8, carbs: 23, fat: 0.2, serving: '100g (cocido)', category: 'carbs' },
  { id: 'corn', name: 'Maíz', emoji: '🌽', calories: 96, protein: 3.4, carbs: 21, fat: 1.5, serving: '100g', category: 'carbs' },
  { id: 'tortilla', name: 'Tortilla de maíz', emoji: '🫓', calories: 218, protein: 5.7, carbs: 45, fat: 2.9, serving: '100g (≈4 tortillas)', category: 'carbs' },
  { id: 'tortilla_flour', name: 'Tortilla de harina', emoji: '🫓', calories: 304, protein: 8, carbs: 51, fat: 7.5, serving: '100g', category: 'carbs' },
  { id: 'cereal', name: 'Cereal integral', emoji: '🥣', calories: 379, protein: 8, carbs: 84, fat: 2, serving: '100g', category: 'carbs' },
  { id: 'rice_cake', name: 'Tortita de arroz', emoji: '🍘', calories: 387, protein: 8, carbs: 82, fat: 3, serving: '100g', category: 'carbs' },
  { id: 'bagel', name: 'Bagel', emoji: '🥯', calories: 250, protein: 10, carbs: 49, fat: 1.5, serving: '1 unidad (95g)', category: 'carbs' },

  // ===== GRASAS =====
  { id: 'avocado', name: 'Aguacate/Palta', emoji: '🥑', calories: 160, protein: 2, carbs: 9, fat: 15, serving: '100g (≈½ pieza)', category: 'fats' },
  { id: 'olive_oil', name: 'Aceite de oliva', emoji: '🫗', calories: 119, protein: 0, carbs: 0, fat: 13.5, serving: '1 cda (13.5ml)', category: 'fats' },
  { id: 'coconut_oil', name: 'Aceite de coco', emoji: '🥥', calories: 121, protein: 0, carbs: 0, fat: 13.5, serving: '1 cda (13.5ml)', category: 'fats' },
  { id: 'almonds', name: 'Almendras', emoji: '🥜', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g (≈23 uds)', category: 'fats' },
  { id: 'walnuts', name: 'Nueces', emoji: '🥜', calories: 185, protein: 4.3, carbs: 4, fat: 18, serving: '28g', category: 'fats' },
  { id: 'cashews', name: 'Anacardos', emoji: '🥜', calories: 157, protein: 5, carbs: 9, fat: 12, serving: '28g', category: 'fats' },
  { id: 'peanuts', name: 'Cacahuetes', emoji: '🥜', calories: 161, protein: 7, carbs: 4.6, fat: 14, serving: '28g', category: 'fats' },
  { id: 'peanut_butter', name: 'Mantequilla de maní', emoji: '🥜', calories: 188, protein: 7, carbs: 7, fat: 16, serving: '2 cdas (32g)', category: 'fats' },
  { id: 'almond_butter', name: 'Mantequilla de almendra', emoji: '🥜', calories: 196, protein: 7, carbs: 6, fat: 18, serving: '2 cdas (32g)', category: 'fats' },
  { id: 'chia', name: 'Semillas de chía', emoji: '🌱', calories: 138, protein: 4.7, carbs: 12, fat: 9, serving: '28g', category: 'fats' },
  { id: 'flax', name: 'Semillas de lino', emoji: '🌱', calories: 150, protein: 5, carbs: 8, fat: 12, serving: '28g', category: 'fats' },
  { id: 'dark_chocolate', name: 'Chocolate negro 85%', emoji: '🍫', calories: 170, protein: 2, carbs: 13, fat: 12, serving: '30g', category: 'fats' },

  // ===== VERDURAS =====
  { id: 'broccoli', name: 'Brócoli', emoji: '🥦', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: '100g', category: 'veggies' },
  { id: 'spinach', name: 'Espinaca', emoji: '🥬', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '100g', category: 'veggies' },
  { id: 'lettuce', name: 'Lechuga', emoji: '🥬', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, serving: '100g', category: 'veggies' },
  { id: 'tomato', name: 'Tomate', emoji: '🍅', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: '100g', category: 'veggies' },
  { id: 'cucumber', name: 'Pepino', emoji: '🥒', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, serving: '100g', category: 'veggies' },
  { id: 'carrot', name: 'Zanahoria', emoji: '🥕', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, serving: '100g', category: 'veggies' },
  { id: 'bell_pepper', name: 'Pimiento', emoji: '🫑', calories: 31, protein: 1, carbs: 6, fat: 0.3, serving: '100g', category: 'veggies' },
  { id: 'zucchini', name: 'Calabacín', emoji: '🥒', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, serving: '100g', category: 'veggies' },
  { id: 'mushrooms', name: 'Champiñones', emoji: '🍄', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, serving: '100g', category: 'veggies' },
  { id: 'onion', name: 'Cebolla', emoji: '🧅', calories: 40, protein: 1.1, carbs: 9, fat: 0.1, serving: '100g', category: 'veggies' },
  { id: 'green_beans', name: 'Judías verdes', emoji: '🫛', calories: 31, protein: 1.8, carbs: 7, fat: 0.2, serving: '100g', category: 'veggies' },
  { id: 'asparagus', name: 'Espárragos', emoji: '🌿', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, serving: '100g', category: 'veggies' },
  { id: 'cauliflower', name: 'Coliflor', emoji: '🥦', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, serving: '100g', category: 'veggies' },

  // ===== FRUTAS =====
  { id: 'banana', name: 'Plátano/Banana', emoji: '🍌', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: '1 mediano (100g)', category: 'fruits' },
  { id: 'apple', name: 'Manzana', emoji: '🍎', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: '1 mediana (100g)', category: 'fruits' },
  { id: 'orange', name: 'Naranja', emoji: '🍊', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, serving: '1 mediana (100g)', category: 'fruits' },
  { id: 'strawberry', name: 'Fresas', emoji: '🍓', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, serving: '100g', category: 'fruits' },
  { id: 'blueberry', name: 'Arándanos', emoji: '🫐', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, serving: '100g', category: 'fruits' },
  { id: 'grapes', name: 'Uvas', emoji: '🍇', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, serving: '100g', category: 'fruits' },
  { id: 'pineapple', name: 'Piña', emoji: '🍍', calories: 50, protein: 0.5, carbs: 13, fat: 0.1, serving: '100g', category: 'fruits' },
  { id: 'mango', name: 'Mango', emoji: '🥭', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, serving: '100g', category: 'fruits' },
  { id: 'watermelon', name: 'Sandía', emoji: '🍉', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, serving: '100g', category: 'fruits' },
  { id: 'kiwi', name: 'Kiwi', emoji: '🥝', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, serving: '100g', category: 'fruits' },
  { id: 'pear', name: 'Pera', emoji: '🍐', calories: 57, protein: 0.4, carbs: 15, fat: 0.1, serving: '1 mediana (100g)', category: 'fruits' },
  { id: 'peach', name: 'Melocotón', emoji: '🍑', calories: 39, protein: 0.9, carbs: 10, fat: 0.3, serving: '100g', category: 'fruits' },
  { id: 'dates', name: 'Dátiles', emoji: '🌴', calories: 277, protein: 1.8, carbs: 75, fat: 0.2, serving: '100g', category: 'fruits' },
  { id: 'raisins', name: 'Pasas', emoji: '🍇', calories: 299, protein: 3.1, carbs: 79, fat: 0.5, serving: '100g', category: 'fruits' },

  // ===== LÁCTEOS =====
  { id: 'greek_yogurt', name: 'Yogur griego 0%', emoji: '🫙', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: '100g', category: 'dairy' },
  { id: 'greek_yogurt_full', name: 'Yogur griego entero', emoji: '🫙', calories: 97, protein: 9, carbs: 4, fat: 5, serving: '100g', category: 'dairy' },
  { id: 'cottage_cheese', name: 'Queso cottage', emoji: '🧀', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: '100g', category: 'dairy' },
  { id: 'milk', name: 'Leche entera', emoji: '🥛', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, serving: '100ml', category: 'dairy' },
  { id: 'milk_skim', name: 'Leche descremada', emoji: '🥛', calories: 35, protein: 3.4, carbs: 5, fat: 0.1, serving: '100ml', category: 'dairy' },
  { id: 'cheese', name: 'Queso cheddar', emoji: '🧀', calories: 402, protein: 25, carbs: 1.3, fat: 33, serving: '100g', category: 'dairy' },
  { id: 'mozzarella', name: 'Mozzarella', emoji: '🧀', calories: 280, protein: 28, carbs: 3, fat: 17, serving: '100g', category: 'dairy' },
  { id: 'yogurt_natural', name: 'Yogur natural', emoji: '🥛', calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, serving: '100g', category: 'dairy' },

  // ===== SNACKS =====
  { id: 'protein_bar', name: 'Barra de proteína', emoji: '🍫', calories: 220, protein: 20, carbs: 22, fat: 7, serving: '1 barra (60g)', category: 'snacks' },
  { id: 'granola', name: 'Granola', emoji: '🥣', calories: 471, protein: 10, carbs: 64, fat: 20, serving: '100g', category: 'snacks' },
  { id: 'popcorn', name: 'Palomitas', emoji: '🍿', calories: 387, protein: 12, carbs: 78, fat: 4.5, serving: '100g', category: 'snacks' },
  { id: 'hummus', name: 'Hummus', emoji: '🥣', calories: 166, protein: 8, carbs: 14, fat: 10, serving: '100g', category: 'snacks' },
  { id: 'crackers', name: 'Galletas saladas', emoji: '🍘', calories: 421, protein: 9, carbs: 74, fat: 9, serving: '100g', category: 'snacks' },
  { id: 'trail_mix', name: 'Mezcla de frutos secos', emoji: '🥜', calories: 462, protein: 14, carbs: 45, fat: 29, serving: '100g', category: 'snacks' },

  // ===== BEBIDAS =====
  { id: 'orange_juice', name: 'Zumo de naranja', emoji: '🧃', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, serving: '100ml', category: 'drinks' },
  { id: 'sports_drink', name: 'Bebida isotónica', emoji: '🥤', calories: 26, protein: 0, carbs: 6, fat: 0, serving: '100ml', category: 'drinks' },
  { id: 'coffee', name: 'Café solo', emoji: '☕', calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '240ml', category: 'drinks' },
  { id: 'almond_milk', name: 'Leche de almendras', emoji: '🥛', calories: 17, protein: 0.6, carbs: 0.6, fat: 1.5, serving: '100ml', category: 'drinks' },
  { id: 'oat_milk', name: 'Leche de avena', emoji: '🥛', calories: 47, protein: 1, carbs: 7, fat: 1.5, serving: '100ml', category: 'drinks' },
  { id: 'soda', name: 'Refresco', emoji: '🥤', calories: 42, protein: 0, carbs: 11, fat: 0, serving: '100ml', category: 'drinks' },

  // ===== PLATOS PREPARADOS =====
  { id: 'paella_marisco', name: 'Paella de marisco', emoji: '🥘', calories: 148, protein: 9, carbs: 24, fat: 3, serving: '100g', category: 'meals' },
  { id: 'paella_valenciana', name: 'Paella valenciana', emoji: '🥘', calories: 162, protein: 10, carbs: 25, fat: 4, serving: '100g', category: 'meals' },
  { id: 'tortilla_espanola', name: 'Tortilla española', emoji: '🍳', calories: 185, protein: 10, carbs: 14, fat: 10, serving: '100g', category: 'meals' },
  { id: 'pasta_bolognesa', name: 'Pasta boloñesa', emoji: '🍝', calories: 145, protein: 9, carbs: 18, fat: 4.5, serving: '100g', category: 'meals' },
  { id: 'espagueti_carbonara', name: 'Espaguetis carbonara', emoji: '🍝', calories: 195, protein: 9, carbs: 26, fat: 7, serving: '100g', category: 'meals' },
  { id: 'pizza_margherita', name: 'Pizza margherita', emoji: '🍕', calories: 266, protein: 11, carbs: 33, fat: 10, serving: '100g', category: 'meals' },
  { id: 'hamburguesa', name: 'Hamburguesa', emoji: '🍔', calories: 295, protein: 17, carbs: 24, fat: 14, serving: '100g', category: 'meals' },
  { id: 'bocadillo_jamon', name: 'Bocadillo de jamón', emoji: '🥖', calories: 255, protein: 15, carbs: 30, fat: 8, serving: '100g', category: 'meals' },
  { id: 'sandwich_mixto', name: 'Sandwich / Bocadillo', emoji: '🥪', calories: 240, protein: 12, carbs: 30, fat: 8, serving: '100g', category: 'meals' },
  { id: 'lentejas_guisadas', name: 'Lentejas guisadas', emoji: '🫘', calories: 130, protein: 9, carbs: 18, fat: 3, serving: '100g', category: 'meals' },
  { id: 'arroz_pollo', name: 'Arroz con pollo', emoji: '🍗', calories: 160, protein: 12, carbs: 20, fat: 4, serving: '100g', category: 'meals' },
  { id: 'ensalada_mixta', name: 'Ensalada mixta', emoji: '🥗', calories: 65, protein: 3, carbs: 6, fat: 3.5, serving: '100g', category: 'meals' },
  { id: 'ensalada_cesar', name: 'Ensalada César con pollo', emoji: '🥗', calories: 120, protein: 11, carbs: 7, fat: 6, serving: '100g', category: 'meals' },
  { id: 'pollo_asado', name: 'Pollo asado', emoji: '🍗', calories: 215, protein: 28, carbs: 0, fat: 12, serving: '100g', category: 'meals' },
  { id: 'pollo_plancha', name: 'Pollo a la plancha con arroz', emoji: '🍗', calories: 145, protein: 18, carbs: 16, fat: 3, serving: '100g', category: 'meals' },
  { id: 'croquetas', name: 'Croquetas', emoji: '🍳', calories: 265, protein: 8, carbs: 22, fat: 16, serving: '100g', category: 'meals' },
  { id: 'sopa_cocido', name: 'Sopa / Caldo', emoji: '🍲', calories: 45, protein: 3, carbs: 6, fat: 1, serving: '100g', category: 'meals' },
  { id: 'cocido_madrileno', name: 'Cocido / Puchero', emoji: '🫕', calories: 155, protein: 12, carbs: 14, fat: 5.5, serving: '100g', category: 'meals' },
  { id: 'estofado', name: 'Estofado de carne', emoji: '🫕', calories: 150, protein: 14, carbs: 10, fat: 6, serving: '100g', category: 'meals' },
  { id: 'sushi', name: 'Sushi / Makis', emoji: '🍣', calories: 145, protein: 7, carbs: 24, fat: 2, serving: '100g', category: 'meals' },
  { id: 'kebab', name: 'Kebab', emoji: '🌯', calories: 260, protein: 16, carbs: 25, fat: 10, serving: '100g', category: 'meals' },
  { id: 'tacos', name: 'Tacos', emoji: '🌮', calories: 218, protein: 11, carbs: 22, fat: 9, serving: '100g', category: 'meals' },
  { id: 'wrap_pollo', name: 'Wrap de pollo', emoji: '🌯', calories: 200, protein: 14, carbs: 22, fat: 6, serving: '100g', category: 'meals' },
  { id: 'ensaladilla_rusa', name: 'Ensaladilla rusa', emoji: '🥗', calories: 185, protein: 3.5, carbs: 11, fat: 15, serving: '100g', category: 'meals' },
  { id: 'gazpacho', name: 'Gazpacho', emoji: '🍅', calories: 50, protein: 1, carbs: 8, fat: 2, serving: '100g', category: 'meals' },
  { id: 'patatas_bravas', name: 'Patatas bravas', emoji: '🥔', calories: 185, protein: 3, carbs: 22, fat: 9, serving: '100g', category: 'meals' },
  { id: 'arroz_cubana', name: 'Arroz a la cubana', emoji: '🍳', calories: 155, protein: 7, carbs: 22, fat: 5, serving: '100g', category: 'meals' },
  { id: 'pollo_curry', name: 'Pollo al curry', emoji: '🍛', calories: 170, protein: 16, carbs: 8, fat: 8, serving: '100g', category: 'meals' },
  { id: 'pollo_empanado', name: 'Pollo empanado', emoji: '🍗', calories: 248, protein: 18, carbs: 15, fat: 13, serving: '100g', category: 'meals' },
  { id: 'bacalao_tomate', name: 'Bacalao con tomate', emoji: '🐟', calories: 110, protein: 15, carbs: 6, fat: 3, serving: '100g', category: 'meals' },
  { id: 'salmon_plancha', name: 'Salmón a la plancha', emoji: '🐟', calories: 210, protein: 22, carbs: 0, fat: 14, serving: '100g', category: 'meals' },
  { id: 'merluza_horno', name: 'Merluza al horno', emoji: '🐟', calories: 105, protein: 19, carbs: 3, fat: 2, serving: '100g', category: 'meals' },
  { id: 'fabada', name: 'Fabada / Judías', emoji: '🫘', calories: 145, protein: 8, carbs: 17, fat: 5, serving: '100g', category: 'meals' },
  { id: 'mac_cheese', name: 'Mac & cheese', emoji: '🧀', calories: 180, protein: 7, carbs: 20, fat: 8, serving: '100g', category: 'meals' },
];

export interface Portion {
  label: string;
  hint: string;
  grams: number;
}

// Raciones intuitivas por categoría — el usuario no necesita saber gramos.
export const PORTION_PRESETS: Record<FoodCategory, Portion[]> = {
  meals: [
    { label: 'Poco', hint: 'ración pequeña', grams: 200 },
    { label: 'Normal', hint: 'plato estándar', grams: 350 },
    { label: 'Bastante', hint: 'plato grande', grams: 500 },
    { label: 'Mucho', hint: 'doble ración', grams: 700 },
  ],
  protein: [
    { label: 'Poco', hint: '½ filete', grams: 75 },
    { label: 'Normal', hint: '1 filete / palma', grams: 150 },
    { label: 'Bastante', hint: 'filete grande', grams: 200 },
    { label: 'Mucho', hint: '2 filetes', grams: 300 },
  ],
  carbs: [
    { label: 'Poco', hint: '½ taza', grams: 75 },
    { label: 'Normal', hint: '1 taza', grams: 150 },
    { label: 'Bastante', hint: 'plato lleno', grams: 220 },
    { label: 'Mucho', hint: 'plato grande', grams: 300 },
  ],
  fats: [
    { label: 'Pizca', hint: '1 cdta', grams: 8 },
    { label: 'Normal', hint: '1 cda / puñado', grams: 20 },
    { label: 'Bastante', hint: '2 cdas', grams: 35 },
  ],
  veggies: [
    { label: 'Poco', hint: 'guarnición', grams: 80 },
    { label: 'Normal', hint: '1 taza', grams: 150 },
    { label: 'Mucho', hint: 'plato lleno', grams: 250 },
  ],
  fruits: [
    { label: 'Pequeña', hint: '½ pieza', grams: 80 },
    { label: 'Normal', hint: '1 pieza', grams: 150 },
    { label: 'Grande', hint: 'pieza grande', grams: 220 },
  ],
  dairy: [
    { label: 'Poco', hint: '½ vaso/tarrina', grams: 100 },
    { label: 'Normal', hint: '1 vaso/tarrina', grams: 200 },
    { label: 'Bastante', hint: 'ración grande', grams: 300 },
  ],
  snacks: [
    { label: 'Poco', hint: 'puñado', grams: 30 },
    { label: 'Normal', hint: '1 ración', grams: 60 },
    { label: 'Bastante', hint: 'ración grande', grams: 100 },
  ],
  drinks: [
    { label: 'Vaso', hint: '250ml', grams: 250 },
    { label: 'Medio', hint: '125ml', grams: 125 },
    { label: 'Botella', hint: '500ml', grams: 500 },
  ],
};

export function searchFoods(query: string, category?: FoodCategory): ExtendedFood[] {
  const q = query.toLowerCase().trim();
  let results = FOOD_DATABASE;
  if (category) {
    results = results.filter(f => f.category === category);
  }
  if (q) {
    results = results.filter(f => f.name.toLowerCase().includes(q));
  }
  return results;
}

export function getFoodById(id: string): ExtendedFood | undefined {
  return FOOD_DATABASE.find(f => f.id === id);
}
