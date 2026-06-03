/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercise, StudentProfile, TrainingLog } from './types';

export const INITIAL_EXERCISES: Exercise[] = [
  // Academia completa (Gym)
  {
    id: 'supino-reto',
    name: 'Supino Reto com Barra',
    muscleGroup: 'Peitoral',
    instructions: 'Deite no banco reto, segure a barra com uma pegada ativa além da largura dos ombros, desça de forma controlada até o centro do tórax e empurre com explosão guiando os cotovelos para dentro.',
    defaultSets: 4,
    defaultReps: '8 a 12'
  },
  {
    id: 'puxada-frente',
    name: 'Puxada Aberta no Pulley',
    muscleGroup: 'Costas (Latíssimo)',
    instructions: 'Sente-se no aparelho, segure o puxador com as mãos afastadas e puxe a barra em direção ao peitoral superior, contraindo as escápulas.',
    defaultSets: 4,
    defaultReps: '10 a 12'
  },
  {
    id: 'agachamento-barra',
    name: 'Agachamento Livre com Barra',
    muscleGroup: 'Quadríceps / Glúteos',
    instructions: 'Apoie a barra nos trapézios, afaste os pés na largura dos ombros. Desça flexionando quadris e joelhos até romper o ângulo de 90 graus.',
    defaultSets: 4,
    defaultReps: '8 a 10'
  },
  {
    id: 'desenvolvimento-halteres',
    name: 'Desenvolvimento de Ombros',
    muscleGroup: 'Ombros (Deltoide)',
    instructions: 'Sentado com apoio lombar, eleve os halteres verticalmente até a extensão quase completa dos braços. Desça controlando o peso.',
    defaultSets: 3,
    defaultReps: '10 a 12'
  },
  {
    id: 'rosca-direta',
    name: 'Rosca Direta na Barra W',
    muscleGroup: 'Bíceps',
    instructions: 'Em pé, mantenha o abdômen contraído e os cotovelos colados ao tronco. Flexione os braços trazendo a barra em direção aos ombros.',
    defaultSets: 3,
    defaultReps: '12'
  },
  {
    id: 'tricep-corda',
    name: 'Tríceps Pulley com Corda',
    muscleGroup: 'Tríceps',
    instructions: 'Fique de frente para a polia, dobre levemente o quadril e estenda os braços para baixo separando as pontas da corda no final do movimento.',
    defaultSets: 3,
    defaultReps: '12'
  },
  
  // Calistenia / Home Workout
  {
    id: 'flexao-tradicional',
    name: 'Flexão de Braço Progressiva',
    muscleGroup: 'Peitoral / Tríceps',
    instructions: 'Mantenha as mãos na linha dos ombros, corpo alinhado em prancha. Desça até quase tocar o peito no chão e suba empurrando o solo ativo.',
    defaultSets: 4,
    defaultReps: 'Máximo (FALHA)'
  },
  {
    id: 'barra-fixa-pronada',
    name: 'Barra Fixa Estrita',
    muscleGroup: 'Costas (Dorsal)',
    instructions: 'Pendente em uma barra estável com pegada pronada aberta, puxe o corpo para cima até passar o queixo sobre a linha da barra.',
    defaultSets: 4,
    defaultReps: '6 a 10'
  },
  {
    id: 'agachamento-pistol',
    name: 'Agachamento Unilateral (Pistol)',
    muscleGroup: 'Quadríceps / Estabilidade',
    instructions: 'Fique em pé em uma perna só, estenda a outra à frente. Agache controlando com a musculatura da coxa e retorne mantendo o equilíbrio ativo.',
    defaultSets: 3,
    defaultReps: '6 a 8'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers (Escalador)',
    muscleGroup: 'Core / Cardio HIIT',
    instructions: 'Posição de prancha alta. Traga os joelhos em direção ao peito de forma alternada e explosiva, simulando uma corrida rápida.',
    defaultSets: 3,
    defaultReps: '45 segundos'
  },
  {
    id: 'elevacao-pelvica',
    name: 'Elevação Pélvica de Solo (Unilateral)',
    muscleGroup: 'Glúteo / Posterior',
    instructions: 'Deitado de costas, flexione um joelho apoiando o pé no chão. Suba o quadril estendendo a outra perna totalmente alinhada.',
    defaultSets: 3,
    defaultReps: '15 reps'
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'student-1',
    name: 'Rodrigo Silva',
    email: 'rodrigo.silva@academiaforte.com',
    role: 'aluno',
    statusFinanceiro: 'Pago',
    onboarded: true,
    age: 28,
    weight: 84,
    height: 182,
    experienceLevel: 'Intermediário',
    trainingLocation: 'Academia',
    mainGoal: 'Hipertrofia',
    frequency: '5x',
    registrationDate: '2026-01-15'
  },
  {
    id: 'student-2',
    name: 'Mariana Costa',
    email: 'mariana.costa@hotmail.com',
    role: 'aluno',
    statusFinanceiro: 'Pendente',
    onboarded: true,
    age: 24,
    weight: 62,
    height: 165,
    experienceLevel: 'Iniciante',
    trainingLocation: 'Home Workout',
    mainGoal: 'Emagrecimento',
    frequency: '4x',
    registrationDate: '2026-03-01'
  },
  {
    id: 'student-3',
    name: 'Gabriel Menezes',
    email: 'gabriel.menezes@gmail.com',
    role: 'aluno',
    statusFinanceiro: 'Inadimplente',
    onboarded: true,
    age: 32,
    weight: 95,
    height: 178,
    experienceLevel: 'Avançado',
    trainingLocation: 'Academia',
    mainGoal: 'Ganho de Força',
    frequency: '6x',
    registrationDate: '2025-11-10'
  },
  {
    id: 'student-4',
    name: 'Helena Abreu',
    email: 'helena.abreu@outlook.com',
    role: 'aluno',
    statusFinanceiro: 'Pago',
    onboarded: false,
    registrationDate: '2026-05-28'
  }
];

