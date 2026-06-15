import { Home, UtensilsCrossed, BookOpen, TrendingUp, User } from 'lucide-react';

type Tab = 'dashboard' | 'meals' | 'log' | 'progress' | 'guide';

interface NavigationProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Inicio' },
  { id: 'meals', icon: UtensilsCrossed, label: 'Plan' },
  { id: 'log', icon: BookOpen, label: 'Registro' },
  { id: 'progress', icon: TrendingUp, label: 'Progreso' },
  { id: 'guide', icon: User, label: 'Guía' },
];

export default function Navigation({ active, onChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-700/50">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
              active === id
                ? 'text-brand-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon size={20} className={active === id ? 'drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]' : ''} />
            <span className="text-[10px] font-medium">{label}</span>
            {active === id && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-400" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
