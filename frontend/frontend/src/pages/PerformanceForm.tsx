import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  BrainCircuit, Loader2, BookOpen, Clock, Wifi, Briefcase, Heart,
  ChevronDown, AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from "../utils/api";

const EDU_LEVELS = ["No Formal", "Primary", "Secondary", "Bachelor", "Master", "PhD"];

// ── Validation Schema ──────────────────────────────────────────────────
const validationSchema = Yup.object().shape({
  age: Yup.number().required('Age is required').min(12).max(30),
  ses_quartile: Yup.number().required().min(1).max(4),
  parental_education: Yup.string().required('Required'),
  school_type: Yup.string().required('Required'),
  math: Yup.number().required('Math marks required').min(0).max(99),
  english: Yup.number().required('English marks required').min(0).max(99),
  computer: Yup.number().required('Computer marks required').min(0).max(99),
  physics: Yup.number().required('Physics marks required').min(0).max(99),
  chemistry: Yup.number().required('Chemistry marks required').min(0).max(99),
  biology: Yup.number().required('Biology marks required').min(0).max(99),
  attendance: Yup.number().required('Required').min(0).max(1),
  study_hours: Yup.number().required('Required').min(0).max(16),
  internet_access: Yup.number().required().oneOf([0, 1]),
  extracurricular: Yup.number().required().oneOf([0, 1]),
  part_time_job: Yup.number().required().oneOf([0, 1]),
  parent_support: Yup.number().required().min(1).max(5),
  free_time: Yup.number().required().min(1).max(5),
  go_out: Yup.number().required().min(1).max(5),
});

// ── Components ─────────────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-black text-muted-foreground uppercase tracking-widest mb-1.5">{children}</label>
);

const ErrorMsg = ({ name }: { name: string }) => (
  <ErrorMessage name={name}>
    {msg => <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle className="w-3 h-3" /> {msg}</p>}
  </ErrorMessage>
);

const FormInput = ({ label, name, type = "text", ...props }: any) => (
  <div className="flex flex-col">
    <Label>{label}</Label>
    <Field name={name}>
      {({ field, form }: any) => {
        // Strict Numeric Handling (Max 2 digits)
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          // Only allow numbers and max length of 2
          if (type === "number" && name !== "attendance" && name !== "study_hours" && name !== "age") {
             if (val === "" || (/^\d+$/.test(val) && val.length <= 2)) {
               form.setFieldValue(name, val);
             }
          } else {
             form.setFieldValue(name, val);
          }
        };
        return (
          <input 
            {...field} 
            {...props} 
            type={type} 
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-muted/50 border-2 rounded-xl outline-none transition-all font-semibold text-foreground text-sm ${form.errors[name] && form.touched[name] ? 'border-rose-500/50 focus:border-rose-500' : 'border-transparent focus:border-primary focus:bg-card hover:bg-muted/80'}`} 
          />
        );
      }}
    </Field>
    <ErrorMsg name={name} />
  </div>
);

const FormSelect = ({ label, name, children, ...props }: any) => (
  <div className="flex flex-col">
    <Label>{label}</Label>
    <div className="relative">
      <Field as="select" name={name} {...props} className="w-full px-4 py-3 bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card rounded-xl outline-none transition-all font-semibold text-foreground text-sm appearance-none pr-10" >
        {children}
      </Field>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
    <ErrorMsg name={name} />
  </div>
);

const RangeInput = ({ label, name, min = 1, max = 5 }: any) => (
  <Field name={name}>
    {({ field, form }: any) => (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>{label}</Label>
          <span className="text-xs font-black text-primary">{field.value} / {max}</span>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <input type="range" min={min} max={max} {...field} 
            className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer accent-primary z-10" />
          <div className="absolute top-0 left-0 h-full bg-primary/20 pointer-events-none" style={{ width: `${((field.value - min) / (max - min)) * 100}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase">
          <span>Low</span><span>High</span>
        </div>
      </div>
    )}
  </Field>
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

  const initialValues = {
    age: 18, ses_quartile: 2, parental_education: 'Bachelor', school_type: 'Public',
    math: '', english: '', computer: '', physics: '', chemistry: '', biology: '',
    attendance: 0.90, study_hours: 3, internet_access: 1, extracurricular: 0, 
    part_time_job: 0, parent_support: 3, free_time: 3, go_out: 2,
  };

  const onSubmit = async (values: any) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values),
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

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ values, setFieldValue, isValid, dirty }) => (
            <Form className="space-y-8">
              <div className="p-6 bg-primary/10 rounded-3xl border border-primary/10 flex items-start gap-4 shadow-sm">
                <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  Providing accurate details helps <span className="font-black text-primary">EduVantage AI</span> create a more effective roadmap for you. All data is encrypted and secure.
                </p>
              </div>

              {/* ── Section 1: Basic Information ── */}
              <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-6">
                <SectionHeader icon={<Clock className="w-5 h-5 text-primary" />} title="Basic Information" color="bg-primary/10" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormInput label="Current Age" name="age" type="number" />
                  <FormSelect label="Socioeconomic Status (1–4)" name="ses_quartile">
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>Quartile {n}</option>)}
                  </FormSelect>
                  <FormSelect label="Parental Education" name="parental_education">
                    {EDU_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                  </FormSelect>
                  <FormSelect label="School Type" name="school_type">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </FormSelect>
                </div>
              </div>

              {/* ── Section 2: Academic Marks ── */}
              <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-6">
                <SectionHeader icon={<BookOpen className="w-5 h-5 text-accent" />} title="Academic Marks (0-99)" color="bg-accent/10" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Mathematics', name: 'math' },
                    { label: 'English Language', name: 'english' },
                    { label: 'Computer Science', name: 'computer' },
                    { label: 'Physics', name: 'physics' },
                    { label: 'Chemistry', name: 'chemistry' },
                    { label: 'Biology', name: 'biology' },
                  ].map(sub => (
                    <div key={sub.name} className="p-5 bg-muted/30 rounded-2xl border border-border group hover:bg-card hover:border-accent transition-all relative">
                      <FormInput label={sub.label} name={sub.name} type="number" placeholder="e.g. 85" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Section 3: Learning Habits ── */}
              <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-6">
                <SectionHeader icon={<BrainCircuit className="w-5 h-5 text-emerald-500" />} title="Learning Habits" color="bg-emerald-500/10" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormInput label="Attendance Rate (0.0–1.0)" name="attendance" type="number" step="0.01" />
                  <FormInput label="Daily Study Hours" name="study_hours" type="number" step="0.5" />
                </div>
              </div>

              {/* ── Section 4: Lifestyle & Support ── */}
              <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-8">
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
                          const val = idx === 0 ? 1 : 0;
                          const active = values[item.name as keyof typeof values] === val;
                          return (
                            <button key={opt} type="button"
                              onClick={() => setFieldValue(item.name, val)}
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
                  <RangeInput label="Parental Support" name="parent_support" />
                  <RangeInput label="Free Time Availability" name="free_time" />
                  <RangeInput label="Socializing Frequency" name="go_out" />
                </div>
              </div>

              <button type="submit" disabled={loading || !isValid || !dirty}
                className="w-full py-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-black rounded-3xl shadow-2xl shadow-primary/30 hover:opacity-95 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed active:scale-95 text-lg uppercase tracking-widest flex items-center justify-center gap-4">
                {loading
                  ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing Trajectory…</>
                  : <><BrainCircuit className="w-7 h-7" /> Launch AI Analysis</>
                }
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PerformanceForm;
