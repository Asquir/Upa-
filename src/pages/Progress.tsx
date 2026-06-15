import { useState } from 'react';
import { Scale, Award, Check, Flame, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, getTodayKey } from '../utils/calculations';

export default function Progress() {
  const { state, dispatch } = useApp();
  const [weightInput, setWeightInput] = useState('');
  const [saved, setSaved] = useState(false);
  const { weightHistory, logs, profile, targets } = state;

  function logWeight() {
    const w = parseFloat(weightInput);
    if (!w || w < 20 || w > 300) return;
    dispatch({ type: 'LOG_WEIGHT', entry: { date: getTodayKey(), weight: w } });
    setSaved(true);
    setWeightInput('');
    setTimeout(() => setSaved(false), 2000);
  }

  const sortedWeights = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date));
  const currentWeight = sortedWeights[sortedWeights.length - 1]?.weight ?? profile?.weight;
  const firstWeight = sortedWeights[0]?.weight ?? profile?.weight;
  const weightChange = currentWeight && firstWeight ? currentWeight - firstWeight : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = formatDate(d);
    const log = logs[key];
    return {
      key,
      day: d.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 1).toUpperCase(),
      calories: log?.totalCalories ?? 0,
      protein: log?.totalProtein ?? 0,
      hasData: !!log && log.totalCalories > 0,
    };
  });

  const daysWithData = last7.filter(d => d.hasData).length;
  const withData = last7.filter(d => d.hasData);
  const avgCalories = withData.length ? Math.round(withData.reduce((a, d) => a + d.calories, 0) / withData.length) : 0;
  const avgProtein = withData.length ? Math.round(withData.reduce((a, d) => a + d.protein, 0) / withData.length) : 0;
  const maxCal = Math.max(...last7.map(d => d.calories), targets?.calories ?? 2000);

  // total days logged ever
  const totalDays = Object.values(logs).filter(l => l.totalCalories > 0).length;

  return (
    <div className="pb-32 px-4 pt-6 max-w-md mx-auto stagger">
      <h1 className="text-2xl font-bold text-white mb-1">Tu progreso 📈</h1>
      <p className="text-slate-400 text-sm mb-5">La constancia es lo que construye el músculo.</p>

      {/* Achievement row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: <Flame size={18} className="text-orange-400" />, value: daysWithData, label: 'días/semana' },
          { icon: <Check size={18} className="text-brand-400" />, value: totalDays, label: 'días totales' },
          { icon: <Target size={18} className="text-blue-400" />, value: `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}`, label: 'kg cambio' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-3.5 text-center card-shadow">
            <div className="flex justify-center mb-1.5">{s.icon}</div>
            <div className="text-white font-bold text-lg leading-none">{s.value}</div>
            <div className="text-slate-500 text-[10px] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weight */}
      <div className="glass rounded-3xl p-5 mb-4 card-shadow">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Scale size={18} className="text-purple-400" />
          </div>
          <h2 className="text-white font-semibold">Peso corporal</h2>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-4xl font-extrabold text-white leading-none">{currentWeight?.toFixed(1) ?? '—'}<span className="text-lg text-slate-400 ml-1">kg</span></div>
            <div className="text-slate-500 text-xs mt-1">
              {sortedWeights.length > 0 ? `Inicio: ${profile?.weight}kg` : 'Registra tu peso para empezar'}
            </div>
          </div>
          {weightChange !== 0 && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${weightChange > 0 ? 'bg-brand-500/20 text-brand-400' : 'bg-red-500/20 text-red-400'}`}>
              {weightChange > 0 ? '↑' : '↓'} {Math.abs(weightChange).toFixed(1)} kg
            </div>
          )}
        </div>

        {/* Weight chart */}
        {sortedWeights.length > 1 && (() => {
          const slice = sortedWeights.slice(-14);
          const min = Math.min(...slice.map(x => x.weight));
          const max = Math.max(...slice.map(x => x.weight));
          const range = max - min || 1;
          const pts = slice.map((w, i) => {
            const x = (i / (slice.length - 1)) * 100;
            const y = 100 - ((w.weight - min) / range) * 80 - 10;
            return `${x},${y}`;
          }).join(' ');
          return (
            <div className="mb-4 bg-slate-800/40 rounded-2xl p-3">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-20">
                <polyline points={pts} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                {slice.map((w, i) => {
                  const x = (i / (slice.length - 1)) * 100;
                  const y = 100 - ((w.weight - min) / range) * 80 - 10;
                  return <circle key={i} cx={x} cy={y} r="1.5" fill="#c4b5fd" vectorEffect="non-scaling-stroke" />;
                })}
              </svg>
              <div className="text-center text-[10px] text-slate-600 mt-1">Últimos {slice.length} registros</div>
            </div>
          );
        })()}

        <div className="flex gap-2">
          <input
            type="number" placeholder="Tu peso hoy" value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && logWeight()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
          />
          <button onClick={logWeight} className={`press px-5 py-3 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-brand-500 text-white' : 'bg-purple-500/20 border border-purple-500/40 text-purple-300'}`}>
            {saved ? '✓' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Weekly calories */}
      <div className="glass rounded-3xl p-5 mb-4 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Esta semana</h2>
          <span className="text-xs text-slate-400">{daysWithData}/7 días</span>
        </div>
        <div className="flex items-end gap-2 h-32 mb-2">
          {last7.map(d => {
            const pct = d.hasData ? Math.min((d.calories / maxCal) * 100, 100) : 0;
            const isToday = d.key === getTodayKey();
            const hitTarget = targets && d.calories >= targets.calories * 0.9;
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1.5 h-full">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${
                      !d.hasData ? 'bg-slate-800' : hitTarget ? 'bg-gradient-to-t from-brand-500 to-teal-400' : 'bg-gradient-to-t from-slate-600 to-slate-500'
                    }`}
                    style={{ height: d.hasData ? `${Math.max(pct, 6)}%` : '6%' }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${isToday ? 'text-brand-400' : 'text-slate-500'}`}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Averages */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass rounded-2xl p-4 card-shadow">
          <div className="text-slate-400 text-xs mb-1">Media calorías</div>
          <div className="text-2xl font-bold text-white">{avgCalories || '—'}</div>
          {targets && avgCalories > 0 && (
            <div className={`text-xs mt-1 ${avgCalories >= targets.calories * 0.9 ? 'text-brand-400' : 'text-yellow-400'}`}>
              {avgCalories >= targets.calories * 0.9 ? '✓ En meta' : `${targets.calories - avgCalories} kcal menos`}
            </div>
          )}
        </div>
        <div className="glass rounded-2xl p-4 card-shadow">
          <div className="text-slate-400 text-xs mb-1">Media proteína</div>
          <div className="text-2xl font-bold text-white">{avgProtein || '—'}<span className="text-base text-slate-400">g</span></div>
          {targets && avgProtein > 0 && (
            <div className={`text-xs mt-1 ${avgProtein >= targets.protein * 0.9 ? 'text-brand-400' : 'text-yellow-400'}`}>
              {avgProtein >= targets.protein * 0.9 ? '✓ Excelente' : `Meta: ${targets.protein}g`}
            </div>
          )}
        </div>
      </div>

      {/* Motivation */}
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/30 border border-purple-700/30 rounded-3xl p-5">
        <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
          <Award size={16} className="text-purple-400" /> {daysWithData >= 5 ? '¡Vas increíble!' : 'Sigue así'}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          {daysWithData >= 5
            ? 'Mantienes una constancia excelente. En 4-8 semanas verás los resultados en el espejo. 💪'
            : 'Registra al menos 5 días por semana. El músculo se construye con consistencia, no con perfección.'}
        </p>
      </div>
    </div>
  );
}
