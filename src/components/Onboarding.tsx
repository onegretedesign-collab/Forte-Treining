/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { Dumbbell, Home, Zap, Flame, Award, Heart, Check, ChevronRight, ChevronLeft, User } from 'lucide-react';

interface OnboardingProps {
  student: StudentProfile;
  onComplete: (updatedData: Partial<StudentProfile>) => void;
}

export default function Onboarding({ student, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number>(student.age || 26);
  const [weight, setWeight] = useState<number>(student.weight || 72);
  const [height, setHeight] = useState<number>(student.height || 174);
  const [experienceLevel, setExperienceLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>(
    student.experienceLevel || 'Intermediário'
  );
  const [trainingLocation, setTrainingLocation] = useState<'Academia' | 'Home Workout'>(
    student.trainingLocation || 'Academia'
  );
  const [mainGoal, setMainGoal] = useState<'Hipertrofia' | 'Ganho de Força' | 'Emagrecimento' | 'Condicionamento'>(
    student.mainGoal || 'Hipertrofia'
  );
  const [frequency, setFrequency] = useState<'3x' | '4x' | '5x' | '6x'>(
    student.frequency || '4x'
  );

  const handleSubmit = () => {
    onComplete({
      age,
      weight,
      height,
      experienceLevel,
      trainingLocation,
      mainGoal,
      frequency,
      onboarded: true
    });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-xl mx-auto bg-[#121212] border border-[#222] rounded-[2rem] overflow-hidden shadow-2xl p-6 sm:p-8 relative" id="onboarding-card">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4FF00]/5 rounded-full blur-[85px] pointer-events-none" />

      {/* Top Progress bar */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-2 font-black uppercase tracking-widest italic">
          <span>Sessão {step} de 4</span>
          <span className="text-[#D4FF00] font-black">{Math.round((step / 4) * 100)}% Completado</span>
        </div>
        <div className="h-1.5 w-full bg-[#050505] rounded-full overflow-hidden border border-[#222]">
          <div
            className="h-full bg-[#D4FF00] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps Content */}
      <div className="min-h-[290px] relative z-10">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tighter italic">
                <User className="text-[#D4FF00]" size={20} />
                Dados Biométricos
              </h3>
              <p className="text-xs text-neutral-400">
                Coleta de dados físicos para calibrar seu metabolismo residual de queima e cálculo automático de sobrecarga.
              </p>
            </div>

            <div className="space-y-4">
              {/* Age Slider */}
              <div className="bg-black/40 p-5 rounded-2xl border border-[#222] space-y-3">
                <div className="flex justify-between text-xs uppercase font-bold tracking-wider">
                  <span className="text-neutral-500">Qual a sua idade?</span>
                  <span className="text-[#D4FF00] font-mono font-black text-sm">{age} anos</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="70"
                  value={age}
                  id="onboard-age-slider"
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-[#D4FF00] h-1 bg-[#050505] rounded-lg cursor-pointer"
                />
              </div>

              {/* Weight & Height Panel */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-5 rounded-2xl border border-[#222] space-y-2">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Peso Atual</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={weight}
                      id="onboard-weight-input"
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#050505] border border-[#222] rounded-xl px-3 py-2 font-mono text-[#D4FF00] text-lg font-black focus:outline-none focus:border-[#D4FF00]"
                    />
                    <span className="text-xs text-neutral-500">kg</span>
                  </div>
                </div>

                <div className="bg-black/40 p-5 rounded-2xl border border-[#222] space-y-2">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Altura exata</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={height}
                      id="onboard-height-input"
                      onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#050505] border border-[#222] rounded-xl px-3 py-2 font-mono text-[#D4FF00] text-lg font-black focus:outline-none focus:border-[#D4FF00]"
                    />
                    <span className="text-xs text-neutral-500">cm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tighter italic">
                <Award className="text-[#D4FF00]" size={20} />
                Nível de Experiência
              </h3>
              <p className="text-xs text-neutral-400">
                Seu nível orienta a intensidade das séries de repetição, tempos de descanso e complexidade biomecânica.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'Iniciante', label: 'Iniciante', desc: 'Nunca treinei ou estive parado(a) por mais de 1 ano. Foco em adaptação.' },
                { value: 'Intermediário', label: 'Intermediário', desc: 'Pratico musculação há alguns meses de forma recorrente.' },
                { value: 'Avançado', label: 'Avançado', desc: 'Treino sério há mais de 2 anos. Domínio pleno de cargas progressivas.' }
              ].map((item) => (
                <button
                  key={item.value}
                  id={`exp-level-${item.value.toLowerCase()}`}
                  onClick={() => setExperienceLevel(item.value as any)}
                  className={`flex items-start text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    experienceLevel === item.value
                      ? 'bg-[#D4FF00]/5 border-[#D4FF00]'
                      : 'bg-[#121212] border-[#222] hover:border-neutral-700'
                  }`}
                >
                  <div className={`mt-0.5 mr-3 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    experienceLevel === item.value ? 'border-[#D4FF00]' : 'border-neutral-700'
                  }`}>
                    {experienceLevel === item.value && <div className="w-2 h-2 bg-[#D4FF00] rounded-full" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">{item.label}</span>
                    <span className="text-xs text-neutral-400 mt-1 block leading-relaxed">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tighter italic">
                <Home className="text-[#D4FF00]" size={20} />
                Ambiente & Frequência
              </h3>
              <p className="text-xs text-neutral-400">
                Indique o local disponível e sua regularidade semanal para gerar uma grade biomecânica eficiente.
              </p>
            </div>

            <div className="space-y-5">
              {/* Training Location Selection */}
              <div className="space-y-2">
                <span className="text-[10px] text-neutral-500 font-bold tracking-wider uppercase block">Localização física</span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    id="loc-gym"
                    onClick={() => setTrainingLocation('Academia')}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border gap-2 transition-all duration-200 cursor-pointer ${
                      trainingLocation === 'Academia'
                        ? 'bg-[#D4FF00]/5 border-[#D4FF00]'
                        : 'bg-black/35 border-[#222] hover:border-neutral-705'
                    }`}
                  >
                    <Dumbbell className={trainingLocation === 'Academia' ? 'text-[#D4FF00]' : 'text-neutral-550'} size={24} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Academia Completa</span>
                  </button>

                  <button
                    id="loc-home"
                    onClick={() => setTrainingLocation('Home Workout')}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border gap-2 transition-all duration-200 cursor-pointer ${
                      trainingLocation === 'Home Workout'
                        ? 'bg-[#D4FF00]/5 border-[#D4FF00]'
                        : 'bg-black/35 border-[#222] hover:border-neutral-705'
                    }`}
                  >
                    <Home className={trainingLocation === 'Home Workout' ? 'text-[#D4FF00]' : 'text-neutral-550'} size={24} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Home (Peso Livre)</span>
                  </button>
                </div>
              </div>

              {/* Weekly Frequency */}
              <div className="space-y-2">
                <span className="text-[10px] text-neutral-500 font-bold tracking-wider uppercase block">Frequência Semanal Recomendada</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['3x', '4x', '5x', '6x'] as const).map((freq) => (
                    <button
                      key={freq}
                      id={`freq-${freq}`}
                      onClick={() => setFrequency(freq)}
                      className={`py-3.5 rounded-xl border text-sm font-mono font-black transition-all text-center cursor-pointer ${
                        frequency === freq
                          ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                          : 'bg-[#121212] text-neutral-400 border-[#222] hover:border-neutral-700'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tighter italic">
                <Zap className="text-[#D4FF00]" size={20} />
                Objetivo Fit de Treino
              </h3>
              <p className="text-xs text-neutral-400">
                Seu objetivo principal orienta a calibragem das cargas e o tempo sob tensão concêntrica.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'Hipertrofia', label: 'Hipertrofia', icon: Dumbbell, desc: 'Ganho de volume celular' },
                { value: 'Ganho de Força', label: 'Ganho de Força', icon: Award, desc: 'Mais torque estrito' },
                { value: 'Emagrecimento', label: 'Emagrecimento', icon: Flame, desc: 'Gasto calórico residual' },
                { value: 'Condicionamento', label: 'Condicionamento', icon: Heart, desc: 'Cardiorespiratório alto' }
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.value}
                    id={`goal-${item.value.split(' ')[0].toLowerCase()}`}
                    onClick={() => setMainGoal(item.value as any)}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left gap-2 transition-all duration-200 cursor-pointer ${
                      mainGoal === item.value
                        ? 'bg-[#D4FF00]/5 border-[#D4FF00]'
                        : 'bg-[#121212] border-[#222] hover:border-neutral-700'
                    }`}
                  >
                    <IconComp className={mainGoal === item.value ? 'text-[#D4FF00]' : 'text-neutral-500'} size={18} />
                    <div>
                      <span className="font-bold text-xs text-white block leading-tight">{item.label}</span>
                      <span className="text-[9px] text-neutral-400 mt-1 block leading-none">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation panel */}
      <div className="flex justify-between items-center mt-8 pt-5 border-t border-[#222] relative z-10">
        <button
          onClick={prevStep}
          disabled={step === 1}
          id="btn-onboarding-prev"
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none font-bold uppercase tracking-wider italic cursor-pointer"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        {step < 4 ? (
          <button
            onClick={nextStep}
            id="btn-onboarding-next"
            className="flex items-center gap-1.5 px-6 py-3.5 bg-[#121212] hover:bg-[#050505] text-white text-xs font-black uppercase tracking-widest border border-[#222] hover:border-neutral-700 rounded-xl transition-all cursor-pointer"
          >
            Avançar
            <ChevronRight size={14} className="text-[#D4FF00]" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            id="btn-onboarding-submit"
            className="flex items-center gap-1.5 px-6 py-3.5 bg-[#D4FF00] hover:bg-white text-black text-xs font-black uppercase italic tracking-tighter rounded-xl transition-all cursor-pointer shadow-lg shadow-[#D4FF00]/10"
          >
            <Check size={14} />
            Gerar Meu Treino Inteligente
          </button>
        )}
      </div>
    </div>
  );
}