export interface SuggestedPlan {
  id: string;
  title: string;
  level: string;
  location: string;
  goal: string;
  frequency: string;
  description: string;
  exercises: { exerciseId: string; sets: number; reps: string }[];
}

export const SUGGESTED_PLANS: SuggestedPlan[] = [
  {
    id: 'plan-gym-hypertrophy',
    title: 'Ficha ABC - Hipertrofia Absoluta',
    level: 'Intermediário',
    location: 'Academia',
    goal: 'Hipertrofia',
    frequency: '5x',
    description: 'Foco em estresse metabólico e sobrecarga progressiva com máquinas e pesos livres para máximo estímulo hipertrófico.',
    exercises: [
      { exerciseId: 'supino-reto', sets: 4, reps: '8 a 12' },
      { exerciseId: 'puxada-frente', sets: 4, reps: '10 a 12' },
      { exerciseId: 'desenvolvimento-halteres', sets: 3, reps: '10 a 12' },
      { exerciseId: 'rosca-direta', sets: 3, reps: '12' },
      { exerciseId: 'tricep-corda', sets: 3, reps: '12' }
    ]
  },
  {
    id: 'plan-gym-strength',
    title: 'Ficha Foco Força - Regulação de Carga',
    level: 'Avançado',
    location: 'Academia',
    goal: 'Ganho de Força',
    frequency: '6x',
    description: 'Exercícios multiarticulares com repetições baixas e alto tempo de descanso, visando recrutamento de unidades motoras secundárias.',
    exercises: [
      { exerciseId: 'agachamento-barra', sets: 4, reps: '5 reps (Força Máxima)' },
      { exerciseId: 'supino-reto', sets: 4, reps: '6 reps' },
      { exerciseId: 'puxada-frente', sets: 4, reps: '8 reps' },
      { exerciseId: 'desenvolvimento-halteres', sets: 3, reps: '8 reps' }
    ]
  },
  {
    id: 'plan-home-loss',
    title: 'Ficha Metodologia HIIT Corporal',
    level: 'Iniciante',
    location: 'Home Workout',
    goal: 'Emagrecimento',
    frequency: '4x',
    description: 'Estímulo de alta intensidade sem pesos para ativação cardiovascular, alto gasto calórico pós-treino (efeito EPOC).',
    exercises: [
      { exerciseId: 'flexao-tradicional', sets: 3, reps: 'Limite' },
      { exerciseId: 'agachamento-pistol', sets: 3, reps: '10 reps (assistido)' },
      { exerciseId: 'mountain-climbers', sets: 4, reps: '45 segundos' },
      { exerciseId: 'elevacao-pelvica', sets: 3, reps: '15 reps' }
    ]
  },
  {
    id: 'plan-home-conditioning',
    title: 'Ficha Funcional em Casa',
    level: 'Intermediário',
    location: 'Home Workout',
    goal: 'Condicionamento',
    frequency: '3x',
    description: 'Rotina focada em mobilidade, força isométrica e controle neuromuscular usando técnicas calistênicas puras.',
    exercises: [
      { exerciseId: 'barra-fixa-pronada', sets: 4, reps: 'Máximo' },
      { exerciseId: 'flexao-tradicional', sets: 4, reps: '15 reps' },
      { exerciseId: 'agachamento-pistol', sets: 3, reps: '8 reps' },
      { exerciseId: 'mountain-climbers', sets: 3, reps: '30 segundos' }
    ]
  }
];

export const MOCK_TRAINING_LOGS: TrainingLog[] = [
  { id: 'log-1', date: '2026-05-28', workoutTitle: 'Treino A - Peito/Tríceps', totalWeightLifted: 1320, completedSetsCount: 11 },
  { id: 'log-2', date: '2026-05-30', workoutTitle: 'Treino B - Costas/Bíceps', totalWeightLifted: 1450, completedSetsCount: 12 },
  { id: 'log-3', date: '2026-06-01', workoutTitle: 'Treino C - Quadríceps/Glúteos', totalWeightLifted: 1980, completedSetsCount: 10 },
];
