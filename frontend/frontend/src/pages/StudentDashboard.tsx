import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit, TrendingUp, Sparkles,
  CheckCircle2, MapPin, Loader2, Award, AlertCircle,
  GraduationCap, Calendar, BarChart2, Heart, X, Brain, BookOpen
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../utils/api';

const CAT_STYLE: Record<string, { badge: string; dot: string; title: string }> = {
  High:    { badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500', title: 'High Performance 🏆' },
  Medium:  { badge: 'bg-primary/10    text-primary    border-primary/20',    dot: 'bg-primary',    title: 'Medium Performance 📈' },
  Low:     { badge: 'bg-amber-500/10   text-amber-500   border-amber-500/20',   dot: 'bg-amber-500',   title: 'Needs Improvement 📚' },
  Unknown: { badge: 'bg-muted         text-muted-foreground border-border',      dot: 'bg-muted-foreground', title: 'Pending' },
};

export default function StudentDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRec, setShowRec]   = useState(false);
  const [showRoad, setShowRoad] = useState(false);

  // Dynamic data from admin-controlled CGPA ranges
  const [dynRecs, setDynRecs]     = useState<any[]>([]);
  const [dynRoadmaps, setDynRoadmaps] = useState<any[]>([]);
  const [recLoading, setRecLoading]   = useState(false);
  const [roadLoading, setRoadLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/performance/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setData(await res.json());
        } else {
          navigate('/student/form');
        }
      } catch {
        navigate('/student/form');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  const fetchRecommendations = useCallback(async (cgpa: number) => {
    setRecLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cgpa/recommendation/${cgpa}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDynRecs(await res.json());
    } catch (e) { console.error(e); }
    finally { setRecLoading(false); }
  }, [token]);

  const fetchRoadmaps = useCallback(async (cgpa: number) => {
    setRoadLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cgpa/roadmap/${cgpa}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDynRoadmaps(await res.json());
    } catch (e) { console.error(e); }
    finally { setRoadLoading(false); }
  }, [token]);

  const handleShowRec = () => {
    setShowRec(true);
    const cgpa = data?.prediction?.gpa;
    if (cgpa) fetchRecommendations(cgpa);
  };

  const handleShowRoad = () => {
    setShowRoad(true);
    const cgpa = data?.prediction?.gpa;
    if (cgpa) fetchRoadmaps(cgpa);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">Loading your analysis...</p>
      </div>
    </div>
  );

  const perf = data?.performance;
  const pred = data?.prediction;
  const cat  = CAT_STYLE[pred?.category || 'Unknown'];

  const weakAreas: string[] = pred?.weak_areas
    ? (typeof pred.weak_areas === 'string' ? JSON.parse(pred.weak_areas) : pred.weak_areas)
    : [];

  const subjectData = perf ? [
    { name: 'Math', score: perf.math },
    { name: 'English', score: perf.english },
    { name: 'Computer', score: perf.computer },
    { name: 'Physics', score: perf.physics },
    { name: 'Chemistry', score: perf.chemistry },
    { name: 'Biology', score: perf.biology },
  ] : [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 transition-colors duration-300">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">

        {/* Hero */}
        <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border mb-10">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            alt="Student Learning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                Student Portal
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
                Focus on your <br/>
                <span className="text-primary-foreground">Growth</span>
              </h1>
              <p className="text-slate-200 font-medium text-sm md:text-base">
                Welcome back, {user?.name?.split(' ')[0] || 'Student'}. Your personalized academic roadmap is ready.
              </p>
            </motion.div>
          </div>
        </div>

        {pred ? (
          <div className="space-y-8">

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* GPA Card */}
              <div className="bg-primary text-primary-foreground rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl shadow-primary/20">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-widest mb-2">Predicted GPA</p>
                  <div className="text-7xl font-black tracking-tighter text-white leading-none">{pred.gpa}</div>
                  <p className="text-primary-foreground/60 font-bold text-xs mt-3 uppercase tracking-tighter">Academic Projection Score</p>
                </div>
              </div>


              {/* Score Card */}
              <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Efficiency Score</p>
                    <div className="text-5xl font-black text-primary tracking-tighter mt-1">{pred.predicted_score}</div>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full mt-6">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${pred.predicted_score}%` }} />
                </div>
              </div>

              {/* Category Card */}
              <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Current Category</p>
                    <div className="text-2xl font-black text-foreground leading-tight">{cat.title}</div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
                <span className={`self-start mt-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${cat.badge}`}>
                  {pred.category} Level
                </span>
              </div>
            </div>

            {/* Weak Areas Banner */}
            {weakAreas.length > 0 && (
              <div className="bg-card border-2 border-amber-500/20 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm shadow-amber-500/5">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Active Weakness Alerts</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {weakAreas.map((a: string) => (
                      <span key={a} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                        {a}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button id="btn-recommendations" onClick={handleShowRec}
                className="flex items-center justify-center gap-4 py-6 bg-primary text-primary-foreground font-black rounded-[2rem] shadow-2xl shadow-primary/20 hover:opacity-90 hover:-translate-y-1 transition-all active:scale-95 text-sm uppercase tracking-widest">
                <CheckCircle2 className="w-6 h-6 text-primary-foreground/80" /> Recommendations
              </button>
              <button id="btn-roadmap" onClick={handleShowRoad}
                className="flex items-center justify-center gap-4 py-6 bg-accent text-accent-foreground font-black rounded-[2rem] shadow-2xl shadow-accent/20 hover:opacity-90 hover:-translate-y-1 transition-all active:scale-95 text-sm uppercase tracking-widest">
                <MapPin className="w-6 h-6 text-accent-foreground/80" /> Career Roadmap
              </button>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm transition-colors duration-300">
                <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary" /> Academic Statistics
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={subjectData} barSize={44} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => [`${v}%`, 'Score']} cursor={{fill: 'hsl(var(--muted)/0.5)'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[12,12,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm transition-colors duration-300">
                <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
                  <BrainCircuit className="w-6 h-6 text-emerald-500" /> Skill Distribution
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={subjectData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Student" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                    <RechartsTooltip formatter={(v) => [`${v}%`, 'Score']} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Academic Attendance', icon: <Calendar className="w-5 h-5 text-primary" />, value: `${(Number(perf?.attendance||0)*100).toFixed(0)}%` },
                { label: 'Daily Study Hours',   icon: <GraduationCap className="w-5 h-5 text-accent" />, value: `${perf?.study_hours} Hours` },
                { label: 'Parental Support',    icon: <Heart className="w-5 h-5 text-rose-500" />, value: `Level ${perf?.parent_support}/5` },
                { label: 'Digital Access',      icon: <MapPin className="w-5 h-5 text-emerald-500" />, value: perf?.internet_access ? 'Connected' : 'Offline' },
              ].map(item => (
                <div key={item.label} className="bg-card rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4 group hover:bg-muted transition-all">
                  <div className="w-12 h-12 bg-card rounded-2xl shadow-inner border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg font-black text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
              <Award className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-3">No Performance Profile Detected</h2>
            <p className="text-muted-foreground font-medium mb-8 max-w-sm mx-auto text-lg leading-relaxed">
              Your personalized roadmap is waiting. Submit your performance data for instant AI analysis.
            </p>
            <button onClick={() => navigate('/student/form')}
              className="px-10 py-5 bg-primary text-primary-foreground font-black rounded-3xl shadow-2xl shadow-primary/30 hover:opacity-90 hover:-translate-y-1 transition-all active:scale-95 text-sm uppercase tracking-widest">
              Build My Profile Now
            </button>
          </div>
        )}
      </main>

      {/* ── Recommendations Modal ─────────────────────────────── */}
      {showRec && (
        <Modal title="AI Success Recommendations" icon={<CheckCircle2 className="w-6 h-6 text-white" />} color="bg-primary" onClose={() => setShowRec(false)}>
          {recLoading ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground font-bold">Fetching your personalized recommendations…</p>
            </div>
          ) : dynRecs.length > 0 ? (
            <div className="space-y-6">
              {dynRecs.map((rec: any) => (
                <div key={rec.id} className="p-6 bg-card border border-border rounded-[2rem] hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                      CGPA {rec.min_cgpa} – {rec.max_cgpa}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-foreground mb-2">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 gap-4 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-black text-foreground">No Recommendations Yet</h4>
              <p className="text-muted-foreground font-medium max-w-xs">
                Your academic advisor hasn't added recommendations for your CGPA range ({pred?.gpa}) yet. Check back soon!
              </p>
            </div>
          )}
        </Modal>
      )}

      {/* ── Roadmap Modal ─────────────────────────────────────── */}
      {showRoad && (
        <Modal title="Step-by-Step Growth Roadmap" icon={<MapPin className="w-6 h-6 text-white" />} color="bg-emerald-600" onClose={() => setShowRoad(false)}>
          {roadLoading ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-muted-foreground font-bold">Loading your personalized roadmap…</p>
            </div>
          ) : dynRoadmaps.length > 0 ? (
            <div className="space-y-8">
              {dynRoadmaps.map((roadmap: any) => (
                <div key={roadmap.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                      CGPA {roadmap.min_cgpa} – {roadmap.max_cgpa}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-foreground mb-6">{roadmap.title}</h4>
                  <div className="space-y-6">
                    {(typeof roadmap.steps === 'string' ? JSON.parse(roadmap.steps) : roadmap.steps).map((step: any, i: number, arr: any[]) => (
                      <div key={i} className="relative pl-14">
                        {i !== arr.length - 1 && (
                          <div className="absolute left-[23px] top-12 bottom-0 w-1 bg-gradient-to-b from-emerald-500/40 via-slate-100 to-transparent rounded-full" />
                        )}
                        <div className="absolute left-0 top-0 w-12 h-12 bg-primary border-4 border-primary/20 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 z-10 hover:scale-110 transition-transform">
                          <span className="text-primary-foreground font-black text-lg">{i + 1}</span>
                        </div>
                        <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm hover:bg-background/80 hover:border-primary/20 transition-all">
                          <h5 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">{step.title || step.topic}</h5>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.description}</p>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 gap-4 text-center">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-black text-foreground">No Roadmap Yet</h4>
              <p className="text-muted-foreground font-medium max-w-xs">
                Your academic advisor hasn't created a roadmap for your CGPA range ({pred?.gpa}) yet. Check back soon!
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, icon, color, onClose, children }: any) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="bg-card w-full max-w-xl rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden max-h-[90vh] flex flex-col scale-in-center border border-border">
        <div className={`${color} p-10 flex items-center justify-between shrink-0 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-10 opacity-10"><Brain className="w-32 h-32 text-white" /></div>
          <div className="flex items-center gap-6 relative z-10 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner">{icon}</div>
            <h3 className="text-2xl font-black tracking-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white rounded-2xl transition-all relative z-10"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-10 overflow-y-auto custom-scrollbar bg-card">{children}</div>
      </div>
    </div>
  );
}
