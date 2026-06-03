/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, Exercise, TrainingLog, ActiveWorkoutSession, PaymentStatus, WeekDay, StudentWeeklySchedule } from './types';
import { INITIAL_STUDENTS, INITIAL_EXERCISES, MOCK_TRAINING_LOGS, SUGGESTED_PLANS } from './mockData';

// Component Imports
import Onboarding from './components/Onboarding';
import WorkoutDashboard from './components/WorkoutDashboard';
import WorkoutActive from './components/WorkoutActive';
import AdminPanel from './components/AdminPanel';
import ArchitectureView from './components/ArchitectureView';
import WelcomeAuth from './components/WelcomeAuth';

// Icon Imports
import { 
  Dumbbell, 
  ShieldAlert, 
  Database, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Lock, 
  Check, 
  HelpCircle,
  FileCheck,
  UserCheck,
  RotateCcw,
  Sparkles,
  Smartphone,
  User,
  UserPlus,
  LogIn,
  Phone,
  X,
  Flame
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Persistent LocalState ---
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('forte_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('forte_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [logs, setLogs] = useState<TrainingLog[]>(() => {
    const saved = localStorage.getItem('forte_logs');
    return saved ? JSON.parse(saved) : MOCK_TRAINING_LOGS;
  });

  const [weeklySchedules, setWeeklySchedules] = useState<Record<string, StudentWeeklySchedule>>(() => {
    const saved = localStorage.getItem('forte_weekly_schedules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar cronogramas de treino:", e);
      }
    }
    const initial: Record<string, StudentWeeklySchedule> = {};
    const defaultStudents = [...INITIAL_STUDENTS];
    defaultStudents.forEach(st => {
      const hasAcademia = (st.trainingLocation || 'Academia').toLowerCase() === 'academia';
      const primaryPlan = hasAcademia ? 'plan-gym-hypertrophy' : 'plan-home-loss';
      const secondaryPlan = hasAcademia ? 'plan-gym-strength' : 'plan-home-conditioning';
      
      initial[st.id] = {
        'Segunda': { planId: primaryPlan, completed: false },
        'Terça': { planId: secondaryPlan, completed: false },
        'Quarta': { planId: 'rest', completed: false },
        'Quinta': { planId: primaryPlan, completed: false },
        'Sexta': { planId: secondaryPlan, completed: false },
        'Sábado': { planId: 'rest', completed: false },
        'Domingo': { planId: 'rest', completed: false },
      };
    });
    return initial;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const active = localStorage.getItem('forte_active_student_id');
    return active || 'student-1'; // Rodrigo Silva (Paid)
  });

  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'specification'>('student');
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);

  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('forte_student_logged_in') === 'true';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('forte_admin_authenticated') === 'true';
  });

  // --- Toast/Alert State for Daily Workout Progression ---
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'pending' | 'completed' | 'rest';
  } | null>(null);

  const [hasShownToast, setHasShownToast] = useState<boolean>(false);

  // Reset toast visibility on logout
  useEffect(() => {
    if (!isStudentLoggedIn) {
      setHasShownToast(false);
      setToast(null);
    }
  }, [isStudentLoggedIn]);

  // Analytical trigger for Toast Alert based on current student's daily agenda
  useEffect(() => {
    if (isStudentLoggedIn && currentStudentId && !hasShownToast) {
      const studentSched = weeklySchedules[currentStudentId];
      if (!studentSched) return;

      const weekdaysPT: WeekDay[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const todayName = weekdaysPT[new Date().getDay()];
      const todaySched = studentSched[todayName];

      if (!todaySched) return;

      const matchedStudent = students.find(s => s.id === currentStudentId);
      const studentName = matchedStudent ? matchedStudent.name : 'Aluno';

      const timer = setTimeout(() => {
        if (todaySched.completed) {
          setToast({
            show: true,
            title: 'Foco Total Mantido! ⚡',
            message: `Olá, ${studentName}! Seu treino de hoje já foi concluído e registrado com sucesso. Excelente progresso!`,
            type: 'completed'
          });
        } else if (todaySched.planId === 'rest') {
          setToast({
            show: true,
            title: 'Recuperação Ativa Ativada 🧘',
            message: `Olá, ${studentName}! Hoje seu cronograma indica descanso ativo. Seu corpo precisa de repouso!`,
            type: 'rest'
          });
        } else {
          const plan = SUGGESTED_PLANS.find(p => p.id === todaySched.planId);
          const planName = plan ? plan.title.replace('Ficha - ', '') : 'Treino Recomendado';
          setToast({
            show: true,
            title: 'Treino do Dia Pendente! 🔥',
            message: `Olá, ${studentName}! Você tem o treino de "${planName}" pendente de conclusão para hoje. Vamos começar?`,
            type: 'pending'
          });
        }
        setHasShownToast(true);
      }, 1500); // Smooth delay to trigger right after load/login transitions

      return () => clearTimeout(timer);
    }
  }, [isStudentLoggedIn, currentStudentId, hasShownToast, weeklySchedules, students]);

  // Toast self-dismiss timer
  useEffect(() => {
    if (toast && toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, show: false } : null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync to database simulated storage
  useEffect(() => {
    localStorage.setItem('forte_student_logged_in', String(isStudentLoggedIn));
  }, [isStudentLoggedIn]);

  useEffect(() => {
    localStorage.setItem('forte_admin_authenticated', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('forte_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('forte_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('forte_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('forte_weekly_schedules', JSON.stringify(weeklySchedules));
  }, [weeklySchedules]);

  useEffect(() => {
    localStorage.setItem('forte_active_student_id', currentStudentId);
  }, [currentStudentId]);

  // Extract currently simulating logged in user
  const currentUser = students.find(s => s.id === currentStudentId) || students[0] || INITIAL_STUDENTS[0];

  // Reset demo simulator tool to factory properties
  const handleResetSimulator = () => {
    if (confirm('Deseja redefinir o simulador? Todos os novos cadastros de alunos, treinos e histórico salvos serão apagados.')) {
      setStudents(INITIAL_STUDENTS);
      setExercises(INITIAL_EXERCISES);
      setLogs(MOCK_TRAINING_LOGS);
      
      const initial: Record<string, StudentWeeklySchedule> = {};
      INITIAL_STUDENTS.forEach(st => {
        const hasAcademia = (st.trainingLocation || 'Academia').toLowerCase() === 'academia';
        const primaryPlan = hasAcademia ? 'plan-gym-hypertrophy' : 'plan-home-loss';
        const secondaryPlan = hasAcademia ? 'plan-gym-strength' : 'plan-home-conditioning';
        
        initial[st.id] = {
          'Segunda': { planId: primaryPlan, completed: false },
          'Terça': { planId: secondaryPlan, completed: false },
          'Quarta': { planId: 'rest', completed: false },
          'Quinta': { planId: primaryPlan, completed: false },
          'Sexta': { planId: secondaryPlan, completed: false },
          'Sábado': { planId: 'rest', completed: false },
          'Domingo': { planId: 'rest', completed: false },
        };
      });
      setWeeklySchedules(initial);
      
      setCurrentStudentId('student-1');
      setIsStudentLoggedIn(false);
      setIsAdminAuthenticated(false);
      setActiveSession(null);
      setActiveTab('student');
      alert('Simulador Forte Treining reiniciado!');
    }
  };

  // --- Student Handlers ---
  const handleUpdateOnboarding = (updatedProfile: Partial<StudentProfile>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === currentStudentId) {
        return {
          ...s,
          ...updatedProfile,
          onboarded: true
        };
      }
      return s;
    }));
  };

  const handleStartWorkoutSession = (planId: string) => {
    const plan = SUGGESTED_PLANS.find(p => p.id === planId) || SUGGESTED_PLANS[0];
    
    // Build active exercises blueprint structure
    const exerciseState = plan.exercises.map(pe => {
      const exDetail = exercises.find(e => e.id === pe.exerciseId);
      const name = exDetail ? exDetail.name : 'Exercício';
      
      const setsArray = Array.from({ length: pe.sets }).map(() => ({
        reps: parseInt(pe.reps) || 10,
        weight: plan.title.includes('Força') ? 40 : 20, // Default start loads based on goal type
        completed: false
      }));

      return {
        exerciseId: pe.exerciseId,
        name,
        sets: setsArray
      };
    });

    setActiveSession({
      id: `session-${Date.now()}`,
      title: plan.title,
      startTime: Date.now(),
      exercises: exerciseState
    });
  };

  const handleUpdateSessionSet = (
    exerciseId: string, 
    setIndex: number, 
    weight: number, 
    reps: number,
    completed: boolean
  ) => {
    if (!activeSession) return;

    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.exerciseId === exerciseId) {
            const updatedSets = [...ex.sets];
            updatedSets[setIndex] = { reps, weight, completed };
            return {
              ...ex,
              sets: updatedSets
            };
          }
          return ex;
        })
      };
    });
  };

  const handleFinishWorkout = (durationSeconds: number) => {
    if (!activeSession) return;

    // Calc performance
    let completedSetsCount = 0;
    let totalWeightLifted = 0;

    activeSession.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          completedSetsCount++;
          totalWeightLifted += (s.weight * s.reps);
        }
      });
    });

    const isToday = new Date().toISOString().split('T')[0];
    const weekdaysPT: WeekDay[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayName = weekdaysPT[new Date().getDay()];

    const newLog: TrainingLog = {
      id: `log-${Date.now()}`,
      date: isToday,
      workoutTitle: activeSession.title,
      totalWeightLifted,
      completedSetsCount
    };

    // Mark today's weekday schedule as completed
    setWeeklySchedules(prev => {
      const studentSched = prev[currentStudentId] || {
        'Segunda': { planId: 'rest', completed: false },
        'Terça': { planId: 'rest', completed: false },
        'Quarta': { planId: 'rest', completed: false },
        'Quinta': { planId: 'rest', completed: false },
        'Sexta': { planId: 'rest', completed: false },
        'Sábado': { planId: 'rest', completed: false },
        'Domingo': { planId: 'rest', completed: false },
      };
      return {
        ...prev,
        [currentStudentId]: {
          ...studentSched,
          [todayName]: {
            ...studentSched[todayName],
            completed: true,
            completedAt: isToday
          }
        }
      };
    });

    setLogs(prev => [newLog, ...prev]);
    setActiveSession(null);
    alert(`Treino Registrado! Parabéns! +${totalWeightLifted}kg acumulados no seu progresso físico.`);
  };

  const handleCancelWorkout = () => {
    setActiveSession(null);
  };

  // --- Admin Handlers ---
  const handleUpdateStudentStatus = (id: string, newStatus: PaymentStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          statusFinanceiro: newStatus
        };
      }
      return s;
    }));
  };

  const handleAddStudentByAdmin = (name: string, email: string, status: PaymentStatus) => {
    const isToday = new Date().toISOString().split('T')[0];
    const newStudentId = `student-${Date.now()}`;
    const newStudent: StudentProfile = {
      id: newStudentId,
      name,
      email,
      role: 'aluno',
      statusFinanceiro: status,
      onboarded: false,
      registrationDate: isToday
    };

    setStudents(prev => [...prev, newStudent]);
    setWeeklySchedules(prev => ({
      ...prev,
      [newStudentId]: {
        'Segunda': { planId: 'plan-gym-hypertrophy', completed: false },
        'Terça': { planId: 'plan-gym-strength', completed: false },
        'Quarta': { planId: 'rest', completed: false },
        'Quinta': { planId: 'plan-gym-hypertrophy', completed: false },
        'Sexta': { planId: 'plan-gym-strength', completed: false },
        'Sábado': { planId: 'rest', completed: false },
        'Domingo': { planId: 'rest', completed: false },
      }
    }));
  };

  const handleAddExerciseByAdmin = (name: string, muscleGroup: string, instructions: string) => {
    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      name,
      muscleGroup,
      instructions,
      defaultSets: 4,
      defaultReps: '10'
    };

    setExercises(prev => [...prev, newEx]);
  };

  // --- Simulated Pix Paywall Normalizer ---
  const handleSimulatePixRegularizer = () => {
    handleUpdateStudentStatus(currentUser.id, 'Pago');
    alert('✓ Pagamento de simulação recebido com sucesso! Sua ficha de treinos foi desbloqueada imediatamente pelo middleware.');
  };

  const handleRegisterStudentFromWelcome = (name: string, age: number, email: string, contact: string) => {
    const isToday = new Date().toISOString().split('T')[0];
    const newStudentId = `student-${Date.now()}`;
    const newStudent: StudentProfile = {
      id: newStudentId,
      name,
      email,
      role: 'aluno',
      statusFinanceiro: 'Pago',
      onboarded: false,
      age,
      contact,
      registrationDate: isToday
    };

    setStudents(prev => [...prev, newStudent]);
    setWeeklySchedules(prev => ({
      ...prev,
      [newStudentId]: {
        'Segunda': { planId: 'plan-gym-hypertrophy', completed: false },
        'Terça': { planId: 'plan-gym-strength', completed: false },
        'Quarta': { planId: 'rest', completed: false },
        'Quinta': { planId: 'plan-gym-hypertrophy', completed: false },
        'Sexta': { planId: 'plan-gym-strength', completed: false },
        'Sábado': { planId: 'rest', completed: false },
        'Domingo': { planId: 'rest', completed: false },
      }
    }));
    setCurrentStudentId(newStudentId);
    setIsStudentLoggedIn(true);
    setActiveTab('student');
    alert(`Matrícula realizada com sucesso! Seja bem-vindo, ${name}!`);
  };

  const handleLoginStudentFromWelcome = (id: string) => {
    setCurrentStudentId(id);
    setIsStudentLoggedIn(true);
    setActiveTab('student');
    const matched = students.find(s => s.id === id);
    if (matched) {
      alert(`Bem-vindo de volta, ${matched.name}!`);
    }
  };

  const handleLoginAdminFromWelcome = (user: string, pass: string) => {
    if (user === 'Treiningfort' && pass === '124578') {
      setIsAdminAuthenticated(true);
      setActiveTab('admin');
      alert('Acesso administrativo desbloqueado com sucesso.');
      return true;
    }
    return false;
  };

  const handleUpdateWeeklySchedule = (day: WeekDay, planId: string) => {
    setWeeklySchedules(prev => {
      const fallbackSchedule = {
        'Segunda': { planId: 'plan-gym-hypertrophy', completed: false },
        'Terça': { planId: 'plan-gym-strength', completed: false },
        'Quarta': { planId: 'rest', completed: false },
        'Quinta': { planId: 'plan-gym-hypertrophy', completed: false },
        'Sexta': { planId: 'plan-gym-strength', completed: false },
        'Sábado': { planId: 'rest', completed: false },
        'Domingo': { planId: 'rest', completed: false },
      };
      const currentSched = prev[currentStudentId] || fallbackSchedule;
      return {
        ...prev,
        [currentStudentId]: {
          ...currentSched,
          [day]: {
            ...currentSched[day],
            planId
          }
        }
      };
    });
  };

  if (!isStudentLoggedIn && !isAdminAuthenticated) {
    return (
      <WelcomeAuth
        students={students}
        onRegisterStudent={handleRegisterStudentFromWelcome}
        onLoginStudent={handleLoginStudentFromWelcome}
        onLoginAdmin={handleLoginAdminFromWelcome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans selection:bg-[#D4FF00] selection:text-neutral-950" id="forte-training-app">
      
      {/* Main Premium Navbar Header */}
      <header className="bg-[#050505]/80 backdrop-blur-md border-b border-[#222] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4FF00] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#D4FF00]/15">
              <Dumbbell className="text-black transform -rotate-45" size={20} />
            </div>
            
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white leading-none">
                Forte <span className="text-[#D4FF00]">Treining</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mt-1">
                HEALTHCARE SUPER APP
              </p>
            </div>
          </div>

          {/* Core Tab Navigation Switche selector */}
          <nav className="flex items-center gap-1.5 bg-[#121212] p-1 rounded-2xl border border-[#222] w-full md:w-auto">
            <button
              id="nav-tab-student"
              onClick={() => setActiveTab('student')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all uppercase italic tracking-tighter ${
                activeTab === 'student'
                  ? 'bg-black text-[#D4FF00] border border-[#222] shadow-inner'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} className={activeTab === 'student' ? 'text-[#D4FF00]' : ''} />
              Área do Aluno
            </button>

            {isStudentLoggedIn && (
              <button
                onClick={() => {
                  setIsStudentLoggedIn(false);
                  setActiveSession(null);
                  alert('Sessão encerrada com sucesso.');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase italic tracking-tighter text-red-500 hover:text-white bg-red-950/25 hover:bg-red-900/40 border border-red-500/30 transition shrink-0 cursor-pointer"
                title="Sair da conta de aluno"
              >
                Sair
              </button>
            )}
          </nav>

          {/* Dynamic Accountability/Vibe Badge */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden lg:block">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none">Status da Conta</p>
              {currentUser.statusFinanceiro === 'Pago' ? (
                <p className="text-[#D4FF00] text-xs font-black flex items-center gap-1 uppercase italic tracking-tighter mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse"></span>
                  MATRÍCULA ATIVA (PRO)
                </p>
              ) : currentUser.statusFinanceiro === 'Pendente' ? (
                <p className="text-yellow-500 text-xs font-black flex items-center gap-1 uppercase italic tracking-tighter mt-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                  REVISÃO FINANCEIRA
                </p>
              ) : (
                <p className="text-red-500 text-xs font-black flex items-center gap-1 uppercase italic tracking-tighter mt-1">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                  ACESSO BLOQUEADO
                </p>
              )}
            </div>

            <div className="w-10 h-10 rounded-full border-2 border-[#D4FF00] p-0.5 shrink-0 hidden lg:flex items-center justify-center">
              <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center font-black text-xs text-[#D4FF00] italic">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Core Area Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        
        {/* VIEW 1: STUDENT FLOW */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            
            {/* PAYWALL BARRIER VALIDATION (Camada 4) */}
            {currentUser.statusFinanceiro === 'Inadimplente' ? (
              <div 
                id="paywall-overlay"
                className="max-w-xl mx-auto bg-[#121212] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden animate-scaleUp"
              >
                {/* Visual red lock badge blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 text-red-500 relative z-10">
                  <Lock size={32} className="animate-bounce" />
                </div>

                <div className="space-y-4 relative z-10">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                    ACESSO BLOQUEADO POR <span className="text-red-500">PENDÊNCIA</span>
                  </h2>
                  
                  {/* OBRIGATORY SPECIFICATE TEXT REQUIREMENT */}
                  <div className="bg-black/40 p-5 rounded-2xl border border-[#222] text-left text-neutral-300 text-xs sm:text-sm font-medium leading-relaxed">
                    "Ops! Identificamos uma pendência na sua matrícula. Por favor, compareça à recepção ou regularize seu plano para liberar seus treinos."
                  </div>
                </div>

                {/* Simulated payment utility */}
                <div className="bg-black/60 p-4 rounded-2xl border border-[#222] space-y-3 text-left relative z-10">
                  <span className="text-[10px] text-[#D4FF00] font-black uppercase tracking-widest block italic">Solução Rápida do Simulador:</span>
                  <p className="text-neutral-450 text-xs leading-relaxed">
                    Simule o pagamento imediato via PIX clicando no botão verde abaixo. O Firestore simulará a gravação do status <strong>"Pago"</strong> e a barreira financeira de segurança liberará seus treinos na hora.
                  </p>

                  <button
                    onClick={handleSimulatePixRegularizer}
                    id="btn-simulate-pix-unlock"
                    className="w-full bg-[#D4FF00] hover:bg-white text-black py-4 rounded-xl font-black uppercase italic tracking-tighter transition-colors cursor-pointer shadow-md text-center"
                  >
                    Simular Pagamento Integrado PIX
                  </button>
                </div>

                <div className="text-[10px] text-neutral-500 flex items-center justify-center gap-2 relative z-10">
                  <span>Provedora: Forte Treining Pagamentos S.A.</span>
                  <span>•</span>
                  <span>Segurança SSL</span>
                </div>
              </div>
            ) : (
              // Student is financially active - evaluate onboarding state
              <>
                {!currentUser.onboarded ? (
                  // ONBOARDING STEP (Camada 2)
                  <div className="space-y-6">
                    <div className="text-center max-w-lg mx-auto space-y-2">
                      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Onboarding de Avaliação Inicial</h2>
                      <p className="text-xs text-neutral-400">
                        Seja bem-vindo(a), <strong className="text-[#D4FF00]">{currentUser.name}</strong>! Preencha seus dados de condicionamento para calibrar seu roteiro biomecânico personalizado.
                      </p>
                    </div>
                    <Onboarding 
                      student={currentUser} 
                      onComplete={handleUpdateOnboarding} 
                    />
                  </div>
                ) : (
                  // ACTIVE SESSION TRACKER vs STANDARD DASHBOARD (Camada 3)
                  <>
                    {activeSession ? (
                      <WorkoutActive 
                        session={activeSession}
                        onUpdateSet={handleUpdateSessionSet}
                        onCancel={handleCancelWorkout}
                        onFinish={handleFinishWorkout}
                      />
                    ) : (
                      <WorkoutDashboard 
                        student={currentUser}
                        exercises={exercises}
                        logs={logs}
                        onStartWorkout={handleStartWorkoutSession}
                        weeklySchedule={weeklySchedules[currentUser.id] || {
                          'Segunda': { planId: 'plan-gym-hypertrophy', completed: false },
                          'Terça': { planId: 'plan-gym-strength', completed: false },
                          'Quarta': { planId: 'rest', completed: false },
                          'Quinta': { planId: 'plan-gym-hypertrophy', completed: false },
                          'Sexta': { planId: 'plan-gym-strength', completed: false },
                          'Sábado': { planId: 'rest', completed: false },
                          'Domingo': { planId: 'rest', completed: false },
                        }}
                        onUpdateSchedule={handleUpdateWeeklySchedule}
                      />
                    )}
                  </>
                )}
              </>
            )}

          </div>
        )}

        {/* VIEW 2: ADMIN PANEL */}
        {activeTab === 'admin' && (
          !isAdminAuthenticated ? (
            <div className="max-w-md mx-auto bg-[#121212] border border-[#222] rounded-[2rem] p-6 sm:p-8 space-y-6 text-center shadow-2xl relative overflow-hidden animate-scaleUp">
              {/* Decorative light elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00]/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="mx-auto w-16 h-16 bg-[#D4FF00]/10 rounded-full flex items-center justify-center border border-[#D4FF00]/20 text-[#D4FF00] relative z-10">
                <Lock size={30} className="text-[#D4FF00]" />
              </div>

              <div className="space-y-2 relative z-10">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  Acesso Reservado <span className="text-[#D4FF00]">Admin</span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Insira o login e senha de administrador para gerenciar o ecossistema Forte Treining.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const user = formData.get('adminUser') as string;
                  const pass = formData.get('adminPass') as string;
                  if (user === 'Treiningfort' && pass === '124578') {
                    setIsAdminAuthenticated(true);
                  } else {
                    alert('Usuário ou senha incorretos! Verifique os dados e tente novamente.');
                  }
                }}
                className="space-y-4 relative z-10 text-left"
              >
                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#D4FF00] font-mono font-black uppercase tracking-widest block select-none">Identificador / Usuário</label>
                  <input
                    type="text"
                    name="adminUser"
                    required
                    placeholder="Ex: Treiningfort"
                    className="w-full bg-[#050505] border border-[#222] rounded-xl px-3.5 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4FF00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#D4FF00] font-mono font-black uppercase tracking-widest block select-none">Senha de Segurança</label>
                  <input
                    type="password"
                    name="adminPass"
                    required
                    placeholder="••••••"
                    className="w-full bg-[#050505] border border-[#222] rounded-xl px-3.5 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4FF00]"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('student')}
                    className="w-1/2 bg-[#050505] hover:bg-[#1a1a1a] text-neutral-400 border border-[#222] py-4 rounded-xl text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#D4FF00] hover:bg-white text-black py-4 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-colors cursor-pointer"
                  >
                    Desbloquear
                  </button>
                </div>
              </form>

              <div className="text-[9px] text-neutral-500 pt-1.5 border-t border-[#222]/50 font-mono">
                SEGURANÇA ENCRYPTED • MOCK MIDDLEWARE NO-ACCESS
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AdminPanel 
                students={students}
                exercises={exercises}
                currentUser={currentUser}
                currentStudentId={currentStudentId}
                onSelectStudentId={setCurrentStudentId}
                onResetSimulator={handleResetSimulator}
                onUpdateStudentStatus={handleUpdateStudentStatus}
                onAddStudent={handleAddStudentByAdmin}
                onAddExercise={handleAddExerciseByAdmin}
              />
              
              {/* Safe dynamic triggers inside logged admin space */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                <button
                  onClick={() => {
                    setIsAdminAuthenticated(false);
                    setActiveTab('student');
                    alert('Sessão administrativa encerrada com sucesso.');
                  }}
                  className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer bg-red-950/10 hover:bg-red-950/20 border border-red-500/20 px-4 py-2.5 rounded-xl"
                >
                  🔒 Encerrar Sessão Admin
                </button>

                <button
                  onClick={() => setActiveTab('specification')}
                  className="text-xs text-neutral-500 hover:text-[#D4FF00] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer bg-neutral-900/60 hover:bg-neutral-900 border border-[#222] px-4 py-2.5 rounded-xl"
                >
                  ⚙️ Visualizar Dossiê de Especificações Técnicas (Acesso Restrito)
                </button>
              </div>
            </div>
          )
        )}

        {/* VIEW 3: SPECIFICATIONS */}
        {activeTab === 'specification' && (
          !isAdminAuthenticated ? (
            <div className="max-w-md mx-auto bg-[#121212] border border-[#222] rounded-[2rem] p-8 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Lock size={20} />
              </div>
              <p className="text-xs text-neutral-450">Acesso Restrito. Por favor, autentique-se como administrador primeiro para ver as especificações técnicas.</p>
              <button
                onClick={() => setActiveTab('admin')}
                className="px-5 py-2.5 bg-[#D4FF00] text-black text-xs font-black uppercase italic tracking-tighter rounded-xl transition-all cursor-pointer"
              >
                Logar como Administrador
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <ArchitectureView />
              <div className="flex justify-start pt-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className="text-xs text-[#D4FF00] hover:text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer bg-[#121212] hover:bg-black border border-[#222] px-4 py-2.5 rounded-xl"
                >
                  ← Voltar para o Painel Admin
                </button>
              </div>
            </div>
          )
        )}

      </main>

      {/* Seção Separada de Simulação e Controle do Administrador na parte Inferior do App */}
      <div className="bg-[#0b0b0b] border-t border-[#1e1e1e] py-6 px-4" id="admin-simulation-control-bar">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest font-mono block">MOCK CONTROLLERS</span>
            <p className="text-[11px] text-neutral-400">Gerenciador de simulação restrito para administradores e avaliadores técnicos.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {activeTab !== 'student' && (
              <button
                id="btn-back-to-student"
                onClick={() => setActiveTab('student')}
                className="px-5 py-3 bg-[#D4FF00] hover:bg-white text-black text-xs font-black uppercase italic tracking-tighter rounded-xl transition-all cursor-pointer shadow-lg shadow-[#D4FF00]/10 flex items-center gap-1.5"
              >
                ← Retornar à Área do Aluno
              </button>
            )}

            <button
              id="btn-trigger-admin-panel"
              onClick={() => setActiveTab('admin')}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all cursor-pointer border ${
                activeTab === 'admin'
                  ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                  : 'bg-[#121212] text-neutral-400 border-[#222] hover:border-neutral-700'
              }`}
            >
              🚀 Acessar Painel Admin
            </button>
          </div>
        </div>
      </div>

      {/* Sticky footer branding */}
      <footer className="bg-[#121212] border-t border-[#222] py-8 text-center text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
          <p>
            © 2026 FORTE TREINING SYSTEMS S.A. Todos os direitos reservados. Criado por{' '}
            <a 
              href="https://wa.link/39bdeq" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#D4FF00] hover:underline font-bold transition-all"
            >
              Agência Dgpixel
            </a>
          </p>
        </div>
      </footer>

      {/* Toast Alerta de Treino do Dia */}
      <AnimatePresence>
        {toast && toast.show && (
          <motion.div
            id="workout-alert-toast"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className={`fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-[380px] z-50 bg-[#121212]/95 border ${
              toast.type === 'pending'
                ? 'border-[#D4FF00]'
                : toast.type === 'completed'
                ? 'border-emerald-500/50'
                : 'border-blue-500/35'
            } p-5 rounded-2xl shadow-2xl shadow-black/90 flex items-start gap-4 backdrop-blur-md`}
          >
            {/* Left Status Indicator Accent Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'pending'
                ? 'bg-[#D4FF00]/10 text-[#D4FF00]'
                : toast.type === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-blue-500/10 text-blue-400'
            }`}>
              {toast.type === 'pending' ? (
                <Flame className="animate-pulse" size={18} />
              ) : toast.type === 'completed' ? (
                <Check size={18} className="stroke-[3]" />
              ) : (
                <Sparkles size={18} />
              )}
            </div>

            <div className="flex-1 space-y-1.5 text-left">
              <h4 className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                {toast.title}
                {toast.type === 'pending' && (
                  <span className="inline-flex w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-ping" />
                )}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {toast.message}
              </p>
              
              {toast.type === 'pending' && (
                <div className="pt-1.5">
                  <button
                    onClick={() => {
                      setToast(null);
                      const studentSched = weeklySchedules[currentStudentId];
                      const weekdaysPT: WeekDay[] = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                      const todayName = weekdaysPT[new Date().getDay()];
                      const todaySched = studentSched ? studentSched[todayName] : null;
                      if (todaySched && todaySched.planId !== 'rest') {
                        handleStartWorkoutSession(todaySched.planId);
                      } else {
                        handleStartWorkoutSession('plan-gym-hypertrophy');
                      }
                    }}
                    className="text-[10px] font-black uppercase text-black bg-[#D4FF00] hover:bg-white px-3.5 py-2 rounded-lg transition-all shrink-0 font-sans cursor-pointer inline-block"
                  >
                    🚀 Começar Treino
                  </button>
                </div>
              )}
            </div>

            {/* Manual Dismiss Trigger Button */}
            <button
              onClick={() => setToast(prev => prev ? { ...prev, show: false } : null)}
              className="text-neutral-500 hover:text-white transition p-1 shrink-0 cursor-pointer"
              title="Fechar alerta"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
