import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { Lock, User, Phone, CheckCircle, ChevronRight, ChevronLeft, BarChart2, Brain, Play, Printer, MessageCircle, AlertTriangle, ShieldCheck, Database, Trash2, Calendar, ArrowLeft, RotateCcw, Info } from 'lucide-react';
import { TRAVAS_DATA } from './constants';
import { UserData, Answers, TravaResult, Submission } from './types';

export default function App() {
  // Steps: 
  // 'intro': Tela inicial do usuário
  // 'quiz': Respondendo perguntas
  // 'submission': Tela de parabéns/conclusão
  // 'admin_login': Login administrativo
  // 'admin_dashboard': Lista de registros (Banco de Dados)
  // 'results': Visualização dos gráficos (Admin)
  const [step, setStep] = useState<'intro' | 'quiz' | 'submission' | 'admin_login' | 'admin_dashboard' | 'results'>('intro');
  
  const [userData, setUserData] = useState<UserData>({ name: '', phone: '' });
  const [answers, setAnswers] = useState<Answers>({});
  
  // Admin State
  const [adminPassword, setAdminPassword] = useState('');
  const [dbHistory, setDbHistory] = useState<Submission[]>([]);
  
  // Quiz Navigation State
  const [currentTravaIndex, setCurrentTravaIndex] = useState(0);

  // Carregar Banco de Dados local ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem('travas_db_v1');
    if (stored) {
      try {
        setDbHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Falha ao carregar histórico", e);
      }
    }
  }, []);

  const saveToHistory = (submission: Submission) => {
    const newHistory = [submission, ...dbHistory];
    setDbHistory(newHistory);
    localStorage.setItem('travas_db_v1', JSON.stringify(newHistory));
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este registro permanentemente?')) {
      const newHistory = dbHistory.filter(item => item.id !== id);
      setDbHistory(newHistory);
      localStorage.setItem('travas_db_v1', JSON.stringify(newHistory));
    }
  };

  const handleStart = () => {
    if (userData.name.trim().length > 0 && userData.phone.trim().length > 0) {
      setStep('quiz');
      window.scrollTo(0, 0);
    } else {
      alert('Por favor, preencha seu nome e telefone para iniciar.');
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextTrava = () => {
    if (currentTravaIndex < TRAVAS_DATA.length - 1) {
      setCurrentTravaIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrevTrava = () => {
    if (currentTravaIndex > 0) {
      setCurrentTravaIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinishQuiz = () => {
    const submission: Submission = { 
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      userData, 
      answers 
    };
    saveToHistory(submission);
    setStep('submission');
    window.scrollTo(0, 0);
  };

  const handleNewAnalysis = () => {
    setUserData({ name: '', phone: '' });
    setAnswers({});
    setCurrentTravaIndex(0);
    setStep('intro');
    window.scrollTo(0, 0);
  };

  const calculateResults = useMemo((): TravaResult[] => {
    return TRAVAS_DATA.map(trava => {
      let total = 0;
      trava.questions.forEach(q => {
        total += answers[q.id] || 0;
      });
      const average = total / trava.questions.length;
      return {
        travaTitle: trava.title.replace('Trava da ', '').replace('Trava ', ''),
        average: parseFloat(average.toFixed(1)),
        totalScore: total
      };
    });
  }, [answers]);

  const isCurrentPageComplete = useMemo(() => {
    const currentTrava = TRAVAS_DATA[currentTravaIndex];
    return currentTrava.questions.every(q => answers[q.id] !== undefined);
  }, [answers, currentTravaIndex]);

  const handleAdminLogin = () => {
    if (adminPassword === 'admin') { 
        setStep('admin_dashboard');
    } else {
      alert("Senha incorreta.");
    }
  };

  const notifyUserViaWhatsApp = () => {
    const message = `Olá ${userData.name}, sua análise de Travas Emocionais está pronta!`;
    const cleanPhone = userData.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const loadSubmission = (sub: Submission) => {
    setUserData(sub.userData);
    setAnswers(sub.answers);
    setStep('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 pb-10">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 print:hidden border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-blue-200 shadow-lg">
              <Brain size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Mapeamento <br className="sm:hidden"/> de Travas
              </h1>
            </div>
          </div>
          
          {step === 'quiz' && (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progresso</span>
               <div className="flex gap-1">
                    {TRAVAS_DATA.map((_, idx) => (
                       <div 
                           key={idx} 
                           className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentTravaIndex ? 'bg-blue-600 w-4' : idx < currentTravaIndex ? 'bg-blue-300' : 'bg-slate-300'}`}
                       />
                    ))}
               </div>
            </div>
          )}

          {(step === 'results' || step === 'admin_dashboard') && (
             <div className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black uppercase flex items-center gap-1.5 border border-amber-200">
               <ShieldCheck size={12} /> Painel Admin
             </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        
        {/* STEP 1: INTRO & FORM */}
        {step === 'intro' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 border border-slate-100">
              <div className="text-center mb-8">
                <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
                  Autoanálise Emocional
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Liberte seu Potencial</h2>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                  Identifique as 10 travas fundamentais que impedem seu crescimento pessoal e profissional.
                </p>
              </div>

              {/* Vídeo do YouTube - Corrigido */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video mb-8 group">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/b_dPrk4g_ok?si=-aPuVQsCpOyRcW5E" 
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 mb-8 flex gap-4 items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                  <Info size={20} />
                </div>
                <p className="text-sm text-blue-900 leading-relaxed font-medium">
                  Faça o formulário com calma e reflita cada pergunta pensando no hoje, no que está vivendo agora no seu momento presente. Ao terminar, suas informações serão processadas pelo sistema.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Seu Nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder="Ex: João Silva"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Seu WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        placeholder="(00) 00000-0000"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
                >
                  <span className="uppercase tracking-widest text-sm">Iniciar Mapeamento</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="text-center">
                <button 
                    onClick={() => setStep('admin_login')}
                    className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest py-2 px-4 rounded-full transition-colors"
                >
                    Acesso Administrativo
                </button>
            </div>
          </div>
        )}

        {/* STEP 2: QUIZ */}
        {step === 'quiz' && (
          <div className="space-y-8 animate-fade-in pb-20">
            
            {/* Navegação entre Travas (Top Bar) */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                 {TRAVAS_DATA.map((t, idx) => (
                     <button 
                        key={t.id}
                        onClick={() => {
                            if(idx <= currentTravaIndex || Object.keys(answers).length > 0) setCurrentTravaIndex(idx);
                        }}
                        className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-xs font-black transition-all ${
                            idx === currentTravaIndex 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105' 
                            : idx < currentTravaIndex 
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                                : 'bg-slate-50 text-slate-400'
                        }`}
                        title={t.title}
                     >
                        {idx + 1}
                     </button>
                 ))}
                 <div className="h-6 w-px bg-slate-100 mx-2 flex-shrink-0"></div>
                 <span className="text-sm font-bold text-slate-800 whitespace-nowrap pr-4">
                    {TRAVAS_DATA[currentTravaIndex].title}
                 </span>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">{TRAVAS_DATA[currentTravaIndex].title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{TRAVAS_DATA[currentTravaIndex].description}</p>
            </div>

            <div className="space-y-4">
              {TRAVAS_DATA[currentTravaIndex].questions.map((question, qIdx) => (
                <div key={question.id} className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      Questão {qIdx + 1}/5
                    </span>
                    <h3 className="text-slate-800 font-bold leading-relaxed flex-1">{question.text}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">
                        <span>Nada (0)</span>
                        <span>Total (10)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={answers[question.id] ?? 0}
                        onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                        className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                      />
                      <div className="flex justify-between mt-2">
                        {[...Array(11)].map((_, i) => (
                          <span key={i} className={`text-[9px] font-bold ${answers[question.id] === i ? 'text-blue-600 scale-125' : 'text-slate-300'}`}>
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
                        (answers[question.id] ?? 0) >= 8 ? 'bg-red-50 text-red-600 border border-red-100' :
                        (answers[question.id] ?? 0) >= 5 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        answers[question.id] === undefined ? 'bg-slate-50 text-slate-400' : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        {answers[question.id] === undefined ? 'Não Respondido' : `Nota Atual: ${answers[question.id]}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40">
              <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                
                <button
                    onClick={handlePrevTrava}
                    disabled={currentTravaIndex === 0}
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl font-bold transition-all ${
                        currentTravaIndex === 0 
                        ? 'text-slate-200 bg-slate-50 cursor-not-allowed' 
                        : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                    }`}
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                  onClick={handleNextTrava}
                  disabled={!isCurrentPageComplete}
                  className={`flex-1 h-12 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
                    isCurrentPageComplete 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transform active:scale-[0.98]' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className="uppercase tracking-widest text-sm">
                    {currentTravaIndex === TRAVAS_DATA.length - 1 ? 'Finalizar Análise' : 'Próxima Etapa'}
                  </span>
                  {currentTravaIndex === TRAVAS_DATA.length - 1 ? <CheckCircle size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMISSION (COMPLETION SCREEN) */}
        {step === 'submission' && (
          <div className="space-y-8 animate-fade-in text-center py-12">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-8 sm:p-14 border border-slate-50">
               <div className="relative mx-auto mb-10">
                 <div className="w-32 h-32 bg-green-100 text-green-600 rounded-[35px] flex items-center justify-center mx-auto animate-bounce-slow">
                   <Brain size={64} strokeWidth={2.5} />
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg text-green-500">
                    <CheckCircle size={32} />
                 </div>
               </div>
               
               <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Parabéns, {userData.name}!</h2>
               
               <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-10 max-w-md mx-auto">
                   <p className="text-slate-600 text-lg font-medium leading-relaxed">
                     Suas respostas foram salvas com sucesso em nosso banco de dados seguro. 
                     <br/><br/>
                     <span className="text-blue-600 font-bold">Logo será enviado o resultado detalhado das suas perguntas diretamente para você.</span>
                   </p>
               </div>

               <button 
                 onClick={handleNewAnalysis}
                 className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
               >
                 <RotateCcw size={18} />
                 Iniciar Nova Análise
               </button>
            </div>
          </div>
        )}

        {/* STEP 4: ADMIN LOGIN */}
        {step === 'admin_login' && (
           <div className="space-y-8 animate-fade-in max-w-md mx-auto pt-10">
             <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
               <div className="text-center mb-8">
                 <div className="bg-slate-900 text-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                   <ShieldCheck size={40} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900">Acesso Restrito</h2>
                 <p className="text-sm text-slate-500 mt-2 font-medium">
                   Digite a senha mestra para acessar o banco de dados
                 </p>
               </div>

               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Administrador</label>
                   <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/5 outline-none font-medium transition-all"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                      />
                   </div>
                 </div>
                 <button
                    onClick={handleAdminLogin}
                    className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-sm"
                 >
                   Entrar no Painel
                 </button>
               </div>
             </div>
             
             <div className="text-center">
                <button onClick={() => setStep('intro')} className="text-slate-400 font-bold hover:text-slate-600 text-xs uppercase tracking-widest transition-colors">
                    Voltar para o Início
                </button>
             </div>
           </div>
        )}

        {/* STEP 5: ADMIN DASHBOARD (DATABASE) */}
        {step === 'admin_dashboard' && (
          <div className="space-y-8 animate-fade-in pb-10">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <Database className="text-blue-600" size={32} />
                  Banco de Dados
                </h2>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setStep('intro')}
                        className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                    >
                        Sair do Painel
                    </button>
                    <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg shadow-blue-100">
                        {dbHistory.length} REGISTROS
                    </div>
                </div>
             </div>

             {dbHistory.length === 0 ? (
               <div className="bg-white rounded-3xl p-16 text-center text-slate-400 border-2 border-dashed border-slate-200">
                 <Database className="mx-auto mb-4 opacity-20" size={64} />
                 <p className="font-bold text-lg">O banco de dados está vazio.</p>
                 <p className="text-sm mt-1">Novas análises aparecerão aqui automaticamente.</p>
               </div>
             ) : (
               <div className="grid gap-4">
                 {dbHistory.map((item) => (
                   <div key={item.id} onClick={() => loadSubmission(item)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                         <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl border border-slate-100 shadow-inner">
                           {item.userData.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <h4 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{item.userData.name}</h4>
                           <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                             <span className="flex items-center gap-1.5"><Phone size={14}/> {item.userData.phone}</span>
                             <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(item.submittedAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                           </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => deleteFromHistory(item.id, e)}
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Excluir Registro"
                        >
                          <Trash2 size={20} />
                        </button>
                        <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-300">
                           <ChevronRight size={20} />
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* STEP 6: RESULTS (ADMIN ONLY) */}
        {step === 'results' && (
          <div className="space-y-8 animate-fade-in-up pb-10">
            
            {/* Nav Back */}
            <button 
              onClick={() => setStep('admin_dashboard')}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all"
            >
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ArrowLeft size={16} />
              </div>
              Voltar ao Banco de Dados
            </button>

            <div className="bg-white rounded-[40px] shadow-2xl p-8 sm:p-12 border border-slate-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
               <div className="mb-4 uppercase tracking-[0.3em] text-[10px] font-black text-slate-300">Relatório Analítico de</div>
               <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{userData.name}</h2>
               <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-sm">
                  <span className="flex items-center gap-1.5"><Phone size={14} /> {userData.phone}</span>
                  <span className="h-4 w-px bg-slate-200"></span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date().toLocaleDateString('pt-BR')}</span>
               </div>
               
               <div className="w-full h-px bg-slate-100 my-10"></div>

               <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center justify-center gap-3">
                 <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
                    <RadarChart size={24} />
                 </div>
                 Mapa Radar de Bloqueios
               </h3>
               
               <div className="w-full h-[400px] flex items-center justify-center -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={calculateResults}>
                     <PolarGrid gridType="polygon" stroke="#e2e8f0" />
                     <PolarAngleAxis dataKey="travaTitle" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 10]} tickCount={6} tick={{ fontSize: 9, fill: '#cbd5e1' }} />
                     <Radar
                       name="Nível de Trava"
                       dataKey="average"
                       stroke="#2563EB"
                       strokeWidth={4}
                       fill="#3B82F6"
                       fillOpacity={0.4}
                     />
                     <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', fontWeight: 'bold', fontSize: '12px' }}
                     />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="bg-slate-50 p-6 rounded-3xl mt-6">
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                   Interpretação: Notas próximas ao centro (0) indicam fluidez. <br/>
                   Notas próximas à borda (10) indicam um <span className="text-red-600">bloqueio emocional crítico</span> que requer intervenção imediata.
                 </p>
               </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-xl p-8 sm:p-12 border border-slate-100">
               <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                 <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                    <BarChart2 size={24} />
                 </div>
                 Nível de Intensidade por Trava
               </h3>

               <div className="w-full h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calculateResults} layout="vertical" margin={{ left: 10, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 10]} hide />
                      <YAxis dataKey="travaTitle" type="category" width={110} tick={{ fontSize: 10, fontWeight: 800, fill: '#475569' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="average" name="Nota" radius={[0, 10, 10, 0]} barSize={24}>
                         {calculateResults.map((entry, index) => (
                           <Cell 
                             key={`cell-${index}`} 
                             fill={entry.average >= 7 ? '#ef4444' : entry.average >= 4 ? '#f59e0b' : '#10b981'} 
                           />
                         ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Alertas de Prioridade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calculateResults.filter(r => r.average >= 7).map(high => (
                <div key={high.travaTitle} className="bg-white border-2 border-red-50 p-6 rounded-3xl shadow-sm flex items-start gap-5 relative overflow-hidden group hover:border-red-100 transition-all">
                  <div className="absolute top-0 right-0 p-2">
                     <div className="bg-red-500 w-2 h-2 rounded-full animate-ping"></div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-2xl text-red-600 group-hover:scale-110 transition-transform">
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg mb-1">{high.travaTitle}</h4>
                    <div className="flex items-center gap-2 mb-3">
                       <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">Crítico: {high.average}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                      Esta trava está impedindo o fluxo de energia e resultados nesta área da vida. Necessário desbloqueio imediato.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-12 print:hidden pb-10">
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-black text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
              >
                <Printer size={18} />
                Gerar Relatório PDF
              </button>
              
              <button 
                onClick={notifyUserViaWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
              >
                <MessageCircle size={18} />
                Enviar Pelo WhatsApp
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #2563eb;
          cursor: pointer;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @media print {
          body { background: white; }
          .rounded-3xl, .rounded-[40px] { border: 1px solid #eee; box-shadow: none; }
          .bg-slate-50 { background: white; }
        }
      `}</style>
    </div>
  );
}