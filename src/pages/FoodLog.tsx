import { useState } from 'react';
import { Search, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchFoods } from '../utils/foodDatabase';
import { getTodayKey } from '../utils/calculations';
import type { FoodItem, MealEntry } from '../types';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno', emoji: '🌅' },
  { value: 'lunch', label: 'Almuerzo', emoji: '☀️' },
  { value: 'dinner', label: 'Cena', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🥜' },
  { value: 'pre_workout', label: 'Pre-entreno', emoji: '⚡' },
  { value: 'post_workout', label: 'Post-entreno', emoji: '💪' },
] as const;

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function FoodLog() {
  const { dispatch, todayLog, targets } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchFoods(''));
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [mealType, setMealType] = useState<MealEntry['mealType']>('lunch');
  const [showSearch, setShowSearch] = useState(false);

  const calories = todayLog?.totalCalories ?? 0;
  const protein = todayLog?.totalProtein ?? 0;
  const entries = todayLog?.entries ?? [];

  function handleSearch(q: string) {
    setQuery(q);
    setResults(searchFoods(q));
  }

  function selectFood(food: FoodItem) {
    setSelectedFood(food);
    setQuantity('100');
    setShowSearch(false);
    setQuery('');
  }

  function addEntry() {
    if (!selectedFood) return;
    const qty = parseFloat(quantity) || 100;
    const ratio = qty / 100;
    const entry: MealEntry = {
      id: generateId(),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      emoji: selectedFood.emoji,
      quantity: qty,
      calories: Math.round(selectedFood.calories * ratio),
      protein: Math.round(selectedFood.protein * ratio * 10) / 10,
      carbs: Math.round(selectedFood.carbs * ratio * 10) / 10,
      fat: Math.round(selectedFood.fat * ratio * 10) / 10,
      mealType,
      timestamp: new Date().toISOString(),
      date: getTodayKey(),
    };
    dispatch({ type: 'ADD_MEAL_ENTRY', entry });
    setSelectedFood(null);
    setQuantity('100');
  }

  function removeEntry(id: string) {
    dispatch({ type: 'REMOVE_MEAL_ENTRY', entryId: id, date: getTodayKey() });
  }

  // Group entries by meal type
  const grouped = MEAL_TYPES.map(mt => ({
    ...mt,
    entries: entries.filter(e => e.mealType === mt.value),
  })).filter(g => g.entries.length > 0);

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white mb-1">Registro de hoy</h1>
        <p className="text-slate-400 text-sm">
          {Math.round(calories)} kcal • {Math.round(protein)}g proteína registrados
        </p>
      </div>

      {/* Quick summary */}
      {targets && (
        <div className="glass rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Calorías</span>
                <span>{Math.round(calories)}/{targets.calories}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${Math.min((calories / targets.calories) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Proteína</span>
                <span>{Math.round(protein)}/{targets.protein}g</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min((protein / targets.protein) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add food section */}
      <div className="glass rounded-2xl p-4 mb-5">
        <h2 className="text-white font-semibold mb-3">Añadir alimento</h2>

        {/* Meal type selector */}
        <div className="mb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {MEAL_TYPES.map(mt => (
              <button
                key={mt.value}
                onClick={() => setMealType(mt.value)}
                className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  mealType === mt.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {mt.emoji} {mt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food search */}
        {!selectedFood ? (
          <div>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar alimento... (ej: pollo, arroz)"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => setShowSearch(true)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm transition-colors"
              />
            </div>
            {(showSearch || query) && (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {results.map(food => (
                  <button
                    key={food.id}
                    onClick={() => selectFood(food)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 transition-colors text-left"
                  >
                    <span className="text-xl">{food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{food.name}</div>
                      <div className="text-slate-400 text-xs">{food.serving} • {food.calories} kcal • {food.protein}g prot</div>
                    </div>
                    <Plus size={16} className="text-brand-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl mb-3">
              <span className="text-2xl">{selectedFood.emoji}</span>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{selectedFood.name}</div>
                <div className="text-slate-400 text-xs">{selectedFood.serving} base</div>
              </div>
              <button onClick={() => setSelectedFood(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-end gap-3 mb-3">
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">Cantidad (gramos)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-center font-semibold focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <div className="text-center pb-3">
                <div className="text-brand-400 font-bold">
                  {Math.round(selectedFood.calories * (parseFloat(quantity) || 100) / 100)} kcal
                </div>
                <div className="text-slate-400 text-xs">
                  {Math.round(selectedFood.protein * (parseFloat(quantity) || 100) / 100 * 10) / 10}g prot
                </div>
              </div>
            </div>

            <button
              onClick={addEntry}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold hover:from-brand-400 hover:to-teal-400 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Añadir al registro
            </button>
          </div>
        )}
      </div>

      {/* Logged entries */}
      {grouped.length > 0 ? (
        <div className="space-y-4">
          {grouped.map(group => (
            <div key={group.value}>
              <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2 mb-2">
                <span>{group.emoji}</span> {group.label}
                <span className="text-slate-600">
                  ({Math.round(group.entries.reduce((a, e) => a + e.calories, 0))} kcal)
                </span>
              </h3>
              <div className="space-y-2">
                {group.entries.map(entry => (
                  <div key={entry.id} className="glass-light rounded-xl p-3 flex items-center gap-3">
                    <span className="text-xl">{entry.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{entry.foodName}</div>
                      <div className="text-slate-400 text-xs">
                        {entry.quantity}g • {entry.protein}g prot • {entry.carbs}g carb • {entry.fat}g grasa
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">{entry.calories}</div>
                      <div className="text-slate-500 text-xs">kcal</div>
                    </div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors ml-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500">
          <div className="text-4xl mb-3">🥗</div>
          <p className="font-medium text-slate-400">Sin registros aún</p>
          <p className="text-sm mt-1">Busca un alimento arriba para empezar</p>
        </div>
      )}
    </div>
  );
}
