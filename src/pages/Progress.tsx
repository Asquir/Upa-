import { useState } from 'react';
import { Scale, TrendingUp, Calendar, Award } from 'lucide-react';
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

  // Last 7 days stats
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = formatDate(d);
    const log = logs[key];
    return {
      key,
      day: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      calories: log?.totalCalories ?? 0,
      protein: log?.totalProtein ?? 0,
      hasData: !!log && log.totalCalories > 0,
    };
  });

  const daysWithData = last7Days.filter(d => d.hasData).length;
  const avgCalories = daysWithData > 0
    ? Math.round(last7Days.filter(d => d.hasData).reduce((a, d) => a + d.calories, 0) / daysWithData)
    : 0;
  const avgProtein = daysWithData > 0
    ? Math.round(last7Days.filter(d => d.hasData).reduce((a, d) => a + d.protein, 0) / daysWithData)
    : 0;

  const maxCalInWeek = Math.max(...last7Days.map(d => d.calories), targets?.calories ?? 2000);

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Tu progreso</h1>
        <p className="text-slate-400 text-sm">Seguimiento semanal y de peso</p>
      </div>

      {/* Weight section */}
      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={18} className="text-brand-400" />
          <h2 className="text-white font-semibold">Registro de peso</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{profile?.weight ?? '—'}</div>
            <div className="text-slate-500 text-xs">Peso inicial</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{currentWeight?.toFixed(1) ?? '—'}</div>
            <div className="text-slate-500 text-xs">Actual (kg)</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${weightChange > 0 ? 'text-brand-400' : weightChange < 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
            </div>
            <div className="text-slate-500 text-xs">Cambio (kg)</div>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Tu peso hoy (kg)"
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm transition-colors"
            onKeyDown={e => e.key === 'Enter' && logWeight()}
          />
          <button
            onClick={logWeight}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              saved
                ? 'bg-brand-500 text-white'
                : 'bg-brand-500/20 border border-brand-500/40 text-brand-400 hover:bg-brand-500/30'
            }`}
          >
            {saved ? '✓ Guardado' : 'Guardar'}
          </button>
        </div>

        {/* Weight history dots */}
        {sortedWeights.length > 1 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-end gap-2 h-16">
              {sortedWeights.slice(-14).map((w, i) => {
                const min = Math.min(...sortedWeights.slice(-14).map(x => x.weight));
                const max = Math.max(...sortedWeights.slice(-14).map(x => x.weight));
                const range = max - min || 1;
                const pct = ((w.weight - min) / range) * 70 + 15;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                    <div
                      className="w-2 bg-brand-500 rounded-full"
                      style={{ height: `${pct}%` }}
                      title={`${w.date}: ${w.weight}kg`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-slate-600 text-center mt-1">Últimos {Math.min(sortedWeights.length, 14)} registros</div>
          </div>
        )}
      </div>

      {/* Weekly calories chart */}
      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-400" />
            <h2 className="text-white font-semibold">Últimos 7 días</h2>
          </div>
          <span className="text-xs text-slate-400">{daysWithData}/7 días registrados</span>
        </div>

        <div className="flex items-end gap-1.5 h-28 mb-3">
          {last7Days.map(d => {
            const pct = d.hasData ? Math.min((d.calories / maxCalInWeek) * 100, 100) : 0;
            const isToday = d.key === getTodayKey();
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      d.hasData
                        ? isToday ? 'bg-brand-500' : 'bg-brand-500/50'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: d.hasData ? `${Math.max(pct, 8)}%` : '8%' }}
                    title={d.hasData ? `${Math.round(d.calories)} kcal` : 'Sin datos'}
                  />
                </div>
                <span className={`text-xs capitalize ${isToday ? 'text-brand-400 font-semibold' : 'text-slate-500'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Target line indicator */}
        {targets && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-8 h-0.5 bg-slate-600 border-t border-dashed border-slate-500" />
            <span>Meta: {targets.calories} kcal</span>
          </div>
        )}
      </div>

      {/* Weekly stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-brand-400" />
            <span className="text-slate-400 text-xs">Prom. calorías</span>
          </div>
          <div className="text-2xl font-bold text-white">{avgCalories || '—'}</div>
          {targets && avgCalories > 0 && (
            <div className={`text-xs mt-1 ${avgCalories >= targets.calories * 0.9 ? 'text-brand-400' : 'text-yellow-400'}`}>
              {avgCalories >= targets.calories * 0.9 ? '✓ En meta' : `Faltan ${targets.calories - avgCalories} kcal`}
            </div>
          )}
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-green-400" />
            <span className="text-slate-400 text-xs">Prom. proteína</span>
          </div>
          <div className="text-2xl font-bold text-white">{avgProtein || '—'}<span className="text-base text-slate-400">g</span></div>
          {targets && avgProtein > 0 && (
            <div className={`text-xs mt-1 ${avgProtein >= targets.protein * 0.9 ? 'text-brand-400' : 'text-yellow-400'}`}>
              {avgProtein >= targets.protein * 0.9 ? '✓ Excelente' : `Meta: ${targets.protein}g`}
            </div>
          )}
        </div>
      </div>

      {/* Consistency message */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/30 rounded-2xl p-4">
        <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
          <Award size={16} className="text-purple-400" />
          La clave del progreso
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          El músculo se construye con <span className="text-white font-medium">consistencia</span>.
          Lleva registros {daysWithData < 5 ? 'más' : ''} días por semana y verás resultados en 4–8 semanas.
          {daysWithData >= 5 && ' ¡Vas muy bien! 🎉'}
        </p>
      </div>
    </div>
  );
}
