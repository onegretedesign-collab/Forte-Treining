/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'aluno' | 'admin';

export type PaymentStatus = 'Pago' | 'Pendente' | 'Inadimplente';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  statusFinanceiro: PaymentStatus;
  
  // Onboarding Data
  onboarded: boolean;
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  experienceLevel?: 'Iniciante' | 'Intermediário' | 'Avançado';
  trainingLocation?: 'Academia' | 'Home Workout';
  mainGoal?: 'Hipertrofia' | 'Ganho de Força' | 'Emagrecimento' | 'Condicionamento';
  frequency?: '3x' | '4x' | '5x' | '6x';
  
  // Active Workouts
  assignedWorkoutId?: string;
  registrationDate: string;
  contact?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  instructions: string;
  videoUrl?: string;
  defaultSets: number;
  defaultReps: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number; // load in kg
  completed: boolean;
}

export interface WorkoutExerciseState {
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
}

export interface ActiveWorkoutSession {
  id: string;
  title: string;
  startTime: number; // Timestamp
  exercises: WorkoutExerciseState[];
}

export interface TrainingLog {
  id: string;
  date: string; // YYYY-MM-DD
  workoutTitle: string;
  totalWeightLifted: number; // kg sum of weight * completed reps
  completedSetsCount: number;
}
