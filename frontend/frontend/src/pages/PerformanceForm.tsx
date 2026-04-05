import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit, Loader2, BookOpen, Clock, Wifi, Briefcase, Heart,
  ChevronDown, AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from "../utils/api";

const EDU_LEVELS = ["No Formal", "Primary", "Secondary", "Bachelor", "Master", "PhD"];

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5">{children}</label>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-4 py-3 bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card rounded-xl outline-none transition-all font-semibold text-foreground text-sm" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <div className="relative">
    <select {...props} className="w-full px-4 py-3 bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card rounded-xl outline-none transition-all font-semibold text-foreground text-sm appearance-none pr-10" />
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
  </div>
);
const RangeInput = ({ label, name, value, onChange, min = 1, max = 5 }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <Label>{label}</Label>
      <span className="text-xs font-black text-primary">{value} / {max}</span>
    </div>
    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
      <input type="range" name={name} min={min} max={max} value={value} onChange={onChange}
        className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer accent-primary z-10" />
      <div className="absolute top-0 left-0 h-full bg-primary/20 pointer-events-none" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
    </div>
    <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase">
      <span>Low</span><span>High</span>
    </div>
  </div>
);

const SectionHeader = ({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) => (
  <div className={`flex items-center gap-3 pb-4 border-b border-border`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <h3 className="text-lg font-black text-foreground">{title}</h3>
  </div>
);

const PerformanceForm = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    age: '17', ses_quartile: '2',
    parental_education: 'Bachelor', school_type: 'Public',
    math: '', english: '', computer: '', physics: '', chemistry: '', biology: '',
    attendance: '0.90', study_hours: '3',
    internet_access: '1', extracurricular: '0', part_time_job: '0',
    parent_support: '3', free_time: '3', go_out: '2',
  });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          age: Number(form.age), ses_quartile: Number(form.ses_quartile),
          math: Number(form.math), english: Number(form.english),
          computer: Number(form.computer), physics: Number(form.physics),
          chemistry: Number(form.chemistry), biology: Number(form.biology),
          attendance: Number(form.attendance), study_hours: Number(form.study_hours),
          internet_access: Number(form.internet_access), extracurricular: Number(form.extracurricular),
          part_time_job: Number(form.part_time_job), parent_support: Number(form.parent_support),
          free_time: Number(form.free_time), go_out: Number(form.go_out),
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Submission failed'); }
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-24 px-4 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary text-primary-foreground rounded-2xl mb-6 shadow-xl shadow-primary/20">
            <BrainCircuit className="w-5 h-5" />
            <span className="font-black text-sm uppercase tracking-widest">EduVantage Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none mb-4">Academic Performance Profile</h1>
          <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
            Our AI analyzes your data to generate a precision roadmap for your academic success.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-bold text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Help Banner */}
          <div className="p-6 bg-primary/10 rounded-3xl border border-primary/10 flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground font-medium leading-relaxed">
              Providing accurate details helps <span className="font-black text-primary">EduVantage AI</span> create a more effective roadmap for you. All data is encrypted and secure.
            </p>
          </div>

          {/* ── Section 1: Personal Info ── */}
          <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-6 transition-colors duration-300">
            <SectionHeader icon={<Clock className="w-5 h-5 text-primary" />} title="Basic Information" color="bg-primary/10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>Current Age</Label>
                <Input type="number" name="age" min="12" max="30" required value={form.age} onChange={set} />
              </div>
              <div>
                <Label>Socioeconomic Status (1–4)</Label>
                <Select name="ses_quartile" value={form.ses_quartile} onChange={set}>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>Quartile {n}</option>)}
                </Select>
              </div>
              <div>
                <Label>Parental Education</Label>
                <Select name="parental_education" value={form.parental_education} onChange={set}>
                  {EDU_LEVELS.map(e => <option key={e}>{e}</option>)}
                </Select>
              </div>
              <div>
                <Label>School Type</Label>
                <Select name="school_type" value={form.school_type} onChange={set}>
                  <option>Public</option><option>Private</option>
                </Select>
              </div>
            </div>
          </div>

          {/* ── Section 2: Subject Marks ── */}
          <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-6 transition-colors duration-300">
            <SectionHeader icon={<BookOpen className="w-5 h-5 text-accent" />} title="Academic Marks (0-100)" color="bg-accent/10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Mathematics', name: 'math' },
                { label: 'English Language', name: 'english' },
                { label: 'Computer Science', name: 'computer' },
                { label: 'Physics', name: 'physics' },
                { label: 'Chemistry', name: 'chemistry' },
                { label: 'Biology', name: 'biology' },
              ].map(sub => (
                <div key={sub.name} className="p-5 bg-muted/30 rounded-2xl border border-border group hover:bg-card hover:border-accent transition-all">
                  <Label>{sub.label}</Label>
                  <Input type="number" name={sub.name} min="0" max="100" required
                    value={(form as any)[sub.name]} onChange={set} placeholder="e.g. 85" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 3: Study Habits ── */}
          <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-6 transition-colors duration-300">
            <SectionHeader icon={<BrainCircuit className="w-5 h-5 text-emerald-500" />} title="Learning Habits" color="bg-emerald-500/10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>Attendance Rate (0.0–1.0)</Label>
                <Input type="number" name="attendance" step="0.01" min="0" max="1" required value={form.attendance} onChange={set} />
                <p className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-widest">Example: 0.95 for 95% attendance</p>
              </div>
              <div>
                <Label>Daily Study Hours</Label>
                <Input type="number" name="study_hours" step="0.5" min="0" max="16" required value={form.study_hours} onChange={set} />
              </div>
            </div>
          </div>

          {/* ── Section 4: Lifestyle & Support ── */}
          <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-8 transition-colors duration-300">
            <SectionHeader icon={<Heart className="w-5 h-5 text-rose-500" />} title="Lifestyle & Support" color="bg-rose-500/10" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Internet Access', name: 'internet_access', icon: <Wifi className="w-4 h-4" /> },
                { label: 'Extracurricular', name: 'extracurricular', icon: <Heart className="w-4 h-4" /> },
                { label: 'Part-time Job', name: 'part_time_job', icon: <Briefcase className="w-4 h-4" /> },
              ].map(item => (
                <div key={item.name}>
                  <Label>{item.label}</Label>
                  <div className="flex gap-2">
                    {['Yes', 'No'].map((opt, idx) => {
                      const val = idx === 0 ? '1' : '0';
                      const active = (form as any)[item.name] === val;
                      return (
                        <button key={opt} type="button"
                          onClick={() => setForm(p => ({ ...p, [item.name]: val }))}
                          className={`flex-1 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all ${active ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'border-border bg-muted/50 text-muted-foreground hover:border-border/80'}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-2">
              <RangeInput label="Parental Support" name="parent_support" value={form.parent_support} onChange={set} />
              <RangeInput label="Free Time Availability" name="free_time" value={form.free_time} onChange={set} />
              <RangeInput label="Socializing Frequency" name="go_out" value={form.go_out} onChange={set} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-black rounded-3xl shadow-2xl shadow-primary/30 hover:opacity-95 hover:scale-[1.01] transition-all disabled:opacity-70 active:scale-95 text-lg uppercase tracking-widest flex items-center justify-center gap-4">
            {loading
              ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing Trajectory…</>
              : <><BrainCircuit className="w-7 h-7" /> Launch AI Analysis</>
            }
          </button>

        </form>
      </div>
    </div>
  );
};

export default PerformanceForm;
