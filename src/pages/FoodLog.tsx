import { useState, useMemo } from 'react';
import { Search, Trash2, Star, Clock, Sparkles, Check, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getFoodById, CATEGORIES, PORTION_PRESETS, FOOD_DATABASE, type FoodCategory } from '../utils/foodDatabase';
import { getTodayKey } from '../utils/calculations';
import type { FoodItem, MealEntry, CustomFood } from '../types';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno', emoji: '🌅' },
  { value: 'lunch', label: 'Almuerzo', emoji: '☀️' },
  { value: 'dinner', label: 'Cena', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🥜' },
  { value: 'pre_workout', label: 'Pre-entreno', emoji: '⚡' },
  { value: 'post_workout', label: 'Post-entreno', emoji: '💪' },
] as const;

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function guessMealType(): MealEntry['mealType'] {
  const h = new Date().getHours();
  if (h < 11) return 'breakfast';
  if (h < 16) return 'lunch';
  if (h < 19) return 'snack';
  return 'dinner';
}

type FoodWithCat = FoodItem & { category?: FoodCategory };

export default function FoodLog() {
  const { state, dispatch, todayLog, targets } = useApp();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<FoodCategory | 'all'>('all');
  const [selectedFood, setSelectedFood] = useState<FoodWithCat | null>(null);
  const [grams, setGrams] = useState(150);
  const [mealType, setMealType] = useState<MealEntry['mealType']>(guessMealType());
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const calories = todayLog?.totalCalories ?? 0;
  const protein = todayLog?.totalProtein ?? 0;
  const entries = todayLog?.entries ?? [];

  const allFoods: FoodWithCat[] = useMemo(
    () => [...state.customFoods, ...FOOD_DATABASE],
    [state.customFoods]
  );

  const results: FoodWithCat[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = allFoods;
    if (activeCat !== 'all') list = list.filter(f => (f as { category?: string }).category === activeCat);
    if (q) list = list.filter(f => f.name.toLowerCase().includes(q));
    return list;
  }, [query, activeCat, allFoods]);

  const favoriteFoods = state.favorites.map(getFoodById).filter(Boolean) as FoodItem[];
  const recentFoods = state.recentFoodIds
    .map(id => allFoods.find(f => f.id === id))
    .filter(Boolean)
    .slice(0, 6) as FoodWithCat[];

  function openFood(food: FoodWithCat) {
    const cat = food.category ?? 'protein';
    const preset = PORTION_PRESETS[cat]?.[1] ?? PORTION_PRESETS.protein[1];
    setSelectedFood(food);
    setGrams(preset.grams);
  }

  function addEntry(food: FoodWithCat, qty: number) {
    const ratio = qty / 100;
    const entry: MealEntry = {
      id: genId(),
      foodId: food.id,
      foodName: food.name,
      emoji: food.emoji,
      quantity: qty,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      mealType,
      timestamp: new Date().toISOString(),
      date: getTodayKey(),
    };
    dispatch({ type: 'ADD_MEAL_ENTRY', entry });
    setSelectedFood(null);
    setJustAdded(food.id);
    setTimeout(() => setJustAdded(null), 1400);
  }

  function removeEntry(id: string) {
    dispatch({ type: 'REMOVE_MEAL_ENTRY', entryId: id, date: getTodayKey() });
  }

  const grouped = MEAL_TYPES.map(mt => ({
    ...mt,
    entries: entries.filter(e => e.mealType === mt.value),
  })).filter(g => g.entries.length > 0);

  return (
    <div className="pb-32 px-4 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">¿Qué comiste? 🍽️</h1>
      <p className="text-slate-400 text-sm mb-5">Toca un alimento y elige cuánto. Yo calculo las calorías por ti.</p>

      {/* Today progress mini */}
      {targets && (
        <div className="glass rounded-2xl p-4 mb-5 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Calorías hoy</span>
              <span className="text-white font-semibold">{Math.round(calories)}<span className="text-slate-500">/{targets.calories}</span></span>
            </div>
            <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${Math.min((calories / targets.calories) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">{Math.round(protein)}g</div>
            <div className="text-slate-500 text-[10px]">proteína</div>
          </div>
        </div>
      )}

      {/* Meal type selector */}
      <p className="text-slate-400 text-xs font-medium mb-2">¿En qué comida?</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-5">
        {MEAL_TYPES.map(mt => (
          <button
            key={mt.value}
            onClick={() => setMealType(mt.value)}
            className={`press flex-none flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              mealType === mt.value ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'bg-slate-800/60 text-slate-400'
            }`}
          >
            <span>{mt.emoji}</span> {mt.label}
          </button>
        ))}
      </div>

      {/* Favorites */}
      {favoriteFoods.length > 0 && !query && (
        <div className="mb-5">
          <p className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1.5"><Star size={12} className="text-yellow-400" fill="currentColor" /> Favoritos</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {favoriteFoods.map(f => (
              <button key={f.id} onClick={() => openFood(f)} className="press flex-none flex flex-col items-center gap-1 w-20 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-[10px] text-slate-300 text-center leading-tight line-clamp-2">{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recents */}
      {recentFoods.length > 0 && !query && activeCat === 'all' && (
        <div className="mb-5">
          <p className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1.5"><Clock size={12} /> Recientes</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {recentFoods.map(f => (
              <button key={f.id} onClick={() => openFood(f)} className="press flex-none flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <span className="text-lg">{f.emoji}</span>
                <span className="text-xs text-slate-300 whitespace-nowrap">{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-3">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar alimento..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-slate-800/70 border border-slate-700 rounded-2xl pl-10 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm transition-colors"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-4">
        <button
          onClick={() => setActiveCat('all')}
          className={`press flex-none px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activeCat === 'all' ? 'bg-slate-200 text-slate-900' : 'bg-slate-800/60 text-slate-400'}`}
        >
          Todo
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`press flex-none flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activeCat === c.id ? 'text-slate-900' : 'bg-slate-800/60 text-slate-400'}`}
            style={activeCat === c.id ? { backgroundColor: c.color } : {}}
          >
            <span>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {results.slice(0, 40).map(food => (
          <button
            key={food.id}
            onClick={() => openFood(food)}
            className={`press relative flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all ${
              justAdded === food.id ? 'bg-brand-500/20 border border-brand-500/50' : 'bg-slate-800/50 border border-slate-700/40'
            }`}
          >
            <span className="text-2xl flex-shrink-0">{food.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="text-white text-xs font-medium truncate">{food.name}</div>
              <div className="text-slate-500 text-[10px]">{food.calories} kcal · {food.protein}g prot</div>
            </div>
            {justAdded === food.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-brand-500/30 rounded-2xl animate-pop">
                <Check size={24} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Create custom food */}
      <button
        onClick={() => setShowCreate(true)}
        className="press w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-600 text-slate-400 text-sm hover:border-brand-500 hover:text-brand-400 transition-colors mb-6"
      >
        <Sparkles size={15} /> Crear mi propio alimento
      </button>

      {/* Logged entries */}
      {grouped.length > 0 && (
        <div className="space-y-4 stagger">
          {grouped.map(group => (
            <div key={group.value}>
              <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2 mb-2">
                <span>{group.emoji}</span> {group.label}
                <span className="text-slate-600 text-xs">· {Math.round(group.entries.reduce((a, e) => a + e.calories, 0))} kcal</span>
              </h3>
              <div className="space-y-2">
                {group.entries.map(entry => (
                  <div key={entry.id} className="glass-light rounded-2xl p-3 flex items-center gap-3">
                    <span className="text-xl">{entry.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{entry.foodName}</div>
                      <div className="text-slate-400 text-xs">{entry.quantity}g · {entry.protein}g prot</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">{entry.calories}</div>
                      <div className="text-slate-500 text-[10px]">kcal</div>
                    </div>
                    <button onClick={() => removeEntry(entry.id)} className="press text-slate-600 hover:text-red-400 ml-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Portion picker sheet */}
      {selectedFood && (
        <PortionSheet
          food={selectedFood}
          grams={grams}
          setGrams={setGrams}
          isFavorite={state.favorites.includes(selectedFood.id)}
          onToggleFav={() => dispatch({ type: 'TOGGLE_FAVORITE', foodId: selectedFood.id })}
          onClose={() => setSelectedFood(null)}
          onAdd={() => addEntry(selectedFood, grams)}
        />
      )}

      {/* Create food sheet */}
      {showCreate && (
        <CreateFoodSheet
          onClose={() => setShowCreate(false)}
          onCreate={(food) => {
            dispatch({ type: 'ADD_CUSTOM_FOOD', food });
            setShowCreate(false);
            openFood(food);
          }}
        />
      )}
    </div>
  );
}

function PortionSheet({ food, grams, setGrams, isFavorite, onToggleFav, onClose, onAdd }: {
  food: FoodWithCat; grams: number; setGrams: (g: number) => void;
  isFavorite: boolean; onToggleFav: () => void; onClose: () => void; onAdd: () => void;
}) {
  const cat = food.category ?? 'protein';
  const presets = PORTION_PRESETS[cat] ?? PORTION_PRESETS.protein;
  const ratio = grams / 100;
  const kcal = Math.round(food.calories * ratio);
  const prot = Math.round(food.protein * ratio * 10) / 10;
  const carb = Math.round(food.carbs * ratio * 10) / 10;
  const fat = Math.round(food.fat * ratio * 10) / 10;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 animate-fade-in" />
      <div className="relative w-full max-w-md glass rounded-t-3xl p-5 pb-8 animate-slide-up border-t border-slate-700/50" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl">{food.emoji}</span>
          <div className="flex-1">
            <div className="text-white font-semibold text-lg leading-tight">{food.name}</div>
            <div className="text-slate-400 text-xs">{food.calories} kcal por 100g</div>
          </div>
          <button onClick={onToggleFav} className="press w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
            <Star size={18} className={isFavorite ? 'text-yellow-400' : 'text-slate-500'} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Portion presets */}
        <p className="text-slate-400 text-xs font-medium mb-2">¿Cuánto comiste?</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => setGrams(p.grams)}
              className={`press p-3 rounded-2xl text-left transition-all ${
                grams === p.grams ? 'bg-brand-500/20 border-2 border-brand-500' : 'bg-slate-800/60 border-2 border-transparent'
              }`}
            >
              <div className="text-white font-semibold text-sm">{p.label}</div>
              <div className="text-slate-400 text-xs">{p.hint} · {p.grams}g</div>
            </button>
          ))}
        </div>

        {/* Fine adjust */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-slate-500 text-xs">Ajustar:</span>
          <input
            type="range" min={10} max={500} step={5} value={grams}
            onChange={e => setGrams(+e.target.value)}
            className="flex-1 accent-brand-500"
          />
          <span className="text-white text-sm font-semibold w-14 text-right">{grams}g</span>
        </div>

        {/* Live macros */}
        <div className="grid grid-cols-4 gap-2 mb-5 text-center">
          {[
            { v: kcal, l: 'kcal', c: 'text-brand-400' },
            { v: `${prot}g`, l: 'prot', c: 'text-green-400' },
            { v: `${carb}g`, l: 'carb', c: 'text-blue-400' },
            { v: `${fat}g`, l: 'grasa', c: 'text-yellow-400' },
          ].map(m => (
            <div key={m.l} className="bg-slate-800/50 rounded-xl py-2">
              <div className={`font-bold ${m.c}`}>{m.v}</div>
              <div className="text-slate-500 text-[10px]">{m.l}</div>
            </div>
          ))}
        </div>

        <button onClick={onAdd} className="press w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2">
          <Check size={20} /> Añadir
        </button>
      </div>
    </div>
  );
}

function CreateFoodSheet({ onClose, onCreate }: { onClose: () => void; onCreate: (f: CustomFood) => void }) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const [kcal, setKcal] = useState('');
  const [prot, setProt] = useState('');
  const [carb, setCarb] = useState('');
  const [fat, setFat] = useState('');

  const emojis = ['🍽️', '🍗', '🍚', '🥑', '🥦', '🍎', '🥛', '🍫', '🥤', '🍕', '🍔', '🌮', '🍱', '🥗'];
  const valid = name.trim() && +kcal > 0;

  function create() {
    if (!valid) return;
    onCreate({
      id: 'custom_' + genId(),
      name: name.trim(),
      emoji,
      calories: +kcal,
      protein: +prot || 0,
      carbs: +carb || 0,
      fat: +fat || 0,
      serving: '100g',
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 animate-fade-in" />
      <div className="relative w-full max-w-md glass rounded-t-3xl p-5 pb-8 animate-slide-up border-t border-slate-700/50 max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onClose} className="press text-slate-400"><ChevronLeft size={20} /></button>
          <h2 className="text-white font-semibold text-lg">Crear alimento</h2>
        </div>
        <p className="text-slate-400 text-xs mb-5 ml-7">Pon los valores por cada 100g (mira la etiqueta del producto).</p>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {emojis.map(e => (
            <button key={e} onClick={() => setEmoji(e)} className={`press flex-none w-11 h-11 rounded-xl text-xl flex items-center justify-center ${emoji === e ? 'bg-brand-500/30 border-2 border-brand-500' : 'bg-slate-800/60'}`}>{e}</button>
          ))}
        </div>

        <input type="text" placeholder="Nombre del alimento" value={name} onChange={e => setName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 mb-3" />

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { ph: 'Calorías', v: kcal, set: setKcal, unit: 'kcal' },
            { ph: 'Proteína', v: prot, set: setProt, unit: 'g' },
            { ph: 'Carbos', v: carb, set: setCarb, unit: 'g' },
            { ph: 'Grasa', v: fat, set: setFat, unit: 'g' },
          ].map(f => (
            <div key={f.ph}>
              <label className="text-slate-400 text-xs mb-1 block">{f.ph} <span className="text-slate-600">/100g</span></label>
              <input type="number" placeholder={f.unit} value={f.v} onChange={e => f.set(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 text-center" />
            </div>
          ))}
        </div>

        <button onClick={create} disabled={!valid}
          className={`press w-full py-3.5 rounded-2xl font-semibold ${valid ? 'bg-gradient-to-r from-brand-500 to-teal-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
          Crear y usar
        </button>
      </div>
    </div>
  );
}
