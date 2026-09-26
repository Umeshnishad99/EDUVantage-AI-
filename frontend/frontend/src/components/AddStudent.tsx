import { useState } from 'react';
import { UserPlus, BookOpen, Clock, CalendarDays, Loader2, BrainCircuit, CheckCircle2, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../utils/api';

const AVAILABLE_SUBJECTS = [
  "Math", "Science", "English", "History", "Physics",
  "Chemistry", "Biology", "Computer Science", "Economics", "Geography"
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  High:    { bg: 'bg-emerald-500/10',  text: 'text-emerald-500', border: 'border-emerald-500/20', label: 'High Performance' },
  Medium:  { bg: 'bg-primary/10',     text: 'text-primary',    border: 'border-primary/20',    label: 'Medium Performance' },
  Low:     { bg: 'bg-amber-500/10',    text: 'text-amber-500',   border: 'border-amber-500/20',   label: 'Needs Improvement' },
  Unknown: { bg: 'bg-muted',          text: 'text-muted-foreground', border: 'border-border',      label: 'Unknown' },
};

const AddStudent = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isPredicting, setIsPredicting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', age: '16', gender: 'Male' });
  const [academicInfo, setAcademicInfo] = useState({ term: 'Term 1', attendance: '90', studyHours: '15' });
  const [selectedSubjects, setSelectedSubjects] = useState([
    { name: 'Math', score: '' },
    { name: 'Science', score: '' },
    { name: 'English', score: '' },
    { name: 'Computer Science', score: '' },
    { name: 'Geography', score: '' },
  ]);

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentInfo(prev => ({ ...prev, [name]: value }));
  };
  const handleAcademicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAcademicInfo(prev => ({ ...prev, [name]: value }));
  };
  const handleSubjectChange = (index: number, field: 'name' | 'score', value: string) => {
    const s = [...selectedSubjects];
    s[index] = { ...s[index], [field]: value };
    setSelectedSubjects(s);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    setError('');
    try {
      const studentResponse = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          first_name: studentInfo.firstName,
          last_name: studentInfo.lastName,
          age: parseInt(studentInfo.age),
          gender: studentInfo.gender,
        }),
      });
      if (!studentResponse.ok) throw new Error('Failed to create student profile');
      const student = await studentResponse.json();

      const subjectsObj = selectedSubjects.reduce((acc, curr) => {
        acc[curr.name] = parseFloat(curr.score);
        return acc;
      }, {} as any);

      const recordResponse = await fetch(`${API_BASE_URL}/api/students/${student.id}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          term: academicInfo.term,
          subjects: subjectsObj,
          attendance_rate: parseFloat(academicInfo.attendance),
          study_hours_per_week: parseFloat(academicInfo.studyHours),
        }),
      });
      if (!recordResponse.ok) throw new Error('Failed to add academic record');
      const recordData = await recordResponse.json();
      setStudentName(studentInfo.firstName);
      setPredictionResult(recordData.prediction);
      setShowResult(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setIsPredicting(false);
    }
  };

  const chartData = selectedSubjects.map(s => ({
    name: s.name.length > 8 ? s.name.slice(0, 8) + '…' : s.name,
    score: parseFloat(s.score) || 0,
  }));

  if (showResult && predictionResult) {
    const cat = CATEGORY_STYLES[predictionResult.category] || CATEGORY_STYLES.Unknown;
    const recs: string[] = Array.isArray(predictionResult.recommendations)
      ? predictionResult.recommendations
      : JSON.parse(predictionResult.recommendations || '[]');
    const roadmap: string[] = Array.isArray(predictionResult.roadmap)
      ? predictionResult.roadmap
      : JSON.parse(predictionResult.roadmap || '[]');

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4 md:px-0">
        {/* Hero result */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-emerald-500" />
          <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-36 h-36 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-widest mb-1">10.0 Scale</span>
                <span className="font-black text-6xl text-white tracking-tighter">{predictionResult.predicted_gpa_10?.toFixed ? predictionResult.predicted_gpa_10.toFixed(1) : predictionResult.predicted_gpa_10}</span>
              </div>
              <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${cat.bg} ${cat.text} ${cat.border}`}>
                {cat.label}
              </span>
            </div>
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                Analysis Complete
              </div>
              <h3 className="text-3xl font-black text-white leading-tight">AI Insights: {studentName}</h3>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${(predictionResult.confidence_score || 0) * 100}%` }} />
              </div>
              <p className="text-[10px] text-blue-400 font-black uppercase">Model confidence: {((predictionResult.confidence_score || 0) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Subject chart */}
        <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border shadow-sm transition-colors duration-300">
          <h4 className="text-lg font-black text-foreground mb-6 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" /> Subject-wise Performance
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                itemStyle={{ fontWeight: 800 }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommendations */}
          <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border shadow-sm transition-colors duration-300">
            <h4 className="text-lg font-black text-foreground mb-5 flex items-center gap-3">
              <BrainCircuit className="w-5 h-5 text-accent" /> AI Recommendations
            </h4>
            <ul className="space-y-3">
              {recs.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Roadmap */}
          <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border shadow-sm transition-colors duration-300">
            <h4 className="text-lg font-black text-foreground mb-5 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-500" /> Career Roadmap
            </h4>
            <ol className="space-y-3">
              {roadmap.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground font-medium">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">{i + 1}</span>
                  <span className="font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/students')}
          className="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all active:scale-95 text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
        >
          Go to Student Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 md:px-0 transition-colors duration-300">
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Add New Student Profile</h2>
        <p className="text-muted-foreground font-bold mt-2 text-base md:text-lg">
          Complete demographics and academic data to generate an AI baseline.
        </p>
      </div>

      <div className="bg-card rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-primary/5 border border-border overflow-hidden transition-colors duration-300">
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 md:space-y-12">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-black text-foreground flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {[
                { label: 'First Name', name: 'firstName', placeholder: 'John', type: 'text' },
                { label: 'Last Name',  name: 'lastName',  placeholder: 'Doe',  type: 'text' },
              ].map(f => (
                <div key={f.name} className="space-y-2">
                  <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest">{f.label}</label>
                  <input type={f.type} name={f.name} required
                    value={(studentInfo as any)[f.name]} onChange={handleStudentChange}
                    className="w-full px-5 py-3.5 bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card rounded-2xl outline-none transition-all font-bold text-foreground"
                    placeholder={f.placeholder} />
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest">Age</label>
                <input type="number" name="age" required min="12" max="25"
                  value={studentInfo.age} onChange={handleStudentChange}
                  className="w-full px-5 py-3.5 bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card rounded-2xl outline-none transition-all font-bold text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground ml-1 uppercase tracking-widest">Gender</label>
                <select name="gender" required value={studentInfo.gender} onChange={handleStudentChange}
                  className="w-full px-5 py-3.5 bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card rounded-2xl outline-none transition-all font-bold text-foreground appearance-none">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Subjects */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-black text-foreground flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              Subject Marks (5 Subjects)
            </h3>
            <div className="bg-muted/30 p-4 md:p-6 rounded-[2rem] border border-border space-y-4">
              {selectedSubjects.map((subject, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-center bg-card p-3 md:p-4 rounded-2xl border border-border shadow-sm hover:border-accent transition-all">
                  <div className="flex-1 space-y-1 w-full">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] ml-1">Subject {index + 1}</label>
                    <select value={subject.name} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-accent outline-none transition-all font-black text-foreground text-sm">
                      {AVAILABLE_SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                  <div className="w-full sm:w-32 space-y-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] ml-1 text-center block">Score (0–100)</label>
                    <input type="number" required min="0" max="100"
                      value={subject.score} onChange={(e) => handleSubjectChange(index, 'score', e.target.value)}
                      className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-accent outline-none transition-all font-black text-foreground text-center text-lg"
                      placeholder="0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Effort */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-black text-foreground flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              Effort & Participation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground ml-1 flex items-center gap-2 uppercase tracking-widest">
                  <CalendarDays className="w-4 h-4 text-emerald-500" /> Attendance Rate (%)
                </label>
                <input type="number" name="attendance" required min="0" max="100"
                  value={academicInfo.attendance} onChange={handleAcademicChange}
                  className="w-full px-5 py-3.5 bg-muted/50 border-2 border-transparent focus:border-emerald-500 focus:bg-card rounded-2xl outline-none transition-all font-bold text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground ml-1 flex items-center gap-2 uppercase tracking-widest">
                  <Clock className="w-4 h-4 text-emerald-500" /> Study Hours / Week
                </label>
                <input type="number" name="studyHours" required min="0" max="120"
                  value={academicInfo.studyHours} onChange={handleAcademicChange}
                  className="w-full px-5 py-3.5 bg-muted/50 border-2 border-transparent focus:border-emerald-500 focus:bg-card rounded-2xl outline-none transition-all font-bold text-foreground" />
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" onClick={() => navigate('/dashboard/students')}
              className="order-2 sm:order-1 px-8 py-4 bg-muted text-muted-foreground font-black rounded-2xl hover:bg-muted/80 transition-all text-sm uppercase tracking-widest"
              disabled={isPredicting}>
              Back
            </button>
            <button type="submit" disabled={isPredicting}
              className="order-1 sm:order-2 flex items-center justify-center gap-3 px-10 py-4 bg-primary hover:opacity-90 text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/30 transition-all disabled:opacity-70 active:scale-95 text-sm uppercase tracking-widest">
              {isPredicting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> AI Processing…</>
              ) : (
                <><BrainCircuit className="w-6 h-6" /> Generate AI Prediction</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddStudent;
