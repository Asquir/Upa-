import { useState } from 'react';
import { Flame, Plus, TrendingUp, Dumbbell, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressRing from '../components/ProgressRing';
import MacroBar from '../components/MacroBar';
import WaterTracker from '../components/WaterTracker';
import { getGreeting, getTodayKey } from '../utils/calculations';

const DAILY_TIPS = [
  'El músculo crece en la cocina. Hoy, llega a tu proteína sin excusas. 💪',
  'Constancia > perfección. Un día malo no arruina la racha — abandonar sí.',
  'Post-entreno: proteína + carbos en 60 min. No lo dejes pasar.',
  'Cada comida es una oportunidad de acercarte a tus objetivos.',
  'Los que ves grandes en el gym llevan años siendo consistentes. Tú vas por buen camino.',
  'Come para construir el cuerpo que quieres, no el que tienes.',
  'Tu cuerpo no sabe qué día es. Solo sabe lo que le das de comer.',
];

function getLogCta() {
  const h = new Date().getHours();
  if (h < 10) return { text: 'Registrar desayuno', emoji: '🌅' };
  if (h < 14) return { text: 'Registrar almuerzo', emoji: '☀️' };
  if (h < 17) return { text: 'Registrar merienda', emoji: '🥜' };
  if (h < 21) return { text: 'Registrar cena', emoji: '🌙' };
  return { text: 'Añadir comida', emoji: '🍽️' };
}

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { state, todayLog, targets } = useApp();
  const { profile } = state;

  const todayKey = getTodayKey();
  const [trained, setTrained] = useState(() => {
    return localStorage.getItem(`trained_${todayKey}`) === 'true';
  });

  if (!profile || !targets) return null;

  const calories = todayLog?.totalCalories ?? 0;
  const protein = todayLog?.totalProtein ?? 0;
  const carbs = todayLog?.totalCarbs ?? 0;
  const fat = todayLog?.totalFat ?? 0;
  const water = todayLog?.water ?? 0;
  const calPct = Math.round((calories / targets.calories) * 100);

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

  // daily missions
  const missions = [
    {
      id: 'protein',
      emoji: '🥩',
      label: `Llegar a ${targets.protein}g de proteína`,
      sub: `${Math.round(protein)}/${targets.protein}g`,
      done: protein >= targets.protein * 0.9,
    },
    {
      id: 'calories',
      emoji: '⚡',
      label: `Comer ${targets.calories} kcal`,
      sub: `${Math.round(calories)}/${targets.calories} kcal`,
      done: calories >= targets.calories * 0.9,
    },
    {
      id: 'water',
      emoji: '💧',
      label: `Beber ${(state.waterGoal / 1000).toFixed(1)}L de agua`,
      sub: `${(water / 1000).toFixed(1)}/${(state.waterGoal / 1000).toFixed(1)}L`,
      done: water >= state.waterGoal * 0.8,
    },
    {
      id: 'train',
      emoji: '🏋️',
      label: 'Entrenar hoy',
      sub: trained ? '¡Bien hecho!' : 'Toca para marcar',
      done: trained,
      toggle: () => {
        const next = !trained;
        setTrained(next);
        localStorage.setItem(`trained_${todayKey}`, String(next));
      },
    },
  ];

  const doneMissions = missions.filter(m => m.done).length;
  const allDone = doneMissions === missions.length;

  const tip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];
  const cta = getLogCta();

  const streakMsg =
    streak === 0 ? 'Empieza tu racha hoy 🔥' :
    streak < 3 ? `${streak} día${streak > 1 ? 's' : ''} seguido${streak > 1 ? 's' : ''}` :
    streak < 7 ? `${streak} días 🔥 ¡En racha!` :
    `${streak} días 🔥🔥 ¡Semana!`;

  return (
    <div className="pb-32 px-4 pt-6 max-w-md mx-auto stagger">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm">{getGreeting()},</p>
          <h1 className="text-2xl font-bold text-white">{profile.name} 👋</h1>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 cursor-default ${
            streak > 0
              ? 'bg-orange-500/15 border border-orange-500/30'
              : 'bg-slate-800/60 border border-slate-700/50'
          }`}
        >
          <Flame size={15} className={streak > 0 ? 'text-orange-400' : 'text-slate-500'} fill={streak > 0 ? 'currentColor' : 'none'} />
          <span className={`text-xs font-semibold ${streak > 0 ? 'text-orange-300' : 'text-slate-500'}`}>{streakMsg}</span>
        </div>
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
        {calPct >= 90 && (
          <div className="relative mt-4 pt-4 border-t border-slate-700/40 text-center">
            <span className="text-brand-400 font-semibold text-sm">🎉 ¡Meta de calorías alcanzada! Gran trabajo.</span>
          </div>
        )}
      </div>

      {/* Add food CTA */}
      <button
        onClick={() => onNavigate('log')}
        className="press w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-teal-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/25 mb-4"
      >
        <Plus size={22} strokeWidth={2.5} /> {cta.emoji} {cta.text}
      </button>

      {/* Missions card */}
      <div className="glass rounded-3xl p-5 mb-4 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold">Misiones de hoy</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {allDone ? '¡Todo completado! 🏆' : `${doneMissions} de ${missions.length} listas`}
            </p>
          </div>
          <div className={`text-2xl font-black ${allDone ? 'text-brand-400' : 'text-slate-600'}`}>
            {doneMissions}/{missions.length}
          </div>
        </div>

        <div className="space-y-2">
          {missions.map(m => (
            <button
              key={m.id}
              onClick={m.toggle}
              disabled={!m.toggle}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                m.done
                  ? 'bg-brand-500/10 border border-brand-500/25'
                  : 'bg-slate-800/40 border border-slate-700/30'
              } ${m.toggle ? 'press' : 'cursor-default'}`}
            >
              {m.done
                ? <CheckCircle2 size={20} className="text-brand-400 flex-shrink-0" fill="currentColor" />
                : <Circle size={20} className="text-slate-600 flex-shrink-0" />
              }
              <span className="text-xl flex-shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${m.done ? 'text-slate-300 line-through' : 'text-white'}`}>
                  {m.label}
                </div>
                <div className={`text-xs ${m.done ? 'text-brand-400' : 'text-slate-500'}`}>{m.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Water */}
      <div className="mb-4">
        <WaterTracker />
      </div>

      {/* Daily tip */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/40 rounded-3xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <Dumbbell size={20} className="text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
        </div>
      </div>

      {/* Progress link */}
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
        <span className="text-slate-500 text-xs">→</span>
      </button>
    </div>
  );
}
