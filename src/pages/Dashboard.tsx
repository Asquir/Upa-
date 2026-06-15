import { Flame, Droplets, Zap, Trophy, ChevronRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';
import MacroBar from '../components/MacroBar';
import { getGreeting } from '../utils/calculations';

const MEAL_TIMES = [
  { type: 'breakfast', label: 'Desayuno', time: '7:00 - 8:00', emoji: '🌅' },
  { type: 'pre_workout', label: 'Pre-entreno', time: '1h antes', emoji: '⚡' },
  { type: 'post_workout', label: 'Post-entreno', time: 'Tras entrenar', emoji: '💪' },
  { type: 'lunch', label: 'Almuerzo', time: '12:00 - 13:00', emoji: '☀️' },
  { type: 'dinner', label: 'Cena', time: '19:00 - 20:00', emoji: '🌙' },
  { type: 'snack', label: 'Snack', time: 'Entre comidas', emoji: '🥜' },
] as const;

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { state, todayLog, targets } = useApp();
  const { profile } = state;

  if (!profile || !targets) return null;

  const calories = todayLog?.totalCalories ?? 0;
  const protein = todayLog?.totalProtein ?? 0;
  const carbs = todayLog?.totalCarbs ?? 0;
  const fat = todayLog?.totalFat ?? 0;

  const calPct = Math.round((calories / targets.calories) * 100);
  const remaining = Math.max(targets.calories - calories, 0);

  // Meals with entries today
  const mealTypesLogged = new Set(todayLog?.entries.map(e => e.mealType) ?? []);

  // Streak: count consecutive days with logs
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const log = state.logs[key];
    if (log && log.totalCalories > 0) streak++;
    else break;
  }

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in">
        <div>
          <p className="text-slate-400 text-sm">{getGreeting()},</p>
          <h1 className="text-2xl font-bold text-white">{profile.name} 👋</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 rounded-full px-3 py-1.5">
          <Flame size={14} className="text-orange-400" />
          <span className="text-orange-300 text-sm font-semibold">{streak}d</span>
        </div>
      </div>

      {/* Calorie ring */}
      <div className="glass rounded-2xl p-5 mb-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-lg">Calorías de hoy</h2>
            <p className="text-slate-400 text-sm">
              {remaining > 0 ? `Faltan ${remaining} kcal` : '¡Meta alcanzada! 🎉'}
            </p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              calPct >= 90 ? 'bg-brand-500/20 text-brand-400' :
              calPct >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-slate-700 text-slate-400'
            }`}>
              {calPct}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ProgressRing
            value={calories}
            max={targets.calories}
            size={110}
            strokeWidth={10}
            color="#22c55e"
            label={`${Math.round(calories)}`}
            sublabel="kcal"
          />
          <div className="flex-1 space-y-3">
            <MacroBar label="Proteína" current={protein} target={targets.protein} color="#4ade80" />
            <MacroBar label="Carbos" current={carbs} target={targets.carbs} color="#60a5fa" />
            <MacroBar label="Grasa" current={fat} target={targets.fat} color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Meta kcal', value: targets.calories, icon: <Zap size={16} />, color: 'text-brand-400' },
          { label: 'Proteína', value: `${targets.protein}g`, icon: <Droplets size={16} />, color: 'text-blue-400' },
          { label: 'Peso obj.', value: `${profile.weight}kg`, icon: <TrendingUp size={16} />, color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-light rounded-xl p-3 text-center">
            <div className={`flex justify-center mb-1 ${stat.color}`}>{stat.icon}</div>
            <div className="text-white font-bold">{stat.value}</div>
            <div className="text-slate-500 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Meal checklist */}
      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Comidas del día</h2>
          <span className="text-xs text-slate-400">{mealTypesLogged.size}/{MEAL_TIMES.length}</span>
        </div>
        <div className="space-y-2">
          {MEAL_TIMES.map(meal => {
            const done = mealTypesLogged.has(meal.type);
            return (
              <div
                key={meal.type}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  done ? 'bg-brand-500/10 border border-brand-500/20' : 'bg-slate-800/40'
                }`}
              >
                <span className="text-xl">{meal.emoji}</span>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${done ? 'text-white' : 'text-slate-300'}`}>
                    {meal.label}
                  </div>
                  <div className="text-xs text-slate-500">{meal.time}</div>
                </div>
                {done ? (
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate('log')}
                    className="text-xs text-slate-500 hover:text-brand-400 transition-colors"
                  >
                    + Añadir
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip card */}
      <div className="bg-gradient-to-r from-brand-900/60 to-teal-900/60 border border-brand-700/30 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <Trophy size={20} className="text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">Consejo del día</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              La proteína es clave: intenta llegar a <span className="text-brand-400 font-medium">{targets.protein}g</span> cada día.
              Distribuye entre {Math.ceil(targets.protein / 40)}–{Math.ceil(targets.protein / 30)} comidas para maximizar la síntesis muscular.
            </p>
          </div>
        </div>
      </div>

      {/* Quick log button */}
      <button
        onClick={() => onNavigate('log')}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold text-lg hover:from-brand-400 hover:to-teal-400 transition-all shadow-lg shadow-brand-500/25 active:scale-95"
      >
        Registrar comida
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
