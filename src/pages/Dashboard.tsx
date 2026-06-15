import { Flame, Plus, TrendingUp, Info, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';
import MacroBar from '../components/MacroBar';
import WaterTracker from '../components/WaterTracker';
import { getGreeting } from '../utils/calculations';

const MEAL_TIMES = [
  { type: 'breakfast', label: 'Desayuno', emoji: '🌅' },
  { type: 'lunch', label: 'Almuerzo', emoji: '☀️' },
  { type: 'post_workout', label: 'Post-entreno', emoji: '💪' },
  { type: 'snack', label: 'Snack', emoji: '🥜' },
  { type: 'dinner', label: 'Cena', emoji: '🌙' },
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
  const mealTypesLogged = new Set(todayLog?.entries.map(e => e.mealType) ?? []);

  // streak
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const log = state.logs[key];
    if (log && log.totalCalories > 0) streak++;
    else if (i === 0) continue;
    else break;
  }

  const statusMsg =
    calPct >= 100 ? '¡Meta alcanzada! 🎉 Gran trabajo hoy.' :
    calPct >= 70 ? `Casi lo logras — faltan ${remaining} kcal.` :
    calPct >= 30 ? `Vas bien, sigue sumando comidas.` :
    `Empieza el día: registra tu primera comida.`;

  return (
    <div className="pb-32 px-4 pt-6 max-w-md mx-auto stagger">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm">{getGreeting()},</p>
          <h1 className="text-2xl font-bold text-white">{profile.name} 👋</h1>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 rounded-full px-3.5 py-2">
            <Flame size={15} className="text-orange-400" fill="currentColor" />
            <span className="text-orange-300 text-sm font-bold">{streak}</span>
            <span className="text-orange-400/70 text-xs">días</span>
          </div>
        )}
      </div>

      {/* Hero calorie card */}
      <div className="relative glass rounded-3xl p-6 mb-4 card-shadow overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-6">
          <ProgressRing
            value={calories}
            max={targets.calories}
            size={130}
            strokeWidth={12}
            color="#22c55e"
            label={`${Math.round(calories)}`}
            sublabel={`de ${targets.calories}`}
          />
          <div className="flex-1 space-y-3">
            <MacroBar label="Proteína" current={protein} target={targets.protein} color="#4ade80" />
            <MacroBar label="Carbos" current={carbs} target={targets.carbs} color="#60a5fa" />
            <MacroBar label="Grasa" current={fat} target={targets.fat} color="#f59e0b" />
          </div>
        </div>
        <div className="relative mt-4 pt-4 border-t border-slate-700/40 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${calPct >= 100 ? 'bg-brand-400' : calPct >= 70 ? 'bg-yellow-400' : 'bg-slate-500'}`} />
          <p className="text-slate-300 text-sm">{statusMsg}</p>
        </div>
      </div>

      {/* Big add button */}
      <button
        onClick={() => onNavigate('log')}
        className="press w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/25 mb-4"
      >
        <Plus size={22} strokeWidth={2.5} /> Registrar comida
      </button>

      {/* Water */}
      <div className="mb-4">
        <WaterTracker />
      </div>

      {/* Meals checklist */}
      <div className="glass rounded-3xl p-5 mb-4 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Comidas de hoy</h2>
          <span className="text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full">{mealTypesLogged.size}/{MEAL_TIMES.length}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {MEAL_TIMES.map(meal => {
            const done = mealTypesLogged.has(meal.type);
            return (
              <button
                key={meal.type}
                onClick={() => onNavigate('log')}
                className={`press flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all ${
                  done ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-slate-800/40 border border-transparent'
                }`}
              >
                <span className={`text-xl ${done ? '' : 'opacity-40 grayscale'}`}>{meal.emoji}</span>
                <span className={`text-[9px] font-medium ${done ? 'text-brand-300' : 'text-slate-500'}`}>{meal.label}</span>
                {done && <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-gradient-to-br from-brand-900/50 to-teal-900/40 border border-brand-700/30 rounded-3xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <Info size={18} className="text-brand-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">Tu clave para crecer</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Llega a <span className="text-brand-400 font-semibold">{targets.protein}g de proteína</span> y a tus <span className="text-brand-400 font-semibold">{targets.calories} kcal</span> cada día.
              No necesitas calcular nada: solo registra lo que comes y la app suma por ti.
            </p>
          </div>
        </div>
      </div>

      {/* Quick link to progress */}
      <button
        onClick={() => onNavigate('progress')}
        className="press w-full flex items-center justify-between p-4 rounded-2xl glass-light"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <TrendingUp size={18} className="text-purple-400" />
          </div>
          <span className="text-white font-medium text-sm">Ver mi progreso y peso</span>
        </div>
        <ChevronRight size={18} className="text-slate-500" />
      </button>
    </div>
  );
}
