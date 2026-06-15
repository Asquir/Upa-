import { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Meal {
  time: string;
  name: string;
  emoji: string;
  foods: string[];
  approxKcal: number;
  approxProtein: number;
  tip?: string;
  accent: string;
}

function generateMealPlan(targetCalories: number, weight: number): Meal[] {
  const big = targetCalories > 3000;
  return [
    {
      time: '7:00 - 8:00', name: 'Desayuno', emoji: '🌅', accent: '#f59e0b',
      foods: [`${big ? '100g' : '80g'} de avena con leche`, '3 huevos (o 1 entero + 2 claras)', '1 plátano', 'Café o té sin azúcar'],
      approxKcal: big ? 620 : 500, approxProtein: 35,
      tip: 'La avena da energía duradera y los huevos proteína para arrancar el día.',
    },
    {
      time: '10:30', name: 'Snack mañana', emoji: '⚡', accent: '#22d3ee',
      foods: ['1 yogur griego', `${big ? '2' : '1'} puñado(s) de almendras`, '1 fruta'],
      approxKcal: big ? 380 : 300, approxProtein: 20,
      tip: 'Mantén la proteína cada pocas horas para alimentar el músculo todo el día.',
    },
    {
      time: 'Tras entrenar', name: 'Post-entreno', emoji: '💪', accent: '#4ade80',
      foods: ['1 batido de whey con leche o agua', '1 plátano grande', '(opcional) puñado de arroz'],
      approxKcal: 320, approxProtein: 28,
      tip: 'En los 30-60 min tras entrenar: proteína rápida + carbos para recuperar.',
    },
    {
      time: '13:00 - 14:00', name: 'Almuerzo', emoji: '☀️', accent: '#60a5fa',
      foods: [`${Math.round(weight * 2)}g de pollo o atún`, `${big ? 'plato lleno' : '1 taza'} de arroz o pasta`, 'Ensalada abundante', '½ aguacate'],
      approxKcal: big ? 750 : 600, approxProtein: 55,
      tip: 'Tu comida más importante: proteína + carbos + grasas buenas + verduras.',
    },
    {
      time: '17:30', name: 'Merienda', emoji: '🥜', accent: '#fb7185',
      foods: ['200g yogur griego', '1 puñado de frutos secos', '1 fruta'],
      approxKcal: 280, approxProtein: 22,
      tip: 'Para no llegar con hambre a la cena y seguir sumando proteína.',
    },
    {
      time: '20:30 - 21:00', name: 'Cena', emoji: '🌙', accent: '#a78bfa',
      foods: [`${Math.round(weight * 1.8)}g de salmón, pescado o carne magra`, `${big ? '150g' : '100g'} de batata`, 'Verduras al vapor', '1 cdta de aceite de oliva'],
      approxKcal: big ? 600 : 480, approxProtein: 45,
      tip: 'Proteína para recuperar durante la noche. Carbos moderados.',
    },
  ];
}

interface MealPlanProps {
  onNavigate?: (tab: string) => void;
}

export default function MealPlan({ onNavigate }: MealPlanProps) {
  const { state, targets } = useApp();
  const [open, setOpen] = useState<number | null>(0);
  if (!state.profile || !targets) return null;

  const meals = generateMealPlan(targets.calories, state.profile.weight);

  return (
    <div className="pb-32 px-4 pt-6 max-w-md mx-auto stagger">
      <h1 className="text-2xl font-bold text-white mb-1">Tu plan de comidas 🍽️</h1>
      <p className="text-slate-400 text-sm mb-5">Una guía lista para seguir, ajustada a ti.</p>

      {/* Daily goal summary */}
      <div className="glass rounded-3xl p-5 mb-5 card-shadow">
        <p className="text-slate-400 text-xs mb-3 font-medium">META DIARIA</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: targets.calories, label: 'kcal', c: 'text-brand-400' },
            { value: `${targets.protein}g`, label: 'proteína', c: 'text-green-400' },
            { value: `${targets.carbs}g`, label: 'carbos', c: 'text-blue-400' },
            { value: `${targets.fat}g`, label: 'grasa', c: 'text-yellow-400' },
          ].map(m => (
            <div key={m.label}>
              <div className={`font-bold text-lg ${m.c}`}>{m.value}</div>
              <div className="text-slate-500 text-[10px]">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {meals.map((meal, i) => (
          <div key={i} className="glass rounded-3xl overflow-hidden card-shadow">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-3.5 p-4 text-left">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: `${meal.accent}22` }}>
                {meal.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{meal.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={11} className="text-slate-500" />
                  <span className="text-xs text-slate-500">{meal.time}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${meal.accent}22`, color: meal.accent }}>
                    {meal.approxProtein}g prot
                  </span>
                </div>
              </div>
              <ChevronDown size={18} className={`text-slate-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>

            {open === i && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="h-px bg-slate-700/40 mb-3" />
                <div className="space-y-2 mb-3">
                  {meal.foods.map((food, j) => (
                    <div key={j} className="flex items-start gap-2.5 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: meal.accent }} />
                      <span className="text-slate-300">{food}</span>
                    </div>
                  ))}
                </div>
                {meal.tip && (
                  <div className="rounded-2xl p-3 flex items-start gap-2" style={{ backgroundColor: `${meal.accent}15` }}>
                    <span className="text-sm">💡</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{meal.tip}</p>
                  </div>
                )}
                {onNavigate && (
                  <button onClick={() => onNavigate('log')} className="press w-full mt-3 py-2.5 rounded-xl bg-slate-800/60 text-slate-300 text-sm font-medium hover:bg-slate-700/60">
                    Registrar esta comida →
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 bg-slate-800/40 rounded-2xl p-4">
        <p className="text-slate-400 text-sm leading-relaxed">
          <span className="text-white font-medium">💡 Recuerda:</span> es una guía flexible. Puedes cambiar pollo por pavo,
          arroz por pasta, etc. Lo que importa es llegar a tu proteína y calorías del día.
        </p>
      </div>
    </div>
  );
}
