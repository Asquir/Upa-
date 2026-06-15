import { useState } from 'react';
import { ChevronRight, ChevronLeft, Zap, Target, Activity, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserProfile } from '../types';

const steps = ['Bienvenida', 'Tu perfil', 'Actividad', 'Objetivo'];

const activityOptions = [
  { value: 'sedentary', label: 'Sedentario', desc: 'Poco o nada de ejercicio', icon: '🛋️' },
  { value: 'light', label: 'Ligero', desc: '1-3 días por semana', icon: '🚶' },
  { value: 'moderate', label: 'Moderado', desc: '3-5 días por semana', icon: '🏃' },
  { value: 'active', label: 'Activo', desc: '6-7 días por semana', icon: '💪' },
  { value: 'very_active', label: 'Muy activo', desc: 'Entreno 2x/día', icon: '🔥' },
] as const;

const goalOptions = [
  { value: 'bulk', label: 'Volumen', desc: '+400 kcal — máximo músculo', icon: '🏋️', color: 'from-orange-500 to-red-500' },
  { value: 'lean_bulk', label: 'Volumen Limpio', desc: '+200 kcal — músculo sin mucha grasa', icon: '⚡', color: 'from-brand-500 to-teal-500' },
  { value: 'maintain', label: 'Mantenimiento', desc: 'Mantener y recomposición', icon: '⚖️', color: 'from-blue-500 to-indigo-500' },
] as const;

export default function Onboarding() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male' as 'male' | 'female',
    activityLevel: 'moderate' as UserProfile['activityLevel'],
    goal: 'lean_bulk' as UserProfile['goal'],
  });

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function canProceed() {
    if (step === 1) {
      return form.name.trim() && +form.age > 0 && +form.weight > 0 && +form.height > 0;
    }
    return true;
  }

  function finish() {
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      profile: {
        name: form.name.trim(),
        age: +form.age,
        weight: +form.weight,
        height: +form.height,
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-teal-400 transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 pt-12 pb-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-brand-400' : 'bg-slate-600'}`} />
            </div>
          ))}
          <span className="ml-1 text-xs text-slate-500">{step + 1}/{steps.length}</span>
        </div>

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center animate-slide-up">
            <div className="text-6xl mb-6">💪</div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Tu guía de<br />
              <span className="text-brand-400">nutrición gym</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Voy a ayudarte a calcular exactamente cuánto comer para construir músculo,
              planificar tus comidas y hacer seguimiento de tu progreso.
            </p>
            <div className="space-y-3">
              {[
                { icon: <Target size={18} />, text: 'Calorías y macros personalizados' },
                { icon: <Zap size={18} />, text: 'Plan de comidas listo para usar' },
                { icon: <Activity size={18} />, text: 'Registro diario y seguimiento' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-slate-300">
                  <div className="text-brand-400">{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Profile */}
        {step === 1 && (
          <div className="flex-1 animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <User size={22} className="text-brand-400" />
              <h2 className="text-2xl font-bold text-white">Tu perfil</h2>
            </div>
            <p className="text-slate-400 mb-8">Con esto calculo tus necesidades exactas.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">¿Cómo te llamas?</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Sexo</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => update('gender', g)}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        form.gender === g
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-800/60 border border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {g === 'male' ? '♂ Masculino' : '♀ Femenino'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Edad</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={form.age}
                    onChange={e => update('age', e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    placeholder="75"
                    value={form.weight}
                    onChange={e => update('weight', e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    placeholder="175"
                    value={form.height}
                    onChange={e => update('height', e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Activity */}
        {step === 2 && (
          <div className="flex-1 animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={22} className="text-brand-400" />
              <h2 className="text-2xl font-bold text-white">Nivel de actividad</h2>
            </div>
            <p className="text-slate-400 mb-6">¿Cuánto entrenas actualmente?</p>

            <div className="space-y-3">
              {activityOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('activityLevel', opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    form.activityLevel === opt.value
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{opt.label}</div>
                    <div className="text-sm text-slate-400">{opt.desc}</div>
                  </div>
                  {form.activityLevel === opt.value && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Goal */}
        {step === 3 && (
          <div className="flex-1 animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <Target size={22} className="text-brand-400" />
              <h2 className="text-2xl font-bold text-white">Tu objetivo</h2>
            </div>
            <p className="text-slate-400 mb-6">Para construir músculo, recomiendo Volumen Limpio.</p>

            <div className="space-y-4">
              {goalOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('goal', opt.value)}
                  className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                    form.goal === opt.value
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-500'
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">{opt.label}</div>
                    <div className="text-sm text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                  {form.goal === opt.value && (
                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-none flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium"
            >
              <ChevronLeft size={18} />
              Atrás
            </button>
          )}
          <button
            onClick={() => {
              if (step < steps.length - 1) setStep(s => s + 1);
              else finish();
            }}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-lg transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-brand-500 to-teal-500 text-white hover:from-brand-400 hover:to-teal-400 shadow-lg shadow-brand-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {step === steps.length - 1 ? '¡Empezar! 🚀' : 'Continuar'}
            {step < steps.length - 1 && <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
