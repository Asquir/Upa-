import { useState } from 'react';
import { ChevronDown, User, Edit3, RotateCcw, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTDEE } from '../utils/calculations';
import type { UserProfile } from '../types';

const FAQ = [
  {
    q: '¿Qué es una caloría y cuántas necesito?',
    a: 'Una caloría es energía. Tu cuerpo gasta cierta cantidad cada día solo para vivir y moverse. Para CRECER músculo necesitas comer un poco más de lo que gastas. La app ya calculó tu número exacto — solo tienes que llegar a él comiendo.',
  },
  {
    q: '¿Tengo que contar o pesar la comida?',
    a: 'No. Cuando registras un alimento, solo eliges "Poco / Normal / Bastante". La app traduce eso a calorías por ti. Si quieres más precisión puedes ajustar, pero no es necesario para progresar.',
  },
  {
    q: '¿Por qué tanta proteína?',
    a: 'La proteína son los "ladrillos" del músculo. Necesitas 1.6-2.2g por kg de peso al día. Sin suficiente proteína, por mucho que entrenes, el músculo no crece. Es lo más importante de todo.',
  },
  {
    q: '¿Qué son los macros?',
    a: 'Son los 3 tipos de nutrientes: Proteína (construye músculo), Carbohidratos (te dan energía para entrenar) y Grasas (salud y hormonas). La app reparte tus calorías entre los tres automáticamente.',
  },
  {
    q: '¿Qué como antes y después de entrenar?',
    a: 'Antes (1-2h): carbos + algo de proteína (avena con whey, pan con pavo). Después (30-60 min): proteína rápida + carbos (batido de whey + plátano). Eso maximiza la recuperación.',
  },
  {
    q: '¿Cuándo veré resultados?',
    a: 'Fuerza: 2-4 semanas. Músculo visible: 2-3 meses de constancia. Sé paciente — el músculo de verdad tarda, pero se queda. Lo importante es no abandonar.',
  },
  {
    q: '¿Necesito suplementos?',
    a: 'No son obligatorios. Los más útiles: proteína whey (cómoda y barata), creatina (mejora fuerza, la más estudiada) y vitamina D. Pero la comida real siempre es primero.',
  },
];

const MUSCLE_FOODS = [
  { emoji: '🍗', name: 'Pollo', why: 'Proteína magra' },
  { emoji: '🥚', name: 'Huevos', why: 'Proteína completa' },
  { emoji: '🐟', name: 'Salmón', why: 'Proteína + omega 3' },
  { emoji: '🌾', name: 'Avena', why: 'Energía duradera' },
  { emoji: '🍚', name: 'Arroz', why: 'Carbos limpios' },
  { emoji: '🍠', name: 'Batata', why: 'Carbos + vitaminas' },
  { emoji: '🥑', name: 'Aguacate', why: 'Grasas buenas' },
  { emoji: '🫙', name: 'Yogur griego', why: 'Proteína + calcio' },
];

const activityLabels: Record<UserProfile['activityLevel'], string> = {
  sedentary: 'Sedentario', light: 'Ligero', moderate: 'Moderado', active: 'Activo', very_active: 'Muy activo',
};
const goalLabels: Record<UserProfile['goal'], string> = {
  bulk: 'Volumen', lean_bulk: 'Volumen Limpio', maintain: 'Mantenimiento',
};

