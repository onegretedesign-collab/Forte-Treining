/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, Exercise, PaymentStatus } from '../types';
import { Users, AlertTriangle, ShieldCheck, Check, Search, TrendingUp, Plus, Dumbbell, UserCheck, RotateCcw, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  students: StudentProfile[];
  exercises: Exercise[];
  currentUser: StudentProfile;
  currentStudentId: string;
  onSelectStudentId: (id: string) => void;
  onResetSimulator: () => void;
  onUpdateStudentStatus: (id: string, newStatus: PaymentStatus) => void;
  onAddStudent: (name: string, email: string, status: PaymentStatus, registrationDate?: string) => void;
  onAddExercise: (name: string, muscleGroup: string, instructions: string) => void;
  onDeleteStudent: (id: string) => void;
}

export default function AdminPanel({
  students,
  exercises,
  currentUser,
  currentStudentId,
  onSelectStudentId,
  onResetSimulator,
  onUpdateStudentStatus,
  onAddStudent,
  onAddExercise,
  onDeleteStudent
}: AdminPanelProps) {
  // Student state form
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentStatus, setStudentStatus] = useState<PaymentStatus>('Pago');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentRegistrationDate, setStudentRegistrationDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Exercise state form
  const [exName, setExName] = useState('');
  const [exMuscle, setExMuscle] = useState('Peitoral');
  const [exInstructions, setExInstructions] = useState('');

  // Toggles for active modals
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);

  // Stats calculation
  const totalStudents = students.length;
  const countPaid = students.filter(s => s.statusFinanceiro === 'Pago').length;
  const countPending = students.filter(s => s.statusFinanceiro === 'Pendente').length;
  const countInadimplente = students.filter(s => s.statusFinanceiro === 'Inadimplente').length;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail) return;
    onAddStudent(studentName, studentEmail, studentStatus, studentRegistrationDate);
    setStudentName('');
    setStudentEmail('');
    setStudentRegistrationDate(new Date().toISOString().split('T')[0]);
    setShowAddStudent(false);
  };

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName || !exInstructions) return;
    onAddExercise(exName, exMuscle, exInstructions);
    setExName('');
    setExInstructions('');
    setShowAddExercise(false);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6" id="admin-panel-container">
      {/* Top statistics bento row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#D4FF00]/10 flex items-center justify-center text-[#D4FF00] shrink-0 border border-[#D4FF00]/10">
            <Users size={18} />
          </div>
          <div>
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block leading-none mb-1">TOTAL MATRICULADOS</span>
            <span id="stat-total-students" className="text-2xl font-mono font-black text-white leading-none">{totalStudents}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/10">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block leading-none mb-1">STATUS: PAGO</span>
            <span id="stat-paid" className="text-2xl font-mono font-black text-emerald-400 leading-none">{countPaid}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0 border border-yellow-500/10">
            <TrendingUp size={18} />
          </div>
          <div>
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block leading-none mb-1">STATUS: PENDENTE</span>
            <span id="stat-pending" className="text-2xl font-mono font-black text-yellow-550 leading-none">{countPending}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#121212] border border-[#222] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 border border-red-500/10">
            <AlertTriangle size={18} />
          </div>
          <div>
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block leading-none mb-1">INADIMPLENTES</span>
            <span id="stat-blocked" className="text-2xl font-mono font-black text-red-500 leading-none">{countInadimplente}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Warning box */}
      <div className="bg-[#121212] p-5 border border-[#222] rounded-2xl text-neutral-300 text-xs flex items-start gap-4">
        <AlertTriangle className="text-[#D4FF00] shrink-0 mt-0.5 animate-pulse" size={20} />
        <div className="space-y-1">
          <p className="font-black text-white uppercase tracking-widest text-[9px] italic text-[#D4FF00]">Simulador de Validação em Tempo de Execução (Regras NoSQL / Secutity)</p>
          <p className="leading-relaxed text-gray-400">
            Mude o status financeiro do usuário atual logado para <strong>"Inadimplente"</strong> abaixo. Ao retornar à <strong>Área do Aluno</strong>, a barreira de segurança interceptará imediatamente o renderizador. Altere de volta para <strong>"Pago"</strong> para restabelecer o acesso instantaneamente.
          </p>
        </div>
      </div>

      {/* ÁREA DO SIMULADOR DO ALUNO (Completamente Reconfigurado e Restrito) */}
      <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 relative overflow-hidden space-y-4 shadow-lg" id="admin-student-simulator-sandbox">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9px] text-[#D4FF00] font-mono font-black uppercase tracking-widest block">AMBIENTE DE SIMULAÇÃO</span>
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest italic">
              <UserCheck size={18} className="text-[#D4FF00]" />
              Área do Simulador: Atribuição de Usuário Ativo
            </h3>
            <p className="text-xs text-neutral-400">
              Selecione o aluno que deseja representar na interface para testar seu Onboarding, seus Treinos e o bloqueio da barreira financeira.
            </p>
          </div>

          <button
            onClick={onResetSimulator}
            id="btn-admin-reset-sim"
            className="flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-[#D4FF00] bg-black/60 hover:bg-black px-4 py-2.5 rounded-xl border border-[#222] hover:border-[#D4FF00] transition font-mono uppercase shrink-0 self-start md:self-center cursor-pointer"
            title="Restabelecer dados originais de fábrica"
          >
            <RotateCcw size={12} className="text-[#D4FF00]" />
            Resetar Simulador
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 p-4 rounded-2xl border border-[#222]/80 items-stretch font-sans">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block select-none">SELECIONAR ALUNO EM SIMULAÇÃO</label>
            <select
              id="student-simulator-toggle"
              value={currentStudentId}
              onChange={(e) => onSelectStudentId(e.target.value)}
              className="w-full bg-[#050505] border border-[#222] rounded-xl px-4 py-3.5 text-xs text-[#D4FF00] font-black uppercase italic tracking-tighter focus:outline-none focus:border-[#D4FF00] cursor-pointer"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id} className="bg-[#121212] text-white">
                  {st.name} ({st.email}) — [{st.statusFinanceiro.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#121212] border border-[#222] rounded-xl p-3.5 flex flex-col justify-center space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[10px] gap-2">
              <span className="text-neutral-500 font-bold uppercase truncate">STATUS:</span>
              {currentUser.statusFinanceiro === 'Pago' ? (
                <span className="text-emerald-450 font-black italic">✓ PAGO</span>
              ) : currentUser.statusFinanceiro === 'Pendente' ? (
                <span className="text-yellow-500 font-black italic">⚠️ PENDENTE</span>
              ) : (
                <span className="text-red-500 font-black italic">❌ BLOQUEADO</span>
              )}
            </div>
            <div className="flex justify-between items-center text-[10px] gap-2">
              <span className="text-neutral-500 font-bold uppercase truncate">CADASTRO:</span>
              <span className="text-neutral-300 font-semibold">{currentUser.onboarded ? 'CONCLUÍDO' : 'PENDENTE'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] gap-2">
              <span className="text-neutral-500 font-bold uppercase truncate">METAS:</span>
              <span className="text-[#D4FF00] font-black italic truncate max-w-[110px]">{currentUser.mainGoal || 'SEM METAS'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Students List Column */}
        <div className="lg:col-span-2 bg-[#121212] border border-[#222] rounded-3xl p-6 space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00]/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest italic">
                <Users size={18} className="text-[#D4FF00]" />
                Controle de Matrículas Ativas
              </h3>
              <p className="text-xs text-neutral-400">Gerenciamento dinâmico de adimplência do ecossistema Forte Treining.</p>
            </div>

            <button
              id="btn-admin-add-student"
              onClick={() => setShowAddStudent(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#050505] hover:bg-black text-[#D4FF00] border border-[#222] hover:border-[#D4FF00] rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all cursor-pointer"
            >
              <Plus size={14} />
              Adicionar Aluno
            </button>
          </div>

          {/* Search bar */}
          <div className="relative bg-black/40 rounded-xl overflow-hidden border border-[#222] relative z-10">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input
              type="text"
              id="student-search-input"
              placeholder="Buscar alunos..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-550 focus:outline-none"
            />
          </div>

          {/* Grid list elements */}
          <div className="overflow-x-auto relative z-10">
            <div className="min-w-[600px] divide-y divide-[#222]/60">
              {filteredStudents.map((stud) => {
                const isActiveUser = stud.id === currentUser.id;
                return (
                  <div
                    key={stud.id}
                    id={`student-row-${stud.id}`}
                    className={`py-3 flex items-center justify-between text-xs gap-4 rounded-xl transition px-2.5 my-1 ${
                      isActiveUser ? 'bg-[#D4FF00]/5 border-l-2 border-[#D4FF00]' : 'hover:bg-black/10'
                    }`}
                  >
                    {/* User credentials */}
                    <div className="w-1/3 min-w-[150px] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{stud.name}</span>
                        {isActiveUser && (
                          <span className="bg-[#D4FF00]/10 text-[#D4FF00] text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-[#D4FF00]/10 font-mono tracking-wider">
                            LOGADO
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono block">{stud.email}</span>
                      {stud.contact && (
                        <span className="text-[10px] text-[#D4FF00] font-mono block">📞 {stud.contact}</span>
                      )}
                      <span className="text-[10px] text-[#D4FF00] font-black block font-mono">
                        📅 Adesão: {stud.registrationDate || '2026-06-03'}
                      </span>
                    </div>

                    {/* Biometrics completed badge */}
                    <div className="w-1/4">
                      {stud.onboarded ? (
                        <div className="space-y-0.5">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                            Onboarding Concluído
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono block pl-2 mt-1">
                            {stud.weight}kg • {stud.height}cm • {stud.age}a
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="bg-neutral-800 text-neutral-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-neutral-750">
                            Aguardando
                          </span>
                          {stud.age && (
                            <span className="text-[10px] text-neutral-400 font-mono block pl-2">
                              Idade: {stud.age}a
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Financial Status tag with selectors and deletion button */}
                    <div className="w-1/3 flex items-center gap-2 justify-end">
                      <select
                        id={`select-status-${stud.id}`}
                        value={stud.statusFinanceiro}
                        onChange={(e) => onUpdateStudentStatus(stud.id, e.target.value as PaymentStatus)}
                        className={`text-xs font-black uppercase tracking-tighter italic rounded-xl px-3 py-2.5 border focus:outline-none focus:ring-1 ${
                          stud.statusFinanceiro === 'Pago'
                            ? 'bg-emerald-950/20 text-[#10B981] border-[#10B981]/30'
                            : stud.statusFinanceiro === 'Pendente'
                            ? 'bg-yellow-950/20 text-[#F59E0B] border-[#F59E0B]/30'
                            : 'bg-red-950/20 text-[#EF4444] border-[#EF4444]/30'
                        }`}
                      >
                        <option value="Pago" className="bg-neutral-900 text-emerald-400">Pago</option>
                        <option value="Pendente" className="bg-neutral-900 text-yellow-500">Pendente</option>
                        <option value="Inadimplente" className="bg-neutral-900 text-red-500">Inadimplente</option>
                      </select>

                      <button
                        onClick={() => onDeleteStudent(stud.id)}
                        id={`btn-delete-student-${stud.id}`}
                        className="p-2.5 bg-red-950/25 hover:bg-red-900/40 text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-xl transition cursor-pointer"
                        title="Remover este aluno de forma permanente"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Exercises Catalog List */}
        <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4FF00]/5 rounded-full blur-[65px] pointer-events-none" />

          <div className="flex justify-between items-center relative z-10">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest italic">
                <Dumbbell size={18} className="text-[#D4FF00]" />
                Exercícios Gerais
              </h3>
              <p className="text-xs text-neutral-400">Catálogo ({exercises.length}).</p>
            </div>

            <button
              id="btn-admin-add-exercise"
              onClick={() => setShowAddExercise(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#050505] hover:bg-black text-[#D4FF00] border border-[#222] hover:border-[#D4FF00] rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all cursor-pointer"
            >
              <Plus size={14} />
              Registrar
            </button>
          </div>

          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 relative z-10 font-sans">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 bg-black/40 rounded-2xl border border-[#222] space-y-1.5 text-xs hover:border-[#D4FF00]/10 transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-white text-xs">{ex.name}</span>
                  <span className="bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/10 text-[8px] px-2 py-0.5 rounded font-mono font-black uppercase tracking-wider block shrink-0">
                    {ex.muscleGroup}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed truncate-2-lines">
                  {ex.instructions}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Student Modal Panel */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#121212] border border-[#222] rounded-[2rem] max-w-sm w-full p-8 space-y-6 shadow-2xl animate-scaleUp relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4FF00]/5 rounded-full blur-[80px]" />
            
            <div className="space-y-1.5 relative z-10">
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Novo Aluno</h4>
              <p className="text-xs text-neutral-400">Registre os dados de simulação de novas matrículas no bando de dados.</p>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Nome Completo</label>
                <input
                  type="text"
                  id="admin-form-student-name"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Pedro Henrique"
                  className="w-full bg-[#050505] border border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Endereço de E-mail</label>
                <input
                  type="email"
                  id="admin-form-student-email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="Ex: pedro@email.com"
                  className="w-full bg-[#050505] border border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-550 uppercase font-black tracking-widest block mb-1">Data de Adesão / Matrícula</label>
                <input
                  type="date"
                  id="admin-form-student-registration-date"
                  required
                  value={studentRegistrationDate}
                  onChange={(e) => setStudentRegistrationDate(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">STATUS FINANCEIRO INICIAL</label>
                <select
                  id="admin-form-student-status"
                  value={studentStatus}
                  onChange={(e) => setStudentStatus(e.target.value as PaymentStatus)}
                  className="w-full bg-[#050505] border border-[#222] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4FF00] font-black uppercase tracking-tighter italic"
                >
                  <option value="Pago">Pago</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Inadimplente">Inadimplente</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="w-full bg-[#050505] hover:bg-[#121212] text-neutral-400 border border-[#222] py-4 rounded-xl text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-admin-submit-student"
                  className="w-full bg-[#D4FF00] hover:bg-white text-black py-4 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-colors cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exercise Modal Panel */}
      {showAddExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#121212] border border-[#222] rounded-[2rem] max-w-sm w-full p-8 space-y-6 shadow-2xl animate-scaleUp relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4FF00]/5 rounded-full blur-[80px]" />
            
            <div className="space-y-1.5 relative z-10">
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Criar Exercício Global</h4>
              <p className="text-xs text-neutral-400 font-medium">Cadastre o exercício para complementar a base de atribuição padrão.</p>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Nome do Exercício</label>
                <input
                  type="text"
                  id="admin-form-ex-name"
                  required
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  placeholder="Ex: Supino Declinado"
                  className="w-full bg-[#050505] border border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4FF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Grupo Muscular Alvo</label>
                <select
                  id="admin-form-ex-muscle"
                  value={exMuscle}
                  onChange={(e) => setExMuscle(e.target.value)}
                  className="w-full bg-[#050505] border border-[#222] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4FF00] font-black uppercase tracking-tighter italic"
                >
                  {['Peitoral', 'Costas', 'Dorsal', 'Quadríceps / Glúteos', 'Ombros (Deltoide)', 'Bíceps', 'Tríceps', 'Core', 'Cardio HIIT'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest block mb-1">Guia de Execução (Instruções)</label>
                <textarea
                  id="admin-form-ex-instructions"
                  required
                  rows={3}
                  value={exInstructions}
                  onChange={(e) => setExInstructions(e.target.value)}
                  placeholder="Instruções biomecânicas passo a passo..."
                  className="w-full bg-[#050505] border border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4FF00] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExercise(false)}
                  className="w-full bg-[#050505] hover:bg-[#121212] text-neutral-400 border border-[#222] py-4 rounded-xl text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-admin-submit-exercise"
                  className="w-full bg-[#D4FF00] hover:bg-white text-black py-4 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-colors cursor-pointer"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
