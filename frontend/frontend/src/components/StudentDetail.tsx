import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BrainCircuit,
  Calendar, TrendingUp, Loader2,
  User, Mail, Edit, Download, Activity, Quote,
  CheckCircle2, MapPin, Trash2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  High:    { bg: 'bg-emerald-500/10',  text: 'text-emerald-500', border: 'border-emerald-500/20' },
  Medium:  { bg: 'bg-primary/10',     text: 'text-primary',    border: 'border-primary/20'    },
  Low:     { bg: 'bg-amber-500/10',    text: 'text-amber-500',   border: 'border-amber-500/20'   },
  Unknown: { bg: 'bg-muted',          text: 'text-muted-foreground', border: 'border-border'      },
};

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [student, setStudent]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setStudent(await res.json());
        else setError('Student not found');
      } catch { setError('Connection error'); }
      finally { setLoading(false); }
    };
    if (token && id) fetchStudent();
  }, [id, token]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) navigate('/dashboard/students');
      else setError('Failed to delete student');
    } finally { setDeleting(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 transition-colors duration-300">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-muted-foreground font-bold">Retrieving academic profile...</p>
    </div>
  );
  if (error || !student) return (
    <div className="p-10 text-center transition-colors duration-300">
      <p className="text-red-500 font-bold">{error || 'Student not found'}</p>
      <button onClick={() => navigate('/dashboard/students')} className="mt-4 text-primary underline">Back to Directory</button>
    </div>
  );

  const latestPrediction = student.predictions?.[0];
  const cat = CATEGORY_STYLES[latestPrediction?.category] || CATEGORY_STYLES.Unknown;

  let recs: any[] = [];
  if (latestPrediction && latestPrediction.recommendations) {
    if (Array.isArray(latestPrediction.recommendations)) {
      recs = latestPrediction.recommendations;
    } else {
      try {
        recs = JSON.parse(latestPrediction.recommendations);
        if (!Array.isArray(recs)) recs = [latestPrediction.recommendations];
      } catch (e) {
        recs = [latestPrediction.recommendations];
      }
    }
  }

  let roadmap: any[] = [];
  if (latestPrediction && latestPrediction.roadmap) {
    if (Array.isArray(latestPrediction.roadmap)) {
      roadmap = latestPrediction.roadmap;
    } else {
      try {
        roadmap = JSON.parse(latestPrediction.roadmap);
        if (!Array.isArray(roadmap)) roadmap = [latestPrediction.roadmap];
      } catch (e) {
        roadmap = [latestPrediction.roadmap];
      }
    }
  }

  // Build subject chart from latest record
  const latestRecord = student.records?.[0];
  const subjectChart = latestRecord
    ? Object.entries(latestRecord.subjects).map(([name, score]) => ({
        name: name.length > 8 ? name.slice(0, 7) + '…' : name,
        score: Number(score),
      }))
    : [];

  return (
    <div className="space-y-6 md:space-y-10 pb-10 transition-colors duration-300">

      {/* Profile Header */}
      <div className="bg-card rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-sm overflow-hidden transition-colors duration-300">
        <div className="h-24 md:h-32 bg-gradient-to-r from-primary via-accent to-emerald-500 relative">
          <button onClick={() => navigate(-1)}
            className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center gap-2 font-black transition-all px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md text-[10px] md:text-xs uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        <div className="px-6 md:px-10 pb-8 md:pb-10 -mt-10 md:-mt-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-card p-2 shadow-2xl border border-border">
                <div className="w-full h-full rounded-[1.8rem] bg-muted flex items-center justify-center">
                  <User className="text-muted-foreground w-10 h-10 md:w-14 md:h-14" />
                </div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">{student.first_name} {student.last_name}</h2>
                  <span className="hidden sm:block p-2 bg-muted rounded-xl text-muted-foreground hover:text-primary transition-all border border-border cursor-pointer">
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-5">
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" /> {student.email || '—'}
                  </div>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-primary/10">
                    Student ID #{student.id}
                  </div>
                  {latestPrediction?.category && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cat.bg} ${cat.text} ${cat.border}`}>
                      {latestPrediction.category} Performance
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={handleDelete} disabled={deleting}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black hover:bg-red-500/20 transition-all text-sm disabled:opacity-50">
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting…' : 'Delete Student'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Left: AI Hub + Subject Chart + Records */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">

          {/* AI Prediction Hub */}
          <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-800 shadow-2xl shadow-slate-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <BrainCircuit className="text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">AI Forecasting Hub</h3>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Random Forest v2.0</p>
                  </div>
                </div>
              </div>

              {latestPrediction ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Current GPA (10.0 Scale)</span>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                          {latestPrediction.gpa ? Number(latestPrediction.gpa).toFixed(1) : 'N/A'}
                        </span>
                        <TrendingUp className="text-emerald-400 w-8 h-8 mb-1" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Model Certainty</span>
                        <span className="text-blue-400">{((latestPrediction.confidence_score || 0) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${(latestPrediction.confidence_score || 0) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col justify-between">
                    <Quote className="text-blue-400 w-8 h-8 mb-4 opacity-50" />
                    <p className="text-white font-bold leading-relaxed text-sm italic">
                      Category: <span className={`font-black ${cat.text.replace('text-', 'text-')}`}>{latestPrediction.category}</span>
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Generated {new Date(latestPrediction.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center gap-5">
                  <Activity className="text-slate-600 w-8 h-8" />
                  <p className="text-slate-500 font-bold max-w-xs">No prediction data available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject Bar Chart */}
          {subjectChart.length > 0 && (
            <div className="bg-card rounded-[2rem] p-6 md:p-10 border border-border shadow-sm transition-colors duration-300">
              <h3 className="text-xl font-black text-foreground mb-6 tracking-tight">Subject-wise Marks (Latest Term)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={subjectChart} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <div className="bg-card rounded-[2rem] p-6 md:p-10 border border-border shadow-sm transition-colors duration-300">
              <h3 className="text-xl font-black text-foreground mb-6 tracking-tight flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-accent" /> AI Recommendations
              </h3>
              <ul className="space-y-3">
                {recs.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground">
                      {typeof r === 'string' ? r : r.title || r.topic || JSON.stringify(r)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Career Roadmap Timeline */}
          {roadmap.length > 0 && (
            <div className="bg-card rounded-[2rem] p-6 md:p-10 border border-border shadow-sm transition-colors duration-300">
              <h3 className="text-xl font-black text-foreground mb-6 tracking-tight flex items-center gap-3">
                <MapPin className="w-6 h-6 text-emerald-500" /> Career Roadmap
              </h3>
              <ol className="relative border-l-2 border-border space-y-6 ml-4">
                {roadmap.map((step, i) => (
                  <li key={i} className="ml-6">
                    <span className="absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-black text-xs border-2 border-card">{i + 1}</span>
                    <div className="pt-1">
                      {typeof step === 'string' ? (
                        <p className="text-sm font-medium text-foreground">{step}</p>
                      ) : (
                        <>
                          <h5 className="text-sm font-black text-foreground">{step.title || step.topic || `Phase ${i + 1}`}</h5>
                          {step.description && <p className="text-xs font-medium text-muted-foreground mt-0.5">{step.description}</p>}
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Academic Records */}
          <div className="bg-card rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-sm overflow-hidden transition-colors duration-300">
            <div className="p-6 md:p-10 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Academic Footprint</h3>
              <span className="px-4 py-1.5 bg-muted border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest transition-colors duration-300">
                {student.records?.length || 0} Terms
              </span>
            </div>
            <div className="divide-y divide-border">
              {student.records?.length > 0 ? student.records.map((record: any) => (
                <div key={record.id} className="p-6 md:p-10 hover:bg-muted/50 transition-all group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center border border-border shadow-sm">
                        <Calendar className="text-primary w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{record.term}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assessment Record</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Attendance</span>
                        <span className={`font-black ${record.attendance_rate < 75 ? 'text-red-500' : 'text-foreground'}`}>{record.attendance_rate}%</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Study Effort</span>
                        <span className="font-black text-foreground">{record.study_hours_per_week}h/w</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(record.subjects).map(([subject, score]: [string, any]) => (
                      <div key={subject} className="p-4 bg-muted/30 border border-border rounded-2xl flex flex-col items-center gap-1 shadow-sm hover:border-primary transition-all">
                        <span className="text-[10px] font-bold text-muted-foreground text-center">{subject}</span>
                        <span className={`text-lg font-black ${Number(score) >= 80 ? 'text-emerald-500' : Number(score) >= 60 ? 'text-primary' : 'text-amber-500'}`}>{score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-slate-400 font-bold italic">No performance records detected.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Persona */}
        <div className="lg:col-span-4 space-y-6 md:space-y-10">
          <div className="bg-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-border shadow-sm transition-colors duration-300">
            <h4 className="text-lg md:text-xl font-black text-foreground mb-6 flex items-center gap-3">
              <User className="text-primary w-5 h-5" /> Student Persona
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Full Name',   value: `${student.first_name} ${student.last_name}` },
                { label: 'Age Group',   value: `${student.age} Years Old` },
                { label: 'Gender',      value: student.gender },
                { label: 'System Access', value: 'Verified' },
              ].map(item => (
                <div key={item.label} className="p-4 bg-muted/50 rounded-2xl border border-border flex justify-between items-center">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                  <span className="text-sm font-bold text-foreground capitalize">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <button className="w-full py-4 bg-primary text-primary-foreground font-black rounded-xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                <Download className="w-5 h-5" /> Export Academic Dossier
              </button>
            </div>
          </div>

          {latestPrediction && (
            <div className="bg-gradient-to-br from-primary to-accent rounded-[2rem] p-6 md:p-10 text-white shadow-2xl shadow-primary/20">
              <TrendingUp className="w-10 h-10 mb-6 text-white/80" />
              <h4 className="text-xl md:text-2xl font-black mb-2 tracking-tight">GPA Trajectory</h4>
              <p className="text-primary-foreground/90 font-medium mb-8 text-sm md:text-base">
                Current category: <span className="font-black underline">{latestPrediction.category}</span>. GPA {latestPrediction.gpa ? Number(latestPrediction.gpa).toFixed(1) : ''} / 10.0
              </p>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(Number(latestPrediction.gpa || 0) / 10) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary-foreground/70">
                <span>Performance Tier</span>
                <span>{latestPrediction.category}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
