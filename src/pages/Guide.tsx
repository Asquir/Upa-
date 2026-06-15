import { useState } from 'react';
import { ChevronDown, User, Edit3, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTDEE } from '../utils/calculations';
import type { UserProfile } from '../types';

const FAQ = [
  {
    q: '¿Por qué necesito tanta proteína?',
    a: 'Para construir músculo necesitas 1.6–2.2g de proteína por kg de peso corporal al día. La proteína proporciona los aminoácidos que son los "ladrillos" del tejido muscular. Sin suficiente proteína, tu cuerpo no puede reparar y crecer el músculo dañado en el entrenamiento.',
  },
  {
    q: '¿En qué orden importan más los macros?',
    a: 'Primero proteína (más crítica), luego calorías totales (superávit = crecimiento), luego carbos (energía para entrenar), y por último grasas (hormonas y salud general). Si solo puedes controlar una cosa, controla la proteína.',
  },
  {
    q: '¿Cuándo debo comer antes y después de entrenar?',
    a: 'Pre-entreno: 1-2 horas antes, una comida con carbos + proteína de fácil digestión. Post-entreno: idealmente en los 30-60 minutos después, proteína rápida (whey) + carbos simples (banana, arroz blanco) para maximizar recuperación.',
  },
  {
    q: '¿Puedo saltarme una comida?',
    a: 'Puedes, pero intenta llegar a tus macros diarios de todas formas. Si te saltas el desayuno, compensa en las otras comidas. Lo más importante es el total diario, no los horarios exactos. Eso sí, no te saltes el post-entreno.',
  },
  {
    q: '¿Cuándo veré resultados?',
    a: 'Con nutrición correcta + entrenamiento consistente: en 4-6 semanas notarás más fuerza y mejor definición muscular. Ganancias de músculo visible: 2-3 meses. Sé paciente — el músculo real tarda tiempo pero dura.',
  },
  {
    q: '¿Necesito suplementos?',
    a: 'No son obligatorios, pero son prácticos: Whey protein (proteína rápida y barata), creatina monohidrato (el más estudiado — mejora fuerza y recuperación), y vitamina D (casi todos tenemos deficiencia). Prioriza siempre la comida real primero.',
  },
  {
    q: '¿Qué pasa si como de más?',
    a: 'Un pequeño superávit (200-400 kcal) favorece el crecimiento muscular. Si comes mucho más del necesario, ganarás más grasa. Por eso el "volumen limpio" (+200 kcal) es lo más eficiente para mayoría de personas.',
  },
  {
    q: '¿Necesito comer antes de dormir?',
    a: 'Puede ayudar. Caseína (queso cottage, yogur griego) antes de dormir libera aminoácidos lentamente durante la noche, ayudando a la recuperación. No es obligatorio, pero si tienes hambre antes de dormir, elige proteína lenta.',
  },
];

const MUSCLE_FOODS = [
  { emoji: '🍗', name: 'Pechuga de pollo', why: 'Proteína completa, bajo en grasa, versátil' },
  { emoji: '🥚', name: 'Huevos', why: 'Proteína con mejor biodisponibilidad, vitaminas' },
  { emoji: '🐟', name: 'Atún / Salmón', why: 'Proteína + omega-3 anti-inflamatorio' },
  { emoji: '🌾', name: 'Avena', why: 'Carbos de liberación lenta, fibra, vitaminas B' },
  { emoji: '🍚', name: 'Arroz integral', why: 'Carbos complejos para energía sostenida' },
  { emoji: '🍠', name: 'Batata / Camote', why: 'Carbos + vitaminas + bajo índice glucémico' },
  { emoji: '🥑', name: 'Aguacate', why: 'Grasas monoinsaturadas, potasio, saciedad' },
  { emoji: '🫙', name: 'Yogur griego', why: 'Proteína + probióticos + calcio' },
];

const activityLabels: Record<UserProfile['activityLevel'], string> = {
  sedentary: 'Sedentario',
  light: 'Ligero',
  moderate: 'Moderado',
  active: 'Activo',
  very_active: 'Muy activo',
};
const goalLabels: Record<UserProfile['goal'], string> = {
  bulk: 'Volumen',
  lean_bulk: 'Volumen Limpio',
  maintain: 'Mantenimiento',
};

