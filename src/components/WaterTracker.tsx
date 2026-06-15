import { Droplet, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayKey } from '../utils/calculations';

export default function WaterTracker() {
  const { state, todayLog, dispatch } = useApp();
  const water = todayLog?.water ?? 0;
  const goal = state.waterGoal;
  const pct = Math.min((water / goal) * 100, 100);
  const glasses = Math.round(goal / 250);
  const filledGlasses = Math.floor(water / 250);

  function change(amount: number) {
    dispatch({ type: 'ADD_WATER', amount, date: getTodayKey() });
  }

  return (
    <div className="glass rounded-3xl p-5 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Droplet size={18} className="text-cyan-400" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-white font-semibold leading-tight">Hidratación</h2>
            <p className="text-slate-400 text-xs">{(water / 1000).toFixed(2)}L de {(goal / 1000).toFixed(1)}L</p>
          </div>
        </div>
        <span className="text-cyan-400 font-bold text-lg">{Math.round(pct)}%</span>
      </div>

      {/* Glasses row */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {Array.from({ length: glasses }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 min-w-[14px] h-9 rounded-lg transition-all duration-300 ${
              i < filledGlasses
                ? 'bg-gradient-to-t from-cyan-500 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                : 'bg-slate-700/40'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => change(-250)}
          className="press w-11 h-11 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-600/50"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={() => change(250)}
          className="press flex-1 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center gap-2 text-cyan-300 font-semibold hover:bg-cyan-500/25"
        >
          <Plus size={16} /> 1 vaso (250ml)
        </button>
        <button
          onClick={() => change(500)}
          className="press w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-xs font-bold hover:bg-cyan-500/25"
        >
          +½L
        </button>
      </div>
    </div>
  );
}
