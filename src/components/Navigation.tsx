import { Home, UtensilsCrossed, Plus, TrendingUp, BookOpen } from 'lucide-react';

type Tab = 'dashboard' | 'meals' | 'log' | 'progress' | 'guide';

interface NavigationProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const sideTabs: { id: Tab; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Inicio' },
  { id: 'meals', icon: UtensilsCrossed, label: 'Plan' },
];
const sideTabsRight: { id: Tab; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
  { id: 'progress', icon: TrendingUp, label: 'Progreso' },
  { id: 'guide', icon: BookOpen, label: 'Guía' },
];

export default function Navigation({ active, onChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto relative px-3 pb-3">
        <div className="glass rounded-3xl flex items-center justify-between px-2 py-2 card-shadow border border-slate-700/40">
          {sideTabs.map(({ id, icon: Icon, label }) => (
            <NavBtn key={id} active={active === id} onClick={() => onChange(id)} Icon={Icon} label={label} />
          ))}

          {/* Center action */}
          <button
            onClick={() => onChange('log')}
            className="press relative -mt-8 w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-teal-500 flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(34,197,94,0.6)] border-4 border-[#0a0f1d]"
          >
            <Plus size={28} className="text-white" strokeWidth={2.5} />
          </button>

          {sideTabsRight.map(({ id, icon: Icon, label }) => (
            <NavBtn key={id} active={active === id} onClick={() => onChange(id)} Icon={Icon} label={label} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavBtn({ active, onClick, Icon, label }: { active: boolean; onClick: () => void; Icon: React.ComponentType<{ size?: number }>; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`press flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-2xl transition-colors ${
        active ? 'text-brand-400' : 'text-slate-500'
      }`}
    >
      <Icon size={21} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