export default function Guide() {
  const { state, dispatch } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [form, setForm] = useState({
    weight: String(state.profile?.weight ?? ''),
    activityLevel: state.profile?.activityLevel ?? 'moderate',
    goal: state.profile?.goal ?? 'lean_bulk',
  });

  const { profile, targets } = state;
  if (!profile || !targets) return null;

  const tdee = Math.round(calculateTDEE(profile));

  function saveProfile() {
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
    setEditingProfile(false);
  }

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Guía & Perfil</h1>
        <p className="text-slate-400 text-sm">Aprende y ajusta tus metas</p>
      </div>

      {/* Profile card */}
      <div className="glass rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User size={18} className="text-brand-400" />
            <h2 className="text-white font-semibold">Tu perfil</h2>
          </div>
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-400 transition-colors"
          >
            <Edit3 size={13} />
            {editingProfile ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {!editingProfile ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Nombre', value: profile.name },
                { label: 'Edad', value: `${profile.age} años` },
                { label: 'Peso', value: `${profile.weight} kg` },
                { label: 'Altura', value: `${profile.height} cm` },
                { label: 'Actividad', value: activityLabels[profile.activityLevel] },
                { label: 'Objetivo', value: goalLabels[profile.goal] },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-800/50 rounded-xl p-3">
                  <div className="text-slate-500 text-xs mb-0.5">{label}</div>
                  <div className="text-white font-medium text-sm">{value}</div>
                </div>
              ))}
            </div>

            {/* Calorie breakdown */}
            <div className="bg-gradient-to-r from-brand-900/40 to-teal-900/40 border border-brand-700/30 rounded-xl p-3">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-slate-400 text-xs mb-0.5">TDEE</div>
                  <div className="text-white font-bold">{tdee}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-0.5">Meta</div>
                  <div className="text-brand-400 font-bold">{targets.calories}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-0.5">Superávit</div>
                  <div className="text-teal-400 font-bold">+{targets.calories - tdee}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Peso actual (kg)</label>
              <input
                type="number"
                value={form.weight}
                onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Nivel de actividad</label>
              <select
                value={form.activityLevel}
                onChange={e => setForm(f => ({ ...f, activityLevel: e.target.value as UserProfile['activityLevel'] }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
              >
                <option value="sedentary">Sedentario</option>
                <option value="light">Ligero (1-3 días)</option>
                <option value="moderate">Moderado (3-5 días)</option>
                <option value="active">Activo (6-7 días)</option>
                <option value="very_active">Muy activo (2x/día)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Objetivo</label>
              <select
                value={form.goal}
                onChange={e => setForm(f => ({ ...f, goal: e.target.value as UserProfile['goal'] }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
              >
                <option value="lean_bulk">Volumen Limpio (+200 kcal)</option>
                <option value="bulk">Volumen (+400 kcal)</option>
                <option value="maintain">Mantenimiento</option>
              </select>
            </div>
            <button
              onClick={saveProfile}
              className="w-full py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </div>

      {/* Best foods for muscle */}
      <div className="glass rounded-2xl p-5 mb-5">
        <h2 className="text-white font-semibold mb-4">🏆 Mejores alimentos para músculo</h2>
        <div className="grid grid-cols-2 gap-2">
          {MUSCLE_FOODS.map(f => (
            <div key={f.name} className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span>{f.emoji}</span>
                <span className="text-white text-sm font-medium">{f.name}</span>
              </div>
              <p className="text-slate-500 text-xs">{f.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-5">
        <h2 className="text-white font-semibold mb-3">❓ Preguntas frecuentes</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reset option */}
      <div className="text-center">
        <button
          onClick={() => {
            if (confirm('¿Resetear toda la app? Perderás tus datos.')) {
              dispatch({ type: 'RESET' });
            }
          }}
          className="flex items-center gap-2 mx-auto text-slate-600 hover:text-red-400 text-sm transition-colors"
        >
          <RotateCcw size={14} />
          Reiniciar aplicación
        </button>
      </div>
    </div>
  );
}