export default function Guide() {
  const { state, dispatch } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    weight: String(state.profile?.weight ?? ''),
    activityLevel: state.profile?.activityLevel ?? 'moderate',
    goal: state.profile?.goal ?? 'lean_bulk',
  });

  const { profile, targets } = state;
  if (!profile || !targets) return null;
  const tdee = Math.round(calculateTDEE(profile));

  function save() {
    if (!profile) return;
    dispatch({
      type: 'UPDATE_PROFILE',
      profile: {
        ...profile,
        weight: parseFloat(form.weight) || profile.weight,
        activityLevel: form.activityLevel as UserProfile['activityLevel'],
        goal: form.goal as UserProfile['goal'],
      },
    });
    setEditing(false);
  }

  return (
    <div className="pb-32 px-4 pt-6 max-w-md mx-auto stagger">
      <h1 className="text-2xl font-bold text-white mb-1">Guía y perfil 📖</h1>
      <p className="text-slate-400 text-sm mb-5">Entiende tus números y aprende lo esencial.</p>

      {/* Numbers explained — visual */}
      <div className="glass rounded-3xl p-5 mb-4 card-shadow">
        <h2 className="text-white font-semibold mb-1">Tus números explicados</h2>
        <p className="text-slate-400 text-xs mb-4">Esto es lo que tu cuerpo necesita cada día para crecer:</p>

        <div className="space-y-3">
          <NumberRow icon={<Flame size={18} className="text-brand-400" />} bg="bg-brand-500/15"
            value={`${targets.calories} kcal`} title="Energía total"
            desc="Lo que debes comer al día para tener superávit y crecer." />
          <NumberRow icon={<Beef size={18} className="text-green-400" />} bg="bg-green-500/15"
            value={`${targets.protein} g`} title="Proteína"
            desc="Lo más importante: construye el músculo. No bajes de aquí." />
          <NumberRow icon={<Wheat size={18} className="text-blue-400" />} bg="bg-blue-500/15"
            value={`${targets.carbs} g`} title="Carbohidratos"
            desc="Tu combustible para entrenar fuerte y con energía." />
          <NumberRow icon={<Droplet size={18} className="text-yellow-400" />} bg="bg-yellow-500/15"
            value={`${targets.fat} g`} title="Grasas"
            desc="Necesarias para tus hormonas y salud general." />
        </div>

        <div className="mt-4 bg-gradient-to-r from-brand-900/40 to-teal-900/30 rounded-2xl p-3 flex items-center justify-between text-sm">
          <span className="text-slate-300">Gastas ~<span className="text-white font-semibold">{tdee}</span> · comes <span className="text-brand-400 font-semibold">{targets.calories}</span></span>
          <span className="text-teal-400 font-bold">+{targets.calories - tdee} para crecer</span>
        </div>
      </div>

      {/* Profile */}
      <div className="glass rounded-3xl p-5 mb-4 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center"><User size={18} className="text-slate-300" /></div>
            <h2 className="text-white font-semibold">Mi perfil</h2>
          </div>
          <button onClick={() => setEditing(!editing)} className="press flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full">
            <Edit3 size={13} /> {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {!editing ? (
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Peso', value: `${profile.weight} kg` },
              { label: 'Altura', value: `${profile.height} cm` },
              { label: 'Edad', value: `${profile.age}` },
              { label: 'Actividad', value: activityLabels[profile.activityLevel] },
              { label: 'Objetivo', value: goalLabels[profile.goal] },
              { label: 'Agua/día', value: `${(state.waterGoal / 1000).toFixed(1)}L` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800/40 rounded-xl p-3 text-center">
                <div className="text-white font-semibold text-sm">{value}</div>
                <div className="text-slate-500 text-[10px] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Peso actual (kg)</label>
              <input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Actividad</label>
              <select value={form.activityLevel} onChange={e => setForm(f => ({ ...f, activityLevel: e.target.value as UserProfile['activityLevel'] }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500">
                <option value="sedentary">Sedentario</option>
                <option value="light">Ligero (1-3 días)</option>
                <option value="moderate">Moderado (3-5 días)</option>
                <option value="active">Activo (6-7 días)</option>
                <option value="very_active">Muy activo (2x/día)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Objetivo</label>
              <select value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value as UserProfile['goal'] }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500">
                <option value="lean_bulk">Volumen Limpio (+200 kcal)</option>
                <option value="bulk">Volumen (+400 kcal)</option>
                <option value="maintain">Mantenimiento</option>
              </select>
            </div>
            <button onClick={save} className="press w-full py-3 rounded-xl bg-brand-500 text-white font-semibold">Guardar cambios</button>
          </div>
        )}
      </div>

      {/* Best foods */}
      <div className="glass rounded-3xl p-5 mb-4 card-shadow">
        <h2 className="text-white font-semibold mb-3">🏆 Mejores alimentos para músculo</h2>
        <div className="grid grid-cols-4 gap-2">
          {MUSCLE_FOODS.map(f => (
            <div key={f.name} className="bg-slate-800/40 rounded-2xl p-2.5 text-center">
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-white text-[11px] font-medium leading-tight">{f.name}</div>
              <div className="text-slate-500 text-[9px] mt-0.5 leading-tight">{f.why}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-white font-semibold mb-3 px-1">Preguntas frecuentes</h2>
      <div className="space-y-2 mb-5">
        {FAQ.map((item, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
              <span className="text-white text-sm font-medium pr-4">{item.q}</span>
              <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === i && (
              <div className="px-4 pb-4 animate-fade-in">
                <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => { if (confirm('¿Resetear toda la app? Perderás tus datos.')) dispatch({ type: 'RESET' }); }}
        className="press flex items-center gap-2 mx-auto text-slate-600 hover:text-red-400 text-sm">
        <RotateCcw size={14} /> Reiniciar aplicación
      </button>
    </div>
  );
}

function NumberRow({ icon, bg, value, title, desc }: { icon: React.ReactNode; bg: string; value: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-white font-bold">{value}</span>
          <span className="text-slate-300 text-sm font-medium">{title}</span>
        </div>
        <p className="text-slate-500 text-xs leading-tight">{desc}</p>
      </div>
    </div>
  );
}
