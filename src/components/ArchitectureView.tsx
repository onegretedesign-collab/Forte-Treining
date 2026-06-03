/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Shield, GitFork, Code, CheckCircle, Lock, Users } from 'lucide-react';

export default function ArchitectureView() {
  const [activeSection, setActiveSection] = useState<'db' | 'ux' | 'rules'>('db');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Código copiado com sucesso!');
  };

  return (
    <div className="space-y-6" id="architecture-view-container">
      {/* Title & Description Header */}
      <div className="bg-[#121212] border border-[#222] rounded-[2rem] p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#D4FF00]/10 text-[#D4FF00] text-[9px] px-2.5 py-1 rounded-full font-black border border-[#D4FF00]/10 uppercase tracking-widest">
                Camada 5 - Entregável Técnico Sênior
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">Especificações & Arquitetura</h2>
            <p className="text-neutral-400 text-xs mt-2 max-w-xl">
              Análise detalhada do ecossistema NoSQL idealizado pelo Arquiteto de Software Sênior para a marca Forte Treining.
            </p>
          </div>
          
          <div className="flex bg-[#050505] p-1.5 rounded-2xl border border-[#222] self-start md:self-auto">
            <button
              id="spec-db-tab"
              onClick={() => setActiveSection('db')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all ${
                activeSection === 'db'
                  ? 'bg-black text-[#D4FF00] border border-[#222] shadow-inner font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Database size={13} />
              Modelagem NoSQL
            </button>
            <button
              id="spec-ux-tab"
              onClick={() => setActiveSection('ux')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all ${
                activeSection === 'ux'
                  ? 'bg-black text-[#D4FF00] border border-[#222] shadow-inner font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GitFork size={13} />
              Navegação UX
            </button>
            <button
              id="spec-rules-tab"
              onClick={() => setActiveSection('rules')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all ${
                activeSection === 'rules'
                  ? 'bg-black text-[#D4FF00] border border-[#222] shadow-inner font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield size={13} />
              Segurança Auth
            </button>
          </div>
        </div>
      </div>

      {/* Active Section Content */}
      {activeSection === 'db' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Firestore Collections Architecture */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 pb-8">
              <h3 className="text-lg font-black text-white flex items-center gap-2.5 mb-2 uppercase italic tracking-tighter">
                <Database className="text-[#D4FF00] animate-pulse" size={18} />
                Estruturados Cloud Firestore (NoSQL)
              </h3>
              <p className="text-xs text-neutral-400 mb-6 font-medium">
                Arquitetura modelada em Coleções e Subcoleções no Firestore para carregamentos de latência sub-milisegundo.
              </p>

              <div className="space-y-6">
                {/* Collection: users */}
                <div className="border border-[#222] bg-[#050505]/40 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black bg-blue-500/15 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                        COLEÇÃO MASTER
                      </span>
                      <code className="text-[#D4FF00] font-mono font-black text-sm">/users</code>
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider font-mono">Biometria & Conta</span>
                  </div>
                  <div className="bg-[#050505] text-neutral-300 p-4 rounded-xl border border-[#222]/60 font-mono text-xs overflow-x-auto space-y-2">
                    <div><span className="text-neutral-500">uid:</span> <span className="text-emerald-400">"auth_id_string"</span> <span className="text-neutral-500">// Chave primária atrelada ao Firebase Auth</span></div>
                    <div><span className="text-neutral-500">displayName:</span> <span className="text-orange-400">"Rodrigo Silva"</span></div>
                    <div><span className="text-neutral-500">email:</span> <span className="text-orange-400">"rodrigo@email.com"</span></div>
                    <div><span className="text-neutral-500">role:</span> <span className="text-purple-400">"aluno" | "admin"</span></div>
                    <div><span className="text-neutral-500">statusFinanceiro:</span> <span className="text-rose-450">"Pago" | "Pendente" | "Inadimplente"</span></div>
                    <div><span className="text-neutral-500">onboarded:</span> <span className="text-indigo-400">boolean</span></div>
                    <div className="pl-4 text-neutral-400">
                      <span className="text-neutral-500">biometrics: &#123;</span>
                      <div className="pl-4"><span className="text-neutral-500">age:</span> 28,</div>
                      <div className="pl-4"><span className="text-neutral-500">weight:</span> 84, <span className="text-neutral-500">// em kg</span></div>
                      <div className="pl-4"><span className="text-neutral-500">height:</span> 182, <span className="text-neutral-500">// em cm</span></div>
                      <div className="pl-4"><span className="text-neutral-500">experienceLevel:</span> <span className="text-orange-400">"Iniciante" | "Intermediário" | "Avançado"</span>,</div>
                      <div className="pl-4"><span className="text-neutral-500">trainingLocation:</span> <span className="text-orange-400">"Academia" | "Home Workout"</span>,</div>
                      <div className="pl-4"><span className="text-neutral-500">mainGoal:</span> <span className="text-orange-400">"Hipertrofia" | "Força" | "Emagrecimento"</span>,</div>
                      <div className="pl-4"><span className="text-neutral-500">frequency:</span> <span className="text-orange-400">"3x" | "4x" | "5x" | "6x"</span></div>
                      <span className="text-neutral-500">&#125;</span>
                    </div>
                    <div><span className="text-neutral-500">assignedWorkoutId:</span> <span className="text-emerald-400">"plan-gym-hypertrophy" / null</span></div>
                    <div><span className="text-neutral-500">updatedAt:</span> <span className="text-teal-400">timestamp</span></div>
                  </div>
                </div>

                {/* Subcollection: logs */}
                <div className="border border-[#222] bg-[#050505]/40 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black bg-amber-500/15 text-amber-500 border border-amber-500/10 px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                        SUBCOLEÇÃO
                      </span>
                      <code className="text-[#D4FF00] font-mono font-black text-sm">/users/&#123;uid&#125;/logs</code>
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider font-mono">Overloads de Carga</span>
                  </div>
                  <div className="bg-[#050505] text-neutral-300 p-4 rounded-xl border border-[#222]/60 font-mono text-xs overflow-x-auto space-y-2">
                    <div><span className="text-neutral-500">logId:</span> <span className="text-emerald-400">"auto_generated_id_by_firestore"</span></div>
                    <div><span className="text-neutral-500">date:</span> <span className="text-teal-400">"2026-06-03"</span></div>
                    <div><span className="text-neutral-500">workoutTitle:</span> <span className="text-orange-400">"Ficha ABC - Hipertrofia Absoluta"</span></div>
                    <div><span className="text-neutral-500">durationSeconds:</span> <span className="text-indigo-400">2470</span></div>
                    <div className="pl-4 text-neutral-400">
                      <span className="text-neutral-500">completedSets: [</span>
                      <div className="pl-4">&#123; exerciseId: <span className="text-orange-400">"supino-reto"</span>, setNo: 1, weight: 80, reps: 10 &#125;,</div>
                      <div className="pl-4">&#123; exerciseId: <span className="text-orange-400">"supino-reto"</span>, setNo: 2, weight: 80, reps: 9 &#125;,</div>
                      <div className="pl-4">&#123; exerciseId: <span className="text-orange-400">"puxada-frente"</span>, setNo: 1, weight: 65, reps: 12 &#125;</div>
                      <span className="text-neutral-500">]</span>
                    </div>
                    <div><span className="text-neutral-500">totalWeightAcumulated:</span> 1445 <span className="text-neutral-500">// kg totais (Série × Peso × Reps)</span></div>
                  </div>
                </div>

                {/* Collection: global_exercises */}
                <div className="border border-[#222] bg-[#050505]/40 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black bg-purple-500/15 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                        CATÁLOGO GERAL
                      </span>
                      <code className="text-[#D4FF00] font-mono font-black text-sm">/exercises</code>
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider font-mono">Bases Técnicas</span>
                  </div>
                  <div className="bg-[#050505] text-neutral-300 p-4 rounded-xl border border-[#222]/60 font-mono text-xs overflow-x-auto space-y-2">
                    <div><span className="text-neutral-500">exerciseId:</span> <span className="text-emerald-400">"supino-reto"</span></div>
                    <div><span className="text-neutral-500">name:</span> <span className="text-orange-400">"Supino Reto com Barra"</span></div>
                    <div><span className="text-neutral-500">muscleGroup:</span> <span className="text-orange-400">"Peitoral"</span></div>
                    <div><span className="text-neutral-500">instructions:</span> <span className="text-orange-400">"Segure a barra com pegada ativa..."</span></div>
                    <div><span className="text-neutral-500">defaultSets:</span> 4</div>
                    <div><span className="text-neutral-500">defaultReps:</span> <span className="text-orange-400">"8 a 12"</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Keys Info */}
          <div className="space-y-6">
            <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-black text-gray-550 uppercase tracking-widest italic flex items-center gap-2">
                <Code className="text-[#D4FF00]" size={14} />
                Políticas de Índices Compostos
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Para carregar cronogramas em tempo real do Firestore sem latências no terminal, estes índices compostos dão suporte:
              </p>
              
              <div className="bg-black/40 p-4 rounded-2xl border border-[#222] text-xs space-y-4 font-mono">
                <div className="space-y-1">
                  <p className="text-[#D4FF00] text-xs font-black">ÍNDICE ACUMULADO LOGS:</p>
                  <p className="text-neutral-500 text-[10px]">Coleção /users/*/logs</p>
                  <div className="flex gap-1.5 text-[9px] text-[#D4FF00] font-black mt-1">
                     <span className="bg-black px-2 py-0.5 rounded border border-[#222]">date [Asc]</span>
                     <span className="bg-black px-2 py-0.5 rounded border border-[#222]">totalWeight [Asc]</span>
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-[#222]/80">
                  <p className="text-[#D4FF00] text-xs font-black">ÍNDICE ADIMPLÊNCIA RAPID:</p>
                  <p className="text-neutral-500 text-[10px]">Coleção /users</p>
                  <div className="flex gap-1.5 text-[9px] text-neutral-400 font-bold mt-1">
                     <span className="bg-black px-2 py-0.5 rounded border border-[#222]">role == 'aluno'</span>
                     <span className="bg-black px-2 py-0.5 rounded border border-[#222]">statusFinanceiro</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#D4FF00]/5 text-[#D4FF00] p-4 rounded-2xl border border-[#D4FF00]/10 text-xs space-y-1.5">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle size={13} className="text-[#D4FF00]" />
                  Criptografia TLS 1.3 nativa:
                </p>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Os dados trafegam encriptados sob rigorosos padrões corporativos, em total conformidade técnica com a LGPD.
                </p>
              </div>
            </div>

            <div className="bg-[#121212] border border-[#222] rounded-3xl p-6">
              <h4 className="text-xs font-black text-gray-550 uppercase tracking-widest italic flex items-center gap-2 mb-3">
                <Users className="text-[#D4FF00]" size={14} />
                Regras Estritas de Auth
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Tokens gerados em hash criptográfico criptografados ligam as credenciais estritas do aluno à sua subcoleção.
              </p>
              <ul className="text-xs text-neutral-305 space-y-3 font-medium">
                <li className="flex items-start gap-2">
                  <span className="bg-[#D4FF00] text-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black shrink-0">1</span>
                  <span><strong>E-mail/Senha:</strong> Autenticada nativamente pelo provedor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#D4FF00] text-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black shrink-0">2</span>
                  <span><strong>Social JWT:</strong> Token assinado via chave pública certificada.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'ux' && (
        <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 sm:p-8 animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00]/5 rounded-full blur-[80px]" />
          
          <h3 className="text-lg font-black text-white flex items-center gap-2.5 mb-2 uppercase italic tracking-tighter relative z-10">
            <GitFork className="text-[#D4FF00]" size={18} />
            Fluxograma Descritivo de Navegação do Aluno (UX)
          </h3>
          <p className="text-xs text-neutral-400 mb-8 font-medium relative z-10">
            A jornada do Aluno foi mapeada em bento blocks integrados para acelerar a inicialização sob estresse físico na academia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            
            {/* Step 1 */}
            <div className="bg-[#050505]/50 p-5 rounded-2xl border border-[#222] relative space-y-3">
              <span className="absolute -top-3 left-4 bg-[#D4FF00] text-black text-xs font-black w-6.5 h-6.5 rounded-full flex items-center justify-center italic">
                1
              </span>
              <p className="font-bold text-sm text-[#D4FF00] pt-1">Login Seguro</p>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Acesso com credenciais de aluno. Intercepta validações.
              </p>
              <div className="bg-black/50 p-2.5 rounded-lg text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                Verifica: `onboarded`
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#050505]/50 p-5 rounded-2xl border border-[#222] relative space-y-3">
              <span className="absolute -top-3 left-4 bg-[#D4FF00] text-black text-xs font-black w-6.5 h-6.5 rounded-full flex items-center justify-center italic">
                2
              </span>
              <p className="font-bold text-sm text-[#D4FF00] pt-1">Onboarding Carousel</p>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Coleta biométrica para calibragem muscular sob demanda.
              </p>
              <div className="bg-black/50 p-2.5 rounded-lg text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                Grava: `biometrics`
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#050505]/50 p-5 rounded-2xl border border-[#222] relative space-y-3">
              <span className="absolute -top-3 left-4 bg-[#D4FF00] text-black text-xs font-black w-6.5 h-6.5 rounded-full flex items-center justify-center italic">
                3
              </span>
              <p className="font-bold text-sm text-[#D4FF00] pt-1">Atribuição Motor</p>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Cruzamento de dados para determinação das planilhas.
              </p>
              <div className="bg-black/50 p-2.5 rounded-lg text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                Gera: `assignedPlanId`
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#050505]/50 p-5 rounded-2xl border border-[#222] relative space-y-3">
              <span className="absolute -top-3 left-4 bg-red-550 text-white text-xs font-black w-6.5 h-6.5 rounded-full flex items-center justify-center italic bg-red-650">
                4
              </span>
              <p className="font-bold text-sm text-red-400 pt-1">Financial Gate</p>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans text-rose-300">
                Validação financeira imediata. Lança paywall caso irregular.
              </p>
              <div className="bg-black/50 p-2.5 rounded-lg text-[9px] font-mono text-red-400 uppercase tracking-wider">
                Status != 'Pago'
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#050505]/50 p-5 rounded-2xl border border-[#222] relative space-y-3">
              <span className="absolute -top-3 left-4 bg-[#D4FF00] text-black text-xs font-black w-6.5 h-6.5 rounded-full flex items-center justify-center italic">
                5
              </span>
              <p className="font-bold text-sm text-[#D4FF00] pt-1">Treinamento</p>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Interface de treino com inputs de carga viva e histórico.
              </p>
              <div className="bg-black/50 p-2.5 rounded-lg text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                Série: `completed`
              </div>
            </div>

          </div>

          <div className="mt-8 bg-black/40 p-5 rounded-2xl border border-[#222] text-xs space-y-2 relative z-10">
            <h4 className="font-black text-[#D4FF00] uppercase tracking-widest flex items-center gap-1.5 italic">
              <CheckCircle size={14} className="text-[#D4FF00]" />
              Foco em Ergonomia e Usabilidade (Design Pattern):
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              Botões de interação para encerramento de séries possuem dimensões aumentadas (acima de 44px de toque) para neutralizar o estresse e cansaço biomecânico do aluno durante as repetições estritas.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          {/* Firestore Rules */}
          <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2.5 uppercase italic tracking-tighter">
                  <Lock className="text-rose-400 opacity-90" size={18} />
                  Firestore Rules
                </h3>
                <span className="bg-[#050505] text-[#D4FF00] text-[9px] px-2.5 py-1 rounded-xl border border-[#222] font-mono font-bold">
                  firestore.rules
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-5 leading-relaxed font-sans">
                Políticas de segurança do banco NoSQL para blindar leituras fraudulentas de planilhas.
              </p>

              <div className="bg-[#050505] p-4 rounded-2xl font-mono text-[10px] text-gray-300 relative overflow-x-auto border border-[#222]">
                <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function getsStatusFinanceiro() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.statusFinanceiro;
    }

    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId 
                      && request.resource.data.statusFinanceiro == resource.data.statusFinanceiro; 
    }

    match /users/{userId}/logs/{logId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId 
                            && getsStatusFinanceiro() != "Inadimplente";
    }

    match /exercises/{exerciseId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}`}</pre>
              </div>
            </div>
            
            <button
              onClick={() => copyToClipboard(`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    function isAuthenticated() {\n      return request.auth != null;\n    }\n    function getsStatusFinanceiro() {\n      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.statusFinanceiro;\n    }\n    match /users/{userId} {\n      allow read: if isAuthenticated() && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");\n      allow create: if isAuthenticated() && request.auth.uid == userId;\n      allow update: if isAuthenticated() && request.auth.uid == userId && request.resource.data.statusFinanceiro == resource.data.statusFinanceiro;\n    }\n  }\n}`)}
              className="mt-5 bg-[#050505] hover:bg-black text-[#D4FF00] border border-[#222] hover:border-[#D4FF00] px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all self-end cursor-pointer"
            >
              Copiar Rules
            </button>
          </div>

          {/* Middleware Logic React */}
          <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2.5 uppercase italic tracking-tighter">
                  <Code className="text-[#D4FF00]" size={18} />
                  Middleware React Gate
                </h3>
                <span className="bg-[#050505] text-[#D4FF00] text-[9px] px-2.5 py-1 rounded-xl border border-[#222] font-mono font-bold">
                  FinancialBarrier.tsx
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-5 leading-relaxed font-sans">
                Interceptador e interpretador de rotas em tempo real acionado antes do motor biomecânico de treinos.
              </p>

              <div className="bg-[#050505] p-4 rounded-2xl font-mono text-[10px] text-gray-305 relative overflow-x-auto border border-[#222]">
                <pre>{`import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useStudentData } from './hooks/useStudentData';
import { PaywallOverlay } from './components/Paywall';

export const TrainingGate: React.FC = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useStudentData(user?.uid);

  // REGRA DE OURO DO PROTOCOLO FINANCIAL
  if (profile?.statusFinanceiro === 'Inadimplente') {
    return (
      <PaywallOverlay 
        message={
          "Ops! Identificamos uma pendência na sua matrícula. " +
          "Compareça à recepção para liberar seu acesso."
        }
        receptionContact="recepcao@academiaforte.com"
      />
    );
  }

  return <>{children}</>;
};`}</pre>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(`import React from 'react';\nimport { useAuth } from './hooks/useAuth';\nimport { useStudentData } from './hooks/useStudentData';\n\nexport const TrainingGate = ({ children }) => {\n  const { user } = useAuth();\n  const { profile } = useStudentData(user?.uid);\n  if (profile?.statusFinanceiro === 'Inadimplente') {\n    return <PaywallOverlay message="Ops! Identificamos uma pendência..." />;\n  }\n  return <>{children}</>;\n};`)}
              className="mt-5 bg-[#050505] hover:bg-black text-[#D4FF00] border border-[#222] hover:border-[#D4FF00] px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all self-end cursor-pointer"
            >
              Copiar Middleware
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
