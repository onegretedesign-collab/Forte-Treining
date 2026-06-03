/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, Exercise, TrainingLog, WeekDay, StudentWeeklySchedule } from '../types';
import { SUGGESTED_PLANS, SuggestedPlan } from '../mockData';
import { Dumbbell, Play, LineChart, BadgeCheck, HelpCircle, ChevronDown, ChevronUp, Calendar, Check, Edit3, ShieldAlert } from 'lucide-react';

interface WorkoutDashboardProps {
  student: StudentProfile;
  exercises: Exercise[];
  logs: TrainingLog[];
  onStartWorkout: (planId: string) => void;
  weeklySchedule: StudentWeeklySchedule;
  onUpdateSchedule: (day: WeekDay, planId: string) => void;
}

export default function WorkoutDashboard({ 
  student, 
  exercises, 
  logs, 
  onStartWorkout,
  weeklySchedule,
  onUpdateSchedule
}: WorkoutDashboardProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Weekdays tracking and default to actual active day
  const weekdaysPT: WeekDay[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const realTodayName = weekdaysPT[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState<WeekDay>(() => {
    // Default to a weekday name from 'Segunda' to 'Domingo'. If realTodayName is 'Domingo', we default to 'Domingo'
    return realTodayName;
  });

  const daySchedule = weeklySchedule[selectedDay] || { planId: 'rest', completed: false };
  const currentPlan = SUGGESTED_PLANS.find(p => p.id === daySchedule.planId) || null;

  // Buscar detalhes de exercícios no catálogo global
  const planExercises = currentPlan ? currentPlan.exercises.map((pe) => {
    const detail = exercises.find((e) => e.id === pe.exerciseId) || {
      id: pe.exerciseId,
      name: 'Exercício Desconhecido',
      muscleGroup: 'Geral',
      instructions: 'Instruções padrão de execução segura: mantenha contração concêntrica em boa cadência de postura.'
    };
    return {
      ...detail,
      sets: pe.sets,
      reps: pe.reps
    };
  }) : [];

  // Toggle exercise expanded instructions info
  const toggleExpand = (id: string) => {
    setExpandedExercise(expandedExercise === id ? null : id);
  };

  // Custom SVG Chart Coordinates builder representing past logs progression
  const buildProgressChart = () => {
    if (logs.length === 0) return null;

    // Pegamos até os últimos 5 logs ordenados por data
    const sortedLogs = [...logs]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-5);

    const weights = sortedLogs.map((l) => l.totalWeightLifted);
    const maxVal = Math.max(...weights, 1000) * 1.1; // Adicionar 10% margem
    const minVal = Math.min(...weights, 0) * 0.9;

    const width = 360;
    const height = 120;
    const padding = 20;

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = sortedLogs.map((log, index) => {
      const x = padding + (index / (Math.max(sortedLogs.length - 1, 1))) * chartWidth;
      // Tratar divisão por zero e normatizar
      const range = maxVal - minVal;
      const divisor = range > 0 ? range : 1;
      const y = height - padding - ((log.totalWeightLifted - minVal) / divisor) * chartHeight;
      return { x, y, value: log.totalWeightLifted, date: log.date };
    });

    const pathData = points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');

    return (
      <div className="space-y-3" id="progress-chart-container">
        <div className="flex items-center justify-between text-xs text-[#F0F0F0] uppercase font-bold tracking-widest italic">
          <span className="flex items-center gap-1">
            <LineChart className="text-[#D4FF00]" size={13} />
            Evolução de Cargas Acumuladas
          </span>
          <span className="text-[#D4FF00] font-mono text-[9px] font-black leading-none">+12.5% vs Mês Ant.</span>
        </div>

        <div className="bg-[#121212] p-5 rounded-3xl border border-[#222]">
          <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#222" strokeDasharray="3,3" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#222" strokeDasharray="3,3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#222" />

              {/* Glowing Ambient Fill */}
              {points.length > 1 && (
                <path
                  d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                  fill="url(#chart-glow)"
                  opacity="0.12"
                />
              )}

              {/* Connection Path line */}
              <path d={pathData} fill="none" stroke="url(#chart-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points Circle */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="4.5" fill="#D4FF00" stroke="#050505" strokeWidth="1.5" />
                  <circle cx={p.x} cy={p.y} r="8" fill="#D4FF00" opacity="0.2" className="hover:opacity-50 transition" />
                  
                  {/* Floating tooltip simulation */}
                  <text x={p.x} y={p.y - 10} fill="#D4FF00" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    {p.value}kg
                  </text>
                  
                  {/* X Axis Labels */}
                  <text x={p.x} y={height - 2} fill="#737373" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    {p.date.split('-').slice(1).join('/')}
                  </text>
                </g>
              ))}

              {/* Gradient defs */}
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4FF00" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4FF00" />
                  <stop offset="100%" stopColor="#D4FF00" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="student-workout-dashboard">
      
      {/* 1. Weekly Schedule Section Card */}
      <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4FF00] opacity-[0.015] blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
              <Calendar className="text-[#D4FF00]" size={18} />
              CRONOGRAMA DE TREINOS DA SEMANA
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Defina quais dias treinar ou descansar. Toque em qualquer dia da semana para abrir e visualizar a ficha correspondente.
            </p>
          </div>
          <div className="bg-black/45 border border-[#222]/60 px-4 py-2.5 rounded-xl text-xs text-neutral-400 font-mono font-bold">
            HOJE: <span className="text-[#D4FF00]">{realTodayName}-FEIRA</span>
          </div>
        </div>

        {/* Days of the week row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day) => {
            const isToday = day === realTodayName;
            const isSelected = day === selectedDay;
            const sched = weeklySchedule[day as WeekDay] || { planId: 'rest', completed: false };
            const isCompletedToday = sched.completedAt === new Date().toISOString().split('T')[0];

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day as WeekDay)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 relative group/day ${
                  isSelected 
                    ? 'bg-black border-[#D4FF00] shadow-md shadow-[#D4FF00]/5' 
                    : 'bg-black/40 border-[#222]/60 hover:border-neutral-700 hover:bg-black/60'
                } ${isToday ? 'ring-1 ring-[#D4FF00]/40' : ''}`}
                title={`Ver ficha técnica de ${day}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${isToday ? 'text-[#D4FF00]' : 'text-neutral-400'}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-[7px] bg-[#D4FF00] text-black px-1 rounded-sm font-black uppercase tracking-widest leading-none font-mono">
                      HOJE
                    </span>
                  )}
                </div>

                {/* Plan Dropdown selector - stopPropagation to avoid resetting the selectedDay when clicking the select */}
                <div className="mt-1 mb-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={sched.planId}
                    onChange={(e) => onUpdateSchedule(day as WeekDay, e.target.value)}
                    className="w-full bg-[#121212] border border-[#222] hover:border-[#D4FF00]/40 text-[10px] text-white rounded-lg px-2 py-1.5 focus:outline-none transition font-sans cursor-pointer focus:ring-1 focus:ring-[#D4FF00]/20"
                  >
                    <option value="rest">🧘 Descanso</option>
                    {SUGGESTED_PLANS.map(p => (
                      <option key={p.id} value={p.id}>
                        ⚡ {p.title.split(' - ')[1] || p.title.split(' - ')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between text-[9px] font-mono mt-auto pt-2 border-t border-[#222]/20">
                  {sched.planId === 'rest' ? (
                    <span className="text-neutral-500 uppercase font-bold tracking-wider leading-none">OFF</span>
                  ) : isCompletedToday ? (
                    <span className="text-[#D4FF00] font-black flex items-center gap-0.5 uppercase tracking-tight">
                      <Check size={10} className="stroke-[3]" /> CONCLUÍDO
                    </span>
                  ) : (
                    <span className="text-neutral-500 uppercase tracking-tight">PENDENTE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main content Layout Grid (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Plan inspect/view details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Plan Header */}
          <div className="bg-[#121212] border border-[#222] rounded-3xl p-8 relative overflow-hidden group">
            {/* Subtle Cyber Glowing Spot */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00] opacity-[0.03] blur-[100px] pointer-events-none" />
            
            {currentPlan ? (
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="space-y-3">
                  <span className="text-[#D4FF00] text-xs font-bold tracking-[0.2em] uppercase block italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
                    Roteiro para {selectedDay}-feira {selectedDay === realTodayName ? '(Hoje)' : ''}
                  </span>
                  
                  {daySchedule.completedAt === new Date().toISOString().split('T')[0] && (
                    <span className="inline-flex items-center gap-1 bg-[#D4FF00]/10 border border-[#D4FF00]/20 text-[#D4FF00] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      <Check size={10} className="stroke-[3]" /> Treino do dia concluído!
                    </span>
                  )}
                  
                  <h2 className="text-3xl sm:text-4xl font-black leading-tight uppercase italic text-white tracking-tighter">
                    {currentPlan.title.split(' ')[0]} <br className="hidden sm:block" />
                    <span className="text-[#D4FF00]">{currentPlan.title.split(' ').slice(1).join(' ') || 'Hipertrofia'}</span>
                  </h2>
                  <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
                    {currentPlan.description}
                  </p>
                </div>

                <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2.5">
                  <button
                    onClick={() => onStartWorkout(currentPlan.id)}
                    id="btn-trigger-start-session"
                    className="w-full sm:w-auto bg-[#D4FF00] hover:bg-white text-black px-8 py-4 rounded-xl font-black uppercase italic tracking-tighter transition-colors cursor-pointer text-center text-sm shadow-lg shadow-[#D4FF00]/5 hover:text-black"
                  >
                    {daySchedule.completedAt === new Date().toISOString().split('T')[0] ? 'Refazer Treino' : 'Iniciar Treino'}
                  </button>
                  {selectedDay !== realTodayName && (
                    <span className="text-[10px] text-center text-neutral-500 font-mono italic block">
                      Agendado para {selectedDay}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 bg-neutral-900 border border-[#222] rounded-full flex items-center justify-center mx-auto text-[#D4FF00] text-xl">
                  🧘
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                    {selectedDay}-feira: Descanso Planejado
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    Recuperação ativa! Seu corpo precisa deste repouso para consolidar os ganhos de força e recompor fibras biomecânicas.
                  </p>
                </div>
                
                <div className="bg-black/40 border border-[#222]/55 p-5 rounded-2xl max-w-md mx-auto text-left space-y-3.5 mt-4">
                  <span className="text-[10px] text-[#D4FF00] font-mono font-black uppercase tracking-wider block">QUER TREINAR MESMO ASSIM?</span>
                  <p className="text-xs text-neutral-450 leading-relaxed">
                    Você pode ignorar o cronograma hoje e realizar qualquer uma das sessões catalogadas do Forte Treining:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTED_PLANS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => onStartWorkout(p.id)}
                        className="text-left text-xs text-neutral-300 bg-neutral-900/60 hover:bg-neutral-800 border border-[#222] px-3.5 py-2.5 rounded-xl flex items-center justify-between group transition cursor-pointer"
                      >
                        <span className="font-bold truncate text-white">{p.title}</span>
                        <Play size={10} className="text-[#D4FF00] group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Metrics Tag list */}
            {currentPlan && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#222] text-xs">
                <div className="bg-black/40 p-3 rounded-xl border border-[#222]/60">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Ambiente</p>
                  <p className="text-white font-black uppercase italic tracking-tighter text-sm">{currentPlan.location}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-[#222]/60">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Objetivo</p>
                  <p className="text-white font-black uppercase italic tracking-tighter text-sm">{currentPlan.goal}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-[#222]/60">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Nível Técnico</p>
                  <p className="text-[#D4FF00] font-black uppercase italic tracking-tighter text-sm">{currentPlan.level}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-[#222]/60">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Freq. Semanal</p>
                  <p className="text-white font-black uppercase italic tracking-tighter text-sm">{currentPlan.frequency}</p>
                </div>
              </div>
            )}
          </div>

          {/* Exercises Lists */}
          {currentPlan && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 italic">
                Prescrição Biomecânica Do Plano selecionado para {selectedDay}
              </h3>
              {planExercises.map((ex, idx) => {
                const isExpanded = expandedExercise === ex.id;
                return (
                  <div
                    key={ex.id}
                    id={`exercise-row-${ex.id}`}
                    className="bg-[#121212] border border-[#222] rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    {/* Header row element */}
                    <div
                      onClick={() => toggleExpand(ex.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/20 select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-black border border-[#222] text-[#D4FF00] rounded-xl flex items-center justify-center font-mono font-black text-sm italic">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white">{ex.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[9px] text-[#D4FF00] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded border border-[#D4FF00]/10">
                              {ex.muscleGroup}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {ex.sets} séries × {ex.reps} reps
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-neutral-500 hover:text-white transition">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Expanded guidance descriptions */}
                    {isExpanded && (
                      <div className="p-5 bg-black/30 border-t border-[#222] text-xs text-neutral-300 leading-relaxed space-y-4 animate-fadeIn">
                        <div className="space-y-1.5">
                          <p className="font-black text-[9px] text-[#D4FF00] uppercase tracking-widest flex items-center gap-1.5">
                            <HelpCircle size={12} className="text-[#D4FF00]" />
                            Guia Completo de Execução Segura
                          </p>
                          <p className="text-neutral-400 leading-relaxed text-xs">
                            {ex.instructions}
                          </p>
                        </div>

                        <div className="flex gap-2 text-[9px] font-mono text-neutral-500">
                          <span>✓ Carga Progressiva Requerida</span>
                          <span>•</span>
                          <span>✓ Exercício Estrito de Foco</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Progress logs & Sidebar chart */}
        <div className="space-y-6">
          
          {/* Progression chart build */}
          {buildProgressChart()}

          {/* History Log records */}
          <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Histórico de Treinos</h4>
              <Calendar className="text-neutral-500" size={14} />
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  Nenhum treino salvo nesta conta. Faça seu primeiro treino ativo para registrar!
                </div>
              ) : (
                [...logs]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-black/40 rounded-xl border border-[#222] flex items-center justify-between text-xs hover:border-[#D4FF00]/20 transition"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-white text-xs truncate max-w-[150px]">{log.workoutTitle}</p>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {log.date} • {log.completedSetsCount} séries
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-[#D4FF00] block">
                          +{log.totalWeightLifted}
                        </span>
                        <span className="text-[9px] text-neutral-500 font-mono uppercase font-bold tracking-wider">kg totais</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
