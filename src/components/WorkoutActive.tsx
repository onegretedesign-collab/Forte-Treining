/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveWorkoutSession } from '../types';
import { Play, Pause, Check, Trophy, Trash2 } from 'lucide-react';

interface WorkoutActiveProps {
  session: ActiveWorkoutSession;
  onUpdateSet: (exerciseId: string, setIndex: number, weight: number, reps: number, completed: boolean) => void;
  onCancel: () => void;
  onFinish: (durationSeconds: number) => void;
}

export default function WorkoutActive({ session, onUpdateSet, onCancel, onFinish }: WorkoutActiveProps) {
  const [seconds, setSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Live Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (hasStarted && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isPaused]);

  // Calculations
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  // Sum of weight * reps for completed sets
  const totalTonnage = session.exercises.reduce((acc, exercise) => {
    const exerciseTotal = exercise.sets.reduce((sum, set) => {
      return sum + (set.completed ? (set.weight * set.reps) : 0);
    }, 0);
    return acc + exerciseTotal;
  }, 0);

  const completedSetsCount = session.exercises.reduce((count, x) => {
    return count + x.sets.filter(s => s.completed).length;
  }, 0);

  const totalPossibleSets = session.exercises.reduce((sum, x) => sum + x.sets.length, 0);

  // Rough estimation of calories burned based on exercise count, sets count, and duration
  const estimatedCaloriesBurned = Math.round(
    completedSetsCount * 8 + (seconds / 60) * 4.5
  );

  return (
    <div className="space-y-6" id="active-workout-tracker">
      {/* Dynamic Session Timer Overlay */}
      <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EFE71D]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 animate-fadeIn">
          <div className="space-y-1">
            {!hasStarted ? (
              <span className="text-xs bg-[#EFE71D]/15 text-[#EFE71D] border border-[#EFE71D]/30 px-3 py-1.5 rounded-full font-black inline-flex items-center gap-1.5 uppercase tracking-widest italic animate-pulse">
                <span className="w-1.5 h-1.5 bg-[#EFE71D] rounded-full animate-ping" />
                PREPARADO PARA INICIAR
              </span>
            ) : (
              <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full font-black animate-pulse inline-flex items-center gap-1.5 uppercase tracking-widest italic">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                SESSÃO DE TREINO ATIVA
              </span>
            )}
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mt-2">{session.title}</h2>
            {!hasStarted && (
              <p className="text-xs text-neutral-200 font-semibold block max-w-md">
                ⌚ O cronômetro do seu treino está pausado. Toque para iniciar quando estiver pronto!
              </p>
            )}
          </div>

          {/* Stopwatch and play controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#050505] px-5 py-3 rounded-2xl border border-[#222] flex items-center gap-3">
              <span className="text-xs text-neutral-200 font-black uppercase tracking-widest leading-none">CRONÔMETRO:</span>
              <span id="active-timer" className={`text-2xl font-mono font-black bg-[#050505] leading-none ${!hasStarted ? 'text-neutral-500' : 'text-[#EFE71D]'}`}>
                {formatTime(seconds)}
              </span>
              
              {!hasStarted ? (
                <button
                  id="btn-active-start"
                  onClick={() => {
                    setHasStarted(true);
                    setIsPaused(false);
                  }}
                  className="p-1 px-3 bg-[#EFE71D] hover:bg-white text-black rounded-lg text-[10px] font-black uppercase italic tracking-tighter transition-all cursor-pointer flex items-center gap-1 shadow-lg shadow-[#EFE71D]/10"
                >
                  <Play size={11} className="fill-current text-black" />
                  COMEÇAR AGORA
                </button>
              ) : (
                <button
                  id="btn-active-pause"
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1 px-2.5 text-neutral-400 hover:text-white hover:bg-[#121212] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border border-transparent hover:border-[#222] cursor-pointer"
                >
                  {isPaused ? <Play size={11} className="text-[#EFE71D]" /> : <Pause size={11} />}
                  {isPaused ? 'RESUMIR' : 'PAUSAR'}
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                id="btn-active-cancel"
                onClick={() => {
                  if (confirm('Tem certeza que deseja cancelar o treino atual? Seus dados de carga não serão salvos no histórico.')) {
                    onCancel();
                  }
                }}
                className="bg-black/30 hover:bg-red-950/20 text-neutral-400 hover:text-red-400 p-3.5 rounded-xl border border-[#222] hover:border-red-500/20 transition-all cursor-pointer text-xs flex items-center gap-1.5 group font-bold tracking-tight"
                title="Descartar treino"
              >
                <Trash2 size={14} />
                Descartar
              </button>

              <button
                id="btn-active-finish"
                onClick={() => setShowFinishModal(true)}
                className="bg-[#EFE71D] hover:bg-white text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-colors cursor-pointer shadow-lg shadow-[#EFE71D]/10 flex items-center gap-1.5"
              >
                <Trophy size={14} />
                Finalizar Treino
              </button>
            </div>
          </div>
        </div>

        {/* Real-time statistics counters bar */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#222] text-center relative z-10 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-xs text-neutral-200 uppercase font-black tracking-widest leading-none block">Carga Total Acumulada</span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span id="active-tonnage-display" className="text-xl md:text-2xl font-mono font-black text-[#EFE71D]">
                {totalTonnage.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-200 font-black uppercase tracking-wide">kg</span>
            </div>
          </div>

          <div className="space-y-1 border-x border-[#222]">
            <span className="text-xs text-neutral-200 uppercase font-black tracking-widest leading-none block">Gasto Estimado</span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-xl md:text-2xl font-mono font-black text-orange-400">
                {estimatedCaloriesBurned}
              </span>
              <span className="text-xs text-neutral-200 font-black uppercase tracking-wide">kcal</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-neutral-200 uppercase font-black tracking-widest leading-none block">Séries Concluídas</span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-xl md:text-2xl font-mono font-black text-emerald-400">
                {completedSetsCount}
              </span>
              <span className="text-neutral-200 text-xs font-black">/ {totalPossibleSets}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Exercises Panels list */}
      <div className="space-y-4">
        {session.exercises.map((workoutExercise, exIndex) => (
          <div
            key={workoutExercise.exerciseId}
            id={`active-exercise-card-${workoutExercise.exerciseId}`}
            className="bg-[#121212] border border-[#222] rounded-3xl overflow-hidden shadow-xl"
          >
            {/* Header info */}
            <div className="bg-black/40 p-4 border-b border-[#222] flex items-center justify-between">
              <div>
                <span className="bg-[#EFE71D]/10 text-[#EFE71D] border border-[#EFE71D]/10 text-[9px] px-2.5 py-1 rounded font-mono font-black uppercase tracking-wider">
                  EXERCÍCIO {String(exIndex + 1).padStart(2, '0')}
                </span>
                <h3 className="font-bold text-white text-base mt-2">{workoutExercise.name}</h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 bg-[#121212] px-3 py-1 rounded-xl border border-[#222] tracking-widest uppercase">
                Foco no alvo / Isometria
              </span>
            </div>

            {/* Set row templates */}
            <div className="p-4 space-y-2.5">
              <div className="grid grid-cols-12 text-neutral-200 text-xs font-extrabold pb-2 uppercase tracking-widest px-2 md:px-4 border-b border-[#222]/50">
                <div className="col-span-2">SÉRIE</div>
                <div className="col-span-3 text-center">ALVO ESPECÍFICO</div>
                <div className="col-span-3 text-center">CARGA ATIVA</div>
                <div className="col-span-2 text-center">RITMO REPS</div>
                <div className="col-span-2 text-right">MARCAR</div>
              </div>

              {workoutExercise.sets.map((set, setIndex) => {
                const isSetDone = set.completed;
                return (
                  <div
                    key={setIndex}
                    id={`row-${workoutExercise.exerciseId}-set-${setIndex}`}
                    className={`grid grid-cols-12 items-center gap-1.5 py-2.5 px-2 md:px-4 rounded-xl border transition-all ${
                      isSetDone
                        ? 'bg-emerald-950/15 border-emerald-500/20 opacity-80'
                        : 'bg-black/35 border-[#222] hover:bg-[#050505]/40'
                    }`}
                  >
                    {/* Series Number Name */}
                    <div className="col-span-2 font-mono font-black text-sm text-neutral-200">
                      #{setIndex + 1}
                    </div>

                    {/* Meta representation */}
                    <div className="col-span-3 text-center text-xs text-neutral-200 font-extrabold uppercase italic tracking-tighter">
                      Carga Progressiva
                    </div>

                    {/* Weight Inputs element */}
                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center bg-[#050505]/50 border border-[#222] rounded-xl px-2 py-1 max-w-[95px] focus-within:border-[#EFE71D] transition">
                        <input
                          type="number"
                          id={`input-weight-${workoutExercise.exerciseId}-${setIndex}`}
                          value={set.weight}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            onUpdateSet(workoutExercise.exerciseId, setIndex, val, set.reps, set.completed);
                          }}
                          disabled={isSetDone}
                          className="w-full bg-transparent border-none text-center font-mono font-black text-sm text-[#EFE71D] focus:outline-none focus:ring-0 disabled:opacity-60"
                        />
                        <span className="text-xs text-neutral-200 font-black">kg</span>
                      </div>
                    </div>

                    {/* Reps Input Selector */}
                    <div className="col-span-2 flex justify-center">
                      <input
                        type="number"
                        id={`input-reps-${workoutExercise.exerciseId}-${setIndex}`}
                        value={set.reps}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          onUpdateSet(workoutExercise.exerciseId, setIndex, set.weight, val, set.completed);
                        }}
                        disabled={isSetDone}
                        className="w-12 bg-[#050505]/50 border border-[#222] rounded-xl text-center text-xs font-mono font-black text-white py-1 focus:outline-none focus:border-[#EFE71D] min-w-[45px] disabled:opacity-60"
                      />
                    </div>

                    {/* Complete Round Check Box */}
                    <div className="col-span-2 flex justify-end">
                      <button
                        id={`btn-check-${workoutExercise.exerciseId}-${setIndex}`}
                        onClick={() => {
                          onUpdateSet(workoutExercise.exerciseId, setIndex, set.weight, set.reps, !set.completed);
                        }}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          isSetDone
                            ? 'bg-[#EFE71D] text-black border-[#EFE71D]'
                            : 'bg-[#050505] hover:bg-neutral-800 border-[#222] text-transparent hover:text-neutral-600'
                        }`}
                      >
                        <Check size={14} className="stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Dialog popup */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#121212] border border-[#222] rounded-[2rem] max-w-md w-full p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#EFE71D]/5 rounded-full blur-[80px]" />
            
            <div className="mx-auto w-16 h-16 bg-[#EFE71D]/10 rounded-full flex items-center justify-center border border-[#EFE71D]/20 relative z-10">
              <Trophy className="text-[#EFE71D]" size={32} />
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Treino Concluído!</h3>
              <p className="text-xs text-neutral-400 px-4 leading-relaxed">
                Excelente trabalho biomecânico! Deseja registrar a sessão no seu histórico de dados para atualizar os gráficos de evolução das cargas?
              </p>
            </div>

            <div className="bg-[#050505]/60 p-5 rounded-2xl border border-[#222] grid grid-cols-2 gap-4 text-left relative z-10">
              <div className="space-y-1">
                <span className="text-xs text-neutral-300 block uppercase font-black tracking-widest">Duração</span>
                <span className="text-sm font-mono font-black text-white">{formatTime(seconds)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-neutral-300 block uppercase font-black tracking-widest">Carga Acumulada</span>
                <span className="text-sm font-mono font-black text-[#EFE71D]">{totalTonnage.toLocaleString()} kg</span>
              </div>
              <div className="space-y-1 pt-3 border-t border-[#222] col-span-2 flex justify-between items-center">
                <span className="text-xs text-neutral-300 uppercase font-black tracking-widest">Séries Concluídas</span>
                <span className="text-xs font-mono font-black text-emerald-400">{completedSetsCount} / {totalPossibleSets}</span>
              </div>
            </div>

            <div className="flex gap-3 relative z-10 w-full">
              <button
                id="btn-modal-cancel"
                onClick={() => setShowFinishModal(false)}
                className="w-full bg-[#050505] hover:bg-[#121212] text-neutral-400 border border-[#222] py-4 rounded-xl text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
              >
                Retornar
              </button>
              <button
                id="btn-modal-save"
                onClick={() => {
                  onFinish(seconds);
                  setShowFinishModal(false);
                }}
                className="w-full bg-[#EFE71D] hover:bg-white text-black py-4 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-colors cursor-pointer"
              >
                Gravar Histórico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
