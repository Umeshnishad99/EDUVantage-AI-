import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit, Loader2, Sparkles, TrendingUp,
  BookOpen, Clock, Wifi, Heart, Briefcase, User, GraduationCap
} from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{children}</label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full px-4 py-3 bg-muted border-2 border-transparent focus:border-primary focus:bg-card rounded-2xl outline-none transition-all font-semibold text-foreground" />
);


const RangeInput = ({ label, name, value, onChange, max = 5 }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <Label>{label}</Label>
      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-black">{value} / {max}</span>
    </div>
    <input type="range" name={name} min="1" max={max} value={value} onChange={onChange}
      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />

  </div>
);

const PredictGPA = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ predicted_gpa: number; category: string } | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    math: 85, english: 78, computer: 92, physics: 80, chemistry: 75, biology: 82,
    attendance_rate: 90, study_hours: 4, parent_support: 4,
    free_time: 3, go_out: 2, internet_access: 1,
    extracurricular: 1, part_time_job: 0, ses_quartile: 3
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data.prediction); // ← unwrap the nested object
      } else {
        throw new Error(data.message || data.detail || 'Prediction failed');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 selection:bg-primary/20 selection:text-foreground transition-colors duration-300">

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Left Side: Form */}
          <div className="flex-1 space-y-8">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">AI GPA Forecaster</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-foreground tracking-tight leading-none">Predict Your Academic Future</h1>
              <p className="text-lg text-muted-foreground font-medium max-w-lg">Enter your marks and let the <span className="text-primary font-bold italic">EduVantage AI Precision Engine</span> analyze your trajectory with advanced behavioral analytics.</p>
            </header>


            <form onSubmit={handleSubmit} className="bg-card p-8 rounded-[2rem] border border-border shadow-2xl shadow-primary/5 space-y-10">


              {/* Subjects Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><BookOpen className="w-5 h-5" /></div>
                  <h2 className="text-xl font-black text-slate-800">Academic Marks</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {['math', 'english', 'computer', 'physics', 'chemistry', 'biology'].map(subject => (
                    <div key={subject}>
                      <Label>{subject}</Label>
                      <Input type="number" name={subject} value={(form as any)[subject]} onChange={handleChange} min="0" max="100" required />
                    </div>
                  ))}
                </div>
              </section>

              {/* Habits & Personal */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Clock className="w-5 h-5" /></div>
                  <h2 className="text-xl font-black text-slate-800">Habits & Socio-Economics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label>Attendance Rate (%)</Label>
                    <Input type="number" name="attendance_rate" value={form.attendance_rate} onChange={handleChange} min="0" max="100" required />

                    <Label>Study Hours per Day</Label>
                    <Input type="number" name="study_hours" step="0.5" value={form.study_hours} onChange={handleChange} min="0" max="24" required />

                    <div>
                      <Label>SES Quartile (1-4)</Label>
                      <select name="ses_quartile" value={form.ses_quartile} onChange={handleChange}
                        className="w-full px-4 py-3 bg-muted border-2 border-transparent focus:border-primary focus:bg-card rounded-2xl outline-none font-semibold text-foreground appearance-none">

                        <option value="1">1 (Lower)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4 (Higher)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <RangeInput label="Parent Support" name="parent_support" value={form.parent_support} onChange={handleChange} />
                    <RangeInput label="Free Time" name="free_time" value={form.free_time} onChange={handleChange} />
                    <RangeInput label="Go Out Intensity" name="go_out" value={form.go_out} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {[
                    { label: 'Internet', name: 'internet_access', icon: <Wifi className="w-4 h-4" /> },
                    { label: 'Extracurricular', name: 'extracurricular', icon: <Heart className="w-4 h-4" /> },
                    { label: 'Part-time Job', name: 'part_time_job', icon: <Briefcase className="w-4 h-4" /> }
                  ].map(item => (
                    <button key={item.name} type="button"
                      onClick={() => setForm(p => ({ ...p, [item.name]: (form as any)[item.name] === 1 ? 0 : 1 }))}
                      className={`flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${(form as any)[item.name] === 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'}`}>
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              </section>

              <button type="submit" disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:translate-y-0 active:scale-95 text-lg flex items-center justify-center gap-3">
                {loading ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing Trajectory...</> : <><Sparkles className="w-6 h-6" /> Get My Prediction</>}
              </button>
            </form>
          </div>

          {/* Right Side: Result Card */}
          <div className="w-full md:w-80 lg:w-96 sticky top-12">
            {!result && !error && (
              <div className="bg-card p-8 rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><TrendingUp className="w-8 h-8" /></div>
                <h3 className="text-lg font-black text-muted-foreground">No Prediction Yet</h3>

                <p className="text-slate-400 text-sm font-medium">Complete the form and click the button to see your predicted performance.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 space-y-3">
                <h3 className="text-red-700 font-black">Something went wrong</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-card overflow-hidden rounded-[2.5rem] border border-border shadow-2xl shadow-primary/10 transition-all">

                  <div className={`p-8 ${result.category === 'High' ? 'bg-emerald-500' : result.category === 'Medium' ? 'bg-blue-500' : 'bg-rose-500'} text-white text-center space-y-2`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-tighter">AI Prediction Verified</div>
                    <div className="text-6xl font-black tracking-tighter">{result.predicted_gpa}</div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-80 decoration-0">Predicted GPA Score</div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-1">
                      <Label>Performance Category</Label>
                      <div className={`text-2xl font-black ${result.category === 'High' ? 'text-emerald-600' : result.category === 'Medium' ? 'text-blue-600' : 'text-rose-600'}`}>
                        {result.category} Potential
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-2xl border border-border space-y-2">
                      <div className="flex items-center gap-2 text-foreground font-black text-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>AI Intelligence Note</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
...
                      </p>
                    </div>

                    <div className="pt-2">
                      <button onClick={() => window.print()} className="w-full py-4 border-2 border-border rounded-2xl text-muted-foreground font-black text-xs uppercase tracking-widest hover:bg-muted transition-all">
                        Download Report
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50/50 rounded-2xl space-y-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <div className="text-[10px] font-black text-indigo-700 uppercase">Focus Area</div>
                <div className="text-xs font-bold text-slate-700">Exam Strategy</div>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl space-y-2">
                <User className="w-5 h-5 text-emerald-600" />
                <div className="text-[10px] font-black text-emerald-700 uppercase">Career Guidance</div>
                <div className="text-xs font-bold text-slate-700">Resume Building</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PredictGPA;
