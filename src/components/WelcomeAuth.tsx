import React, { useState } from 'react';
import { StudentProfile, PaymentStatus } from '../types';
import { Dumbbell, Lock, Mail, Phone, User, Users, Calendar, ArrowRight, UserPlus, LogIn, ShieldAlert } from 'lucide-react';

interface WelcomeAuthProps {
  students: StudentProfile[];
  onRegisterStudent: (name: string, age: number, email: string, contact: string) => void;
  onLoginStudent: (id: string) => void;
  onLoginAdmin: (user: string, pass: string) => boolean;
}

export default function WelcomeAuth({
  students,
  onRegisterStudent,
  onLoginStudent,
  onLoginAdmin
}: WelcomeAuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>('login');
  
  // Registration States
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regError, setRegError] = useState('');

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin States
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regAge || !regEmail.trim() || !regContact.trim()) {
      setRegError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const ageNum = parseInt(regAge);
    if (isNaN(ageNum) || ageNum <= 0) {
      setRegError('Por favor, insira uma idade válida.');
      return;
    }

    // Check if email already exists
    const emailLower = regEmail.trim().toLowerCase();
    const emailExists = students.some(s => s.email.toLowerCase() === emailLower);
    if (emailExists) {
      setRegError('Este e-mail já está cadastrado. Vá para a aba "Fazer Login".');
      return;
    }

    onRegisterStudent(regName.trim(), ageNum, emailLower, regContact.trim());
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Por favor, insira o seu e-mail.');
      return;
    }

    const emailLower = loginEmail.trim().toLowerCase();
    const found = students.find(s => s.email.toLowerCase() === emailLower);

    if (found) {
      onLoginStudent(found.id);
    } else {
      setLoginError('Nenhum aluno encontrado com este e-mail. Verifique a grafia ou cadastre-se.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminUser.trim() || !adminPass) {
      setAdminError('Usuário e senha são obrigatórios.');
      return;
    }

    const ok = onLoginAdmin(adminUser.trim(), adminPass);
    if (!ok) {
      setAdminError('Usuário ou senha administrador incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex items-center justify-center py-10 px-4 md:px-8 relative overflow-hidden font-sans" id="forte-welcome-auth-container">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4FF00]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left column: Branding presentation */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-neutral-900 border border-[#222] px-4 py-2 rounded-2xl">
            <div className="w-8 h-8 bg-[#D4FF00] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#D4FF00]/10">
              <Dumbbell className="text-black transform -rotate-45" size={16} />
            </div>
            <span className="text-[10px] text-[#D4FF00] font-mono font-black uppercase tracking-widest leading-none">
              FORTE TREINING v2.0
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
              Sua Ficha, <br />
              Seu <span className="text-[#D4FF00]">Progresso.</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
              Gerencie seus treinos biomecânicos personalizados e monitore suas cargas e evoluções físicas. Acesse sua área restrita agora.
            </p>
          </div>

          {/* Bullet specifications */}
          <div className="hidden lg:grid grid-cols-1 gap-3 pt-4 border-t border-[#222]/60">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
              <span className="text-xs text-neutral-300 font-medium">Controle de Cargas e Séries Progressivas</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
              <span className="text-xs text-neutral-300 font-medium">Onboarding Biomédico de Frequência Dinâmica</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-neutral-300 font-medium">Paywall Integrado anti-inadimplência</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Lockbox Card Form */}
        <div className="lg:col-span-7 bg-[#121212] border border-[#222] rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-scaleUp">
          
          {/* Dynamic Light Accent depending on activeTab */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-all duration-500 ${
            activeTab === 'login' ? 'bg-[#D4FF00]/5' : activeTab === 'register' ? 'bg-[#D4FF00]/5' : 'bg-red-500/5'
          }`} />

          {/* Form Tabs Switch */}
          <div className="flex bg-[#070707] p-1.5 rounded-2xl border border-[#222] relative z-10 w-full overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => {
                setActiveTab('login');
                setRegError('');
                setAdminError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all uppercase italic tracking-tighter cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-neutral-900 text-[#D4FF00] border border-[#222] shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LogIn size={13} />
              Sou Aluno
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setLoginError('');
                setAdminError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all uppercase italic tracking-tighter cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-neutral-900 text-[#D4FF00] border border-[#222] shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserPlus size={13} />
              Novo Cadastro
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setLoginError('');
                setRegError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all uppercase italic tracking-tighter cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-neutral-900 text-[#D4FF00] border border-[#222] shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Lock size={13} />
              Acesso Admin
            </button>
          </div>

          <div className="relative z-10 space-y-4">
            
            {/* VIEW 1: STUDENT LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4" id="form-welcome-login">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#D4FF00] font-mono font-black uppercase tracking-widest block select-none">ACESSO AO PORTAL DO ATLETA</span>
                  <p className="text-[11px] text-neutral-400">Insira seu e-mail cadastrado para visualizar e iniciar seus treinos.</p>
                </div>

                {loginError && (
                  <div className="bg-red-950/20 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert size={14} className="shrink-0" />
                    {loginError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">E-mail Cadastrado</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail size={14} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="seu.nome@exemplo.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-700 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4FF00] hover:bg-white text-black py-4 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all cursor-pointer shadow-lg shadow-[#D4FF00]/10 flex items-center justify-center gap-1.5 mt-2"
                >
                  Carregar Ficha de Treino
                  <ArrowRight size={14} />
                </button>


              </form>
            )}

            {/* VIEW 2: STUDENT REGISTRATION */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4" id="form-welcome-register">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#D4FF00] font-mono font-black uppercase tracking-widest block select-none">MATRÍCULA DE NOVO MEMBRO</span>
                  <p className="text-[11px] text-neutral-400">Insira seus dados cadastrais para ingressar no sistema e iniciar o Onboarding.</p>
                </div>

                {regError && (
                  <div className="bg-red-950/20 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert size={14} className="shrink-0" />
                    {regError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">Nome Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <User size={14} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Pedro Silva"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-700 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Idade */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">Idade (Idade)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Calendar size={14} />
                      </div>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        placeholder="Ex: 27"
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-700 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">E-mail pessoal</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Mail size={14} />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="pedro@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-700 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Contato */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">Contato telefônico</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Phone size={14} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Ex: (11) 99999-9999"
                        value={regContact}
                        onChange={(e) => setRegContact(e.target.value)}
                        className="w-full bg-[#050505] border border-[#222] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-700 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4FF00] hover:bg-white text-black py-4 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all cursor-pointer shadow-lg shadow-[#D4FF00]/10 flex items-center justify-center gap-1.5 mt-2"
                >
                  Concluir Matrícula & Acessar
                  <ArrowRight size={14} />
                </button>

                <p className="text-[10px] text-neutral-500 font-medium text-center">
                  ⚠️ Ao se matricular, seu registro é sincronizado e fica visível na Recepção e no Painel Administrativo.
                </p>
              </form>
            )}

            {/* VIEW 3: ADMIN ACCESS */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4" id="form-welcome-admin">
                <div className="space-y-1">
                  <span className="text-[9px] text-red-500 font-mono font-black uppercase tracking-widest block select-none">ACESSO INTEGRADO DO ADMINISTRADOR</span>
                  <p className="text-[11px] text-neutral-400">Entre com as credenciais de segurança para ver o Painel, matricular e trocar pendências.</p>
                </div>

                {adminError && (
                  <div className="bg-red-950/20 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert size={14} className="shrink-0" />
                    {adminError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">Identificador de Admin</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <User size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Treiningfort"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-700 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest block">Senha Administrativa</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock size={14} />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-700 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4FF00] hover:bg-white text-black py-4 rounded-xl text-xs font-black uppercase italic tracking-tighter transition-all cursor-pointer shadow-lg shadow-[#D4FF00]/10 flex items-center justify-center gap-1.5 mt-2"
                >
                  Entrar no Painel Admin
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
