interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
}

export default function MacroBar({ label, current, target, unit = 'g', color }: MacroBarProps) {
  const pct = Math.min((current / target) * 100, 100);
  const over = current > target;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className={`font-semibold ${over ? 'text-red-400' : 'text-white'}`}>
          {Math.round(current)}<span className="text-slate-500 font-normal">/{target}{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: over ? '#f87171' : color,
          }}
        />
      </div>
    </div>
  );
}
