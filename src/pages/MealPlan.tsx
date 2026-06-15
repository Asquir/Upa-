import { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Meal {
  time: string;
  name: string;
  emoji: string;
  foods: string[];
  approxKcal: number;
  approxProtein: number;
  tip?: string;
}

function generateMealPlan(targetCalories: number, _targetProtein: number, weight: number): Meal[] {
  // Based on targets, generate a realistic meal plan
  const isHighCal = targetCalories > 3000;

  return [
    {
      time: '7:00 - 8:00',
      name: 'Desayuno',
      emoji: '🌅',
      foods: [
        `${isHighCal ? '100g' : '80g'} avena con leche`,
        '3 huevos revueltos (o 1 entero + 2 claras)',
        '1 banana mediana',
        'Café o té sin azúcar',
      ],
      approxKcal: isHighCal ? 620 : 500,
      approxProtein: 35,
      tip: 'La avena te da energía sostenida y los huevos proteína completa para empezar el día.',
    },
    {
      time: '10:00 - 10:30',
      name: 'Pre-entreno / Snack mañana',
      emoji: '⚡',
      foods: [
        '1 scoop de whey protein (si tienes)',
        `${isHighCal ? '2' : '1'} rebanada(s) de pan integral con mantequilla de maní`,
        '1 manzana o fruta a elección',
      ],
      approxKcal: isHighCal ? 400 : 300,
      approxProtein: 28,
      tip: '30-60 min antes del entreno: carbos de fácil digestión + proteína. Evita comidas pesadas justo antes.',
    },
    {
      time: 'Justo tras entrenar',
      name: 'Post-entreno',
      emoji: '💪',
      foods: [
        '1 scoop de whey con agua o leche (prioritario)',
        '1 banana grande (repone glucógeno rápido)',
        '(Opcional) 50g de arroz blanco',
      ],
      approxKcal: 300,
      approxProtein: 25,
      tip: 'La ventana post-entreno (30 min) es clave: proteína rápida + carbos simples para recuperación muscular.',
    },
    {
      time: '12:30 - 13:30',
      name: 'Almuerzo',
      emoji: '☀️',
      foods: [
        `${Math.round(weight * 2)}g de pechuga de pollo o atún`,
        `${isHighCal ? '200g' : '150g'} de arroz integral o pasta integral (cocido)`,
        'Ensalada abundante (espinaca, tomate, pepino)',
        '½ aguacate',
        '1 cdta de aceite de oliva',
      ],
      approxKcal: isHighCal ? 750 : 600,
      approxProtein: 55,
      tip: 'Esta es tu comida más importante del día. Proteína magra + carbos complejos + grasas buenas.',
    },
    {
      time: '17:00 - 18:00',
      name: 'Merienda',
      emoji: '🥜',
      foods: [
        '200g yogur griego 0%',
        '30g almendras o nueces',
        '1 fruta (kiwi, naranja, fresa)',
      ],
      approxKcal: 280,
      approxProtein: 22,
      tip: 'Snack alto en proteína para no llegar con hambre a cenar y mantener síntesis muscular constante.',
    },
    {
      time: '19:30 - 20:30',
      name: 'Cena',
      emoji: '🌙',
      foods: [
        `${Math.round(weight * 1.8)}g de salmón, tilapia o carne magra`,
        `${isHighCal ? '150g' : '100g'} batata / camote al horno`,
        'Brócoli o verduras al vapor (abundante)',
        '1 cdta de aceite de oliva',
      ],
      approxKcal: isHighCal ? 600 : 480,
      approxProtein: 45,
      tip: 'Mantén los carbos moderados en la cena. La proteína es esencial para la recuperación nocturna.',
    },
  ];
}

export default function MealPlan() {
  const { state, targets } = useApp();
  const [expanded, setExpanded] = useState<number | null>(0);

  if (!state.profile || !targets) return null;

  const meals = generateMealPlan(targets.calories, targets.protein, state.profile.weight);
  const totalPlanKcal = meals.reduce((a, m) => a + m.approxKcal, 0);
  const totalPlanProtein = meals.reduce((a, m) => a + m.approxProtein, 0);

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Plan de comidas</h1>
        <p className="text-slate-400 text-sm">Personalizado para tu objetivo de músculo</p>
      </div>

      {/* Summary card */}
      <div className="glass rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-brand-400" />
          <span className="text-white font-semibold text-sm">Tu meta diaria</span>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: 'Calorías', value: targets.calories, unit: 'kcal', color: 'text-brand-400' },
            { label: 'Proteína', value: `${targets.protein}g`, unit: '', color: 'text-green-400' },
            { label: 'Carbos', value: `${targets.carbs}g`, unit: '', color: 'text-blue-400' },
            { label: 'Grasa', value: `${targets.fat}g`, unit: '', color: 'text-yellow-400' },
          ].map(m => (
            <div key={m.label}>
              <div className={`font-bold text-lg ${m.color}`}>{m.value}</div>
              <div className="text-slate-500 text-xs">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-xs text-slate-500">
          <span>Plan total: ~{totalPlanKcal} kcal</span>
          <span>~{totalPlanProtein}g proteína</span>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        {meals.map((meal, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              <span className="text-2xl">{meal.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-white">{meal.name}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} /> {meal.time}
                  </span>
                  <span className="text-xs text-slate-500">~{meal.approxKcal} kcal • {meal.approxProtein}g prot</span>
                </div>
              </div>
              <div className={`text-slate-400 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}>
                ▼
              </div>
            </button>

            {expanded === i && (
              <div className="px-4 pb-4 space-y-3 animate-fade-in">
                <div className="h-px bg-slate-700/50" />
                <div className="space-y-2">
                  {meal.foods.map((food, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-brand-400 font-bold mt-0.5">•</span>
                      <span className="text-slate-300">{food}</span>
                    </div>
                  ))}
                </div>
                {meal.tip && (
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 flex items-start gap-2">
                    <span className="text-brand-400 text-sm">💡</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{meal.tip}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-5 bg-slate-800/50 rounded-xl p-4">
        <p className="text-slate-400 text-sm leading-relaxed">
          <span className="text-white font-medium">Nota:</span> Este plan es una guía base.
          Puedes intercambiar alimentos equivalentes (pollo por pavo, arroz por pasta, etc.).
          Lo importante es llegar a tus macros diarios.
        </p>
      </div>
    </div>
  );
}
