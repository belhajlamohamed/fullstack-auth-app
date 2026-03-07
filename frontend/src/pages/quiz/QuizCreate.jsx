import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  LogOut, PlusCircle, Sparkles, X, LayoutDashboard, 
  Settings, User as UserIcon, Menu, ChevronLeft, ChevronRight,
  Send, Trash2
} from 'lucide-react';

export default function QuizCreate() {
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  
  // États de l'interface
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // État du formulaire
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: [{ text: '', options: ['', '', '', ''], correct: 0 }]
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logique du formulaire
  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { text: '', options: ['', '', '', ''], correct: 0 }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes/', quizData);
      alert('Quiz publié avec succès !');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création du quiz.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Overlay mobile */}
      {isMobile && isMobileOpen && (
        <div style={styles.overlay} onClick={() => setIsMobileOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside style={{ 
        ...styles.sidebar, 
        transform: isMobile ? (isMobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        width: isCollapsed && !isMobile ? '80px' : '260px',
      }}>
        <div style={{...styles.sidebarHeader, justifyContent: (isCollapsed && !isMobile) ? 'center' : 'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
             <div style={styles.logoBox}><Sparkles size={20} color="white" /></div>
             {(!isCollapsed || isMobile) && <span style={styles.logoText}>QuizLab</span>}
          </div>
          {isMobile && <X size={20} onClick={() => setIsMobileOpen(false)} style={{cursor:'pointer'}}/>}
        </div>

        <nav style={styles.sidebarNav}>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => navigate('/dashboard')} collapsed={isCollapsed && !isMobile} />
          <NavItem icon={<UserIcon size={20}/>} label="Profil" collapsed={isCollapsed && !isMobile} />
          <NavItem icon={<Settings size={20}/>} label="Paramètres" collapsed={isCollapsed && !isMobile} />
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{...styles.logoutBtn, justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start'}}>
            <LogOut size={18} /> {(!isCollapsed || isMobile) && "Quitter"}
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <div style={{ 
        ...styles.contentArea, 
        marginLeft: isMobile ? '0' : (isCollapsed ? '80px' : '260px'),
      }}>
        <header style={styles.topbar}>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            {isMobile ? (
              <Menu size={24} onClick={() => setIsMobileOpen(true)} style={{cursor:'pointer'}}/>
            ) : (
              <button onClick={() => setIsCollapsed(!isCollapsed)} style={styles.toggleBtn}>
                {isCollapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
              </button>
            )}
            <h2 style={{fontSize: '1.2rem', fontWeight: '800', color: '#1e293b'}}>Créer un Quiz</h2>
          </div>
          
          <div style={styles.userBadge}>
            <div style={styles.avatar}>{user.username?.charAt(0).toUpperCase()}</div>
            {!isMobile && <span style={{fontWeight:'700'}}>{user.username}</span>}
          </div>
        </header>

        <main style={styles.main}>
          <form onSubmit={handleSubmit} style={{ maxWidth: '850px', margin: '0 auto' }}>
            
            {/* CONFIG GÉNÉRALE */}
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>Détails du Quiz</h3>
              <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                <input 
                  style={styles.input} 
                  placeholder="Titre (ex: Culture Générale)" 
                  value={quizData.title}
                  onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                  required
                />
                <textarea 
                  style={{...styles.input, minHeight: '80px'}} 
                  placeholder="Description du quiz..." 
                  value={quizData.description}
                  onChange={(e) => setQuizData({...quizData, description: e.target.value})}
                />
              </div>
            </section>

            {/* QUESTIONS */}
            {quizData.questions.map((q, qIndex) => (
              <section key={qIndex} style={{ ...styles.card, marginTop: '25px', position: 'relative' }}>
                <div style={styles.questionBadge}>{qIndex + 1}</div>
                
                {quizData.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} style={styles.removeBtn}>
                    <Trash2 size={18} />
                  </button>
                )}

                <textarea 
                  style={{ ...styles.input, minHeight: '60px', marginBottom: '20px' }} 
                  placeholder="Quelle est la question ?" 
                  value={q.text}
                  onChange={(e) => {
                    const newQs = [...quizData.questions];
                    newQs[qIndex].text = e.target.value;
                    setQuizData({...quizData, questions: newQs});
                  }}
                  required
                />
                
                <div style={styles.optionsGrid}>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} style={styles.optionItem}>
                      <input 
                        type="radio" 
                        name={`correct-${qIndex}`} 
                        checked={q.correct === oIndex}
                        onChange={() => {
                          const newQs = [...quizData.questions];
                          newQs[qIndex].correct = oIndex;
                          setQuizData({...quizData, questions: newQs});
                        }}
                      />
                      <input 
                        style={styles.optionInput} 
                        placeholder={`Réponse ${oIndex + 1}`} 
                        value={opt}
                        onChange={(e) => {
                          const newQs = [...quizData.questions];
                          newQs[qIndex].options[oIndex] = e.target.value;
                          setQuizData({...quizData, questions: newQs});
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* BOUTONS ACTIONS */}
            <div style={{
              ...styles.actionsContainer,
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <button 
                type="button" 
                onClick={addQuestion} 
                style={{ ...styles.secondaryBtn, padding: isMobile ? '12px' : '18px' }}
              >
                <PlusCircle size={20} />
                <span>Ajouter une question</span>
              </button>
              <button 
                type="submit" 
                style={{ ...styles.primaryBtn, padding: isMobile ? '12px' : '18px' }}
              >
                <Send size={20} />
                <span>Publier le Quiz</span>
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}

const NavItem = ({ icon, label, collapsed, onClick }) => (
  <div onClick={onClick} style={{
    ...styles.navItem, 
    justifyContent: collapsed ? 'center' : 'flex-start'
  }}>
    {icon} {!collapsed && <span>{label}</span>}
  </div>
);

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' },
  sidebar: { backgroundColor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', transition: 'all 0.3s ease', zIndex: 1000, padding: '20px' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999 },
  sidebarHeader: { display:'flex', alignItems:'center', marginBottom: '30px' },
  logoBox: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '8px', borderRadius: '10px' },
  logoText: { fontWeight: '800', fontSize: '1.2rem', marginLeft: '10px' },
  sidebarNav: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer', marginBottom: '5px', color: '#64748b' },
  sidebarFooter: { paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  logoutBtn: { display:'flex', alignItems:'center', gap:'10px', width:'100%', border:'none', background:'#fef2f2', color:'#ef4444', padding:'12px', borderRadius:'12px', cursor:'pointer', fontWeight:'700' },
  contentArea: { flex: 1, transition: 'margin-left 0.3s ease' },
  topbar: { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' },
  toggleBtn: { background:'none', border:'none', cursor:'pointer', color:'#64748b' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 'bold' },
  main: { padding: '30px 20px' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' },
  input: { width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#fcfcfd' },
  questionBadge: { position: 'absolute', top: '-12px', left: '25px', width: '28px', height: '28px', backgroundColor: '#6366f1', color: 'white', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 'bold' },
  removeBtn: { position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' },
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
  optionItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '14px' },
  optionInput: { border: 'none', outline: 'none', width: '100%', background: 'transparent' },
  actionsContainer: { display: 'flex', gap: '15px', marginTop: '30px' },
  primaryBtn: { flex: 1, backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' },
  secondaryBtn: { flex: 1, backgroundColor: 'white', color: '#6366f1', border: '2px solid #eef2ff', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
};

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios';
// import { 
//   LogOut, PlusCircle, Sparkles, X, LayoutDashboard, 
//   Settings, User as UserIcon, Menu, ChevronLeft, ChevronRight,
//   Send, Trash2, HelpCircle
// } from 'lucide-react';

// export default function QuizCreate() {
//   const navigate = useNavigate();
//   const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  
//   // États de l'interface
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

//   // État du formulaire
//   const [quizData, setQuizData] = useState({
//     title: '',
//     description: '',
//     questions: [{ text: '', options: ['', ''], correct: 0 }]
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (!mobile) setIsMobileOpen(false);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Gestion des questions
//   const addQuestion = () => {
//     setQuizData({
//       ...quizData,
//       questions: [...quizData.questions, { text: '', options: ['', ''], correct: 0 }]
//     });
//   };

//   const removeQuestion = (index) => {
//     const newQuestions = quizData.questions.filter((_, i) => i !== index);
//     setQuizData({ ...quizData, questions: newQuestions });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/quizzes/', quizData);
//       alert('Quiz publié avec succès !');
//       navigate('/dashboard');
//     } catch (err) {
//       console.error(err);
//       alert('Erreur lors de la création du quiz.');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* Overlay mobile */}
//       {isMobile && isMobileOpen && (
//         <div style={styles.overlay} onClick={() => setIsMobileOpen(false)} />
//       )}

//       {/* SIDEBAR */}
//       <aside style={{ 
//         ...styles.sidebar, 
//         transform: isMobile ? (isMobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
//         width: isCollapsed && !isMobile ? '80px' : '260px',
//       }}>
//         <div style={styles.sidebarHeader}>
//           <div style={styles.logoBox}><Sparkles size={20} color="white" /></div>
//           {(!isCollapsed || isMobile) && <span style={styles.logoText}>QuizLab</span>}
//         </div>

//         <nav style={styles.sidebarNav}>
//           <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => navigate('/dashboard')} collapsed={isCollapsed && !isMobile} />
//           <NavItem icon={<UserIcon size={20}/>} label="Mon Profil" collapsed={isCollapsed && !isMobile} />
//           <NavItem icon={<Settings size={20}/>} label="Paramètres" collapsed={isCollapsed && !isMobile} />
//         </nav>

//         <div style={styles.sidebarFooter}>
//           <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={styles.logoutBtn}>
//             <LogOut size={18} /> {(!isCollapsed || isMobile) && "Quitter"}
//           </button>
//         </div>
//       </aside>

//       {/* ZONE DE CONTENU PRINCIPAL */}
//       <div style={{ 
//         ...styles.contentArea, 
//         marginLeft: isMobile ? '0' : (isCollapsed ? '80px' : '260px'),
//       }}>
//         <header style={styles.topbar}>
//           <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
//             {isMobile ? (
//               <Menu size={24} onClick={() => setIsMobileOpen(true)} style={{cursor:'pointer'}}/>
//             ) : (
//               <button onClick={() => setIsCollapsed(!isCollapsed)} style={styles.toggleBtn}>
//                 {isCollapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
//               </button>
//             )}
//             <h2 style={{fontSize: '1.2rem', fontWeight: '800', color: '#1e293b'}}>Créer un Quiz</h2>
//           </div>
          
//           <div style={styles.userBadge}>
//             <div style={styles.avatar}>{user.username?.charAt(0).toUpperCase()}</div>
//             {!isMobile && <span style={{fontWeight:'700'}}>{user.username}</span>}
//           </div>
//         </header>

//         <main style={styles.main}>
//           <form onSubmit={handleSubmit} style={{ maxWidth: '850px', margin: '0 auto' }}>
            
//             {/* CONFIGURATION GÉNÉRALE */}
//             <section style={styles.card}>
//               <h3 style={styles.sectionTitle}>Configuration générale</h3>
//               <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
//                 <div>
//                   <label style={styles.label}>Titre du Quiz</label>
//                   <input 
//                     style={styles.input} 
//                     placeholder="Ex: Les bases de React" 
//                     value={quizData.title}
//                     onChange={(e) => setQuizData({...quizData, title: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label style={styles.label}>Description (Optionnel)</label>
//                   <textarea 
//                     style={{...styles.input, minHeight: '80px'}} 
//                     placeholder="De quoi parle ce quiz ?" 
//                     value={quizData.description}
//                     onChange={(e) => setQuizData({...quizData, description: e.target.value})}
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* LISTE DES QUESTIONS */}
//             {quizData.questions.map((q, qIndex) => (
//               <section key={qIndex} style={{ ...styles.card, marginTop: '25px', position: 'relative' }}>
//                 <div style={styles.questionBadge}>{qIndex + 1}</div>
                
//                 {quizData.questions.length > 1 && (
//                   <button type="button" onClick={() => removeQuestion(qIndex)} style={styles.removeBtn}>
//                     <Trash2 size={18} />
//                   </button>
//                 )}

//                 <textarea 
//                   style={{ ...styles.input, minHeight: '60px', marginBottom: '20px' }} 
//                   placeholder="Votre question ici..." 
//                   value={q.text}
//                   onChange={(e) => {
//                     const newQs = [...quizData.questions];
//                     newQs[qIndex].text = e.target.value;
//                     setQuizData({...quizData, questions: newQs});
//                   }}
//                   required
//                 />
                
//                 <div style={styles.optionsGrid}>
//                   {q.options.map((opt, oIndex) => (
//                     <div key={oIndex} style={styles.optionItem}>
//                       <input 
//                         type="radio" 
//                         name={`correct-${qIndex}`} 
//                         checked={q.correct === oIndex}
//                         onChange={() => {
//                           const newQs = [...quizData.questions];
//                           newQs[qIndex].correct = oIndex;
//                           setQuizData({...quizData, questions: newQs});
//                         }}
//                       />
//                       <input 
//                         style={styles.optionInput} 
//                         placeholder={`Option ${oIndex + 1}`} 
//                         value={opt}
//                         onChange={(e) => {
//                           const newQs = [...quizData.questions];
//                           newQs[qIndex].options[oIndex] = e.target.value;
//                           setQuizData({...quizData, questions: newQs});
//                         }}
//                         required
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             ))}

//             {/* ACTIONS (Boutons améliorés) */}
//             <div style={styles.actionsContainer}>
//               <button type="button" onClick={addQuestion} style={styles.secondaryBtn}>
//                 <PlusCircle size={20} />
//                 <span>Ajouter une question</span>
//               </button>
//               <button type="submit" style={styles.primaryBtn}>
//                 <Send size={20} />
//                 <span>Publier le Quiz</span>
//               </button>
//             </div>

//           </form>
//         </main>
//       </div>
//     </div>
//   );
// }

// // Sous-composant Item Navigation
// const NavItem = ({ icon, label, collapsed, onClick }) => (
//   <div onClick={onClick} style={{
//     ...styles.navItem, 
//     justifyContent: collapsed ? 'center' : 'flex-start'
//   }}>
//     {icon} {!collapsed && <span>{label}</span>}
//   </div>
// );

// // --- STYLES ---
// const styles = {
//   container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' },
//   sidebar: { backgroundColor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', transition: 'all 0.3s ease', zIndex: 1000, padding: '20px' },
//   overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999 },
//   sidebarHeader: { display:'flex', alignItems:'center', marginBottom: '30px', gap: '10px' },
//   logoBox: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '8px', borderRadius: '10px' },
//   logoText: { fontWeight: '800', fontSize: '1.2rem', color: '#1e293b' },
//   sidebarNav: { flex: 1 },
//   navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer', marginBottom: '5px', color: '#64748b', transition: '0.2s' },
//   sidebarFooter: { paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
//   logoutBtn: { display:'flex', alignItems:'center', gap:'10px', width:'100%', border:'none', background:'#fef2f2', color:'#ef4444', padding:'12px', borderRadius:'12px', cursor:'pointer', fontWeight:'700' },
//   contentArea: { flex: 1, transition: 'margin-left 0.3s ease' },
//   topbar: { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' },
//   toggleBtn: { background:'none', border:'none', cursor:'pointer', color:'#64748b' },
//   userBadge: { display: 'flex', alignItems: 'center', gap: '10px' },
//   avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 'bold' },
//   main: { padding: '40px 20px' },
//   card: { backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
//   sectionTitle: { fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 },
//   label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' },
//   input: { width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#fcfcfd', fontSize: '0.95rem' },
//   questionBadge: { position: 'absolute', top: '-12px', left: '25px', width: '28px', height: '28px', backgroundColor: '#6366f1', color: 'white', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '0.85rem' },
//   removeBtn: { position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' },
//   optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' },
//   optionItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '14px' },
//   optionInput: { border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', background: 'transparent' },
//   actionsContainer: { display: 'flex', gap: '16px', marginTop: '40px', paddingBottom: '40px' },
//   primaryBtn: { flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' },
//   secondaryBtn: { flex: 1, backgroundColor: 'white', color: '#6366f1', border: '2px solid #eef2ff', padding: '18px', borderRadius: '18px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
// };


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios';
// import { 
//   LogOut, PlusCircle, Sparkles, X, LayoutDashboard, 
//   Settings, User as UserIcon, Menu, ChevronLeft, ChevronRight,
//   Send, HelpCircle
// } from 'lucide-react';

// export default function QuizCreate() {
//   const navigate = useNavigate();
//   const [user] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
  
//   // États pour la Sidebar (Même logique que le Dashboard)
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

//   // États du formulaire
//   const [quizData, setQuizData] = useState({
//     title: '',
//     subject: '',
//     questions: [{ text: '', options: ['', ''], correct: 0 }]
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (!mobile) setIsMobileOpen(false);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div style={styles.container}>
//       {/* OVERLAY MOBILE */}
//       {isMobile && isMobileOpen && (
//         <div style={styles.overlay} onClick={() => setIsMobileOpen(false)} />
//       )}

//       {/* SIDEBAR (Identique au Dashboard) */}
//       <aside style={{ 
//         ...styles.sidebar, 
//         transform: isMobile ? (isMobileOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
//         width: isCollapsed && !isMobile ? '80px' : '260px',
//       }}>
//         <div style={styles.sidebarHeader}>
//           <div style={styles.logoBox}><Sparkles size={20} color="white" /></div>
//           {(!isCollapsed || isMobile) && <span style={styles.logoText}>QuizLab</span>}
//         </div>

//         <nav style={styles.sidebarNav}>
//           <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => navigate('/dashboard')} collapsed={isCollapsed && !isMobile} />
//           <NavItem icon={<UserIcon size={20}/>} label="Profil" collapsed={isCollapsed && !isMobile} />
//           <NavItem icon={<Settings size={20}/>} label="Paramètres" collapsed={isCollapsed && !isMobile} />
//         </nav>

//         <div style={styles.sidebarFooter}>
//            <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={styles.logoutBtn}>
//             <LogOut size={18} /> {(!isCollapsed || isMobile) && "Quitter"}
//           </button>
//         </div>
//       </aside>

//       {/* ZONE DE CONTENU */}
//       <div style={{ 
//         ...styles.contentArea, 
//         marginLeft: isMobile ? '0' : (isCollapsed ? '80px' : '260px'),
//       }}>
//         <header style={styles.topbar}>
//           {isMobile ? <Menu size={24} onClick={() => setIsMobileOpen(true)} /> : (
//             <button onClick={() => setIsCollapsed(!isCollapsed)} style={styles.toggleBtn}>
//               {isCollapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
//             </button>
//           )}
//           <h2 style={{fontSize: '1.2rem', fontWeight: '700'}}>Créer un Quiz</h2>
//           <div style={styles.userBadge}>
//             <div style={styles.avatar}>{user.username?.charAt(0).toUpperCase()}</div>
//           </div>
//         </header>

//         <main style={styles.main}>
//           <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//             {/* CARTE CONFIGURATION */}
//             <section style={styles.card}>
//               <h3 style={styles.sectionTitle}>Configuration générale</h3>
//               <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
//                 <input style={styles.input} placeholder="Titre du Quiz (ex: Les bases de Python)" />
//                 <select style={styles.input}>
//                   <option>Sélectionner un sujet</option>
//                   <option>Mathématiques</option>
//                   <option>Informatique</option>
//                 </select>
//               </div>
//             </section>

//             {/* CARTE QUESTION (Exemple d'une question) */}
//             <section style={{ ...styles.card, marginTop: '25px', position: 'relative' }}>
//               <div style={styles.questionBadge}>1</div>
//               <textarea style={{ ...styles.input, minHeight: '80px' }} placeholder="Votre question ici..." />
              
//               <div style={styles.optionsGrid}>
//                 <div style={styles.optionItem}>
//                   <input type="radio" name="q1" checked />
//                   <input style={styles.optionInput} placeholder="Option 1" />
//                 </div>
//                 <div style={styles.optionItem}>
//                   <input type="radio" name="q1" />
//                   <input style={styles.optionInput} placeholder="Option 2" />
//                 </div>
//               </div>
//             </section>

//             {/* ACTIONS */}
//             <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
//               <button style={styles.secondaryBtn}>+ Ajouter une question</button>
//               <button style={styles.primaryBtn}><Send size={18}/> Publier le Quiz</button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// // Sous-composant pour les liens de navigation
// const NavItem = ({ icon, label, collapsed, onClick, active }) => (
//   <div onClick={onClick} style={{
//     ...styles.navItem,
//     backgroundColor: active ? '#eef2ff' : 'transparent',
//     color: active ? '#6366f1' : '#64748b',
//     justifyContent: collapsed ? 'center' : 'flex-start'
//   }}>
//     {icon} {!collapsed && <span>{label}</span>}
//   </div>
// );

// // --- STYLES REUTILISÉS DU DASHBOARD ---
// const styles = {
//   container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' },
//   sidebar: { backgroundColor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', transition: 'all 0.3s ease', zIndex: 1000, padding: '20px' },
//   overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 999 },
//   sidebarHeader: { display:'flex', alignItems:'center', marginBottom: '30px', gap: '10px' },
//   logoBox: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '8px', borderRadius: '10px' },
//   logoText: { fontWeight: '800', fontSize: '1.2rem' },
//   sidebarNav: { flex: 1 },
//   navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', cursor: 'pointer', marginBottom: '5px' },
//   sidebarFooter: { paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
//   logoutBtn: { display:'flex', alignItems:'center', gap:'10px', width:'100%', border:'none', background:'#fef2f2', color:'#ef4444', padding:'12px', borderRadius:'12px', cursor:'pointer', fontWeight:'700' },
//   contentArea: { flex: 1, transition: 'margin-left 0.3s ease' },
//   topbar: { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' },
//   toggleBtn: { background:'none', border:'none', cursor:'pointer', color:'#64748b' },
//   userBadge: { display: 'flex', alignItems: 'center', gap: '10px' },
//   avatar: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 'bold' },
//   main: { padding: '40px 20px' },
//   card: { backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
//   sectionTitle: { fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 },
//   input: { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#fcfcfd' },
//   questionBadge: { position: 'absolute', top: '-12px', left: '25px', width: '28px', height: '28px', backgroundColor: '#6366f1', color: 'white', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '0.8rem' },
//   optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' },
//   optionItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '12px' },
//   optionInput: { border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' },
//   primaryBtn: { flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
//   secondaryBtn: { flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '15px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }
// };


