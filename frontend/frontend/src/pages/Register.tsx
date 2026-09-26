import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, UserPlus, 
  Mail, Lock, User, Brain 
} from 'lucide-react';
import { API_BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 text-white">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-20 grayscale"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-student-studying-in-a-library-15581-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background z-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 w-full max-w-[480px] px-6 py-12"
      >
        <div className="bg-card/40 backdrop-blur-3xl border border-border rounded-[3rem] p-8 lg:p-10 shadow-2xl shadow-primary/10">
          
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Brain className="text-primary-foreground w-7 h-7" />
              </div>
              <span className="text-2xl font-black text-foreground tracking-tight">
                EduVantage <span className="text-primary">AI</span>
              </span>
            </Link>
            {!success ? (
              <>
                <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Join the Future</h1>
                <p className="text-muted-foreground font-medium">Empower your academic journey today.</p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Verify Your Email</h1>
                <p className="text-muted-foreground font-medium">We've sent a verification link to <span className="text-primary font-bold">{email}</span>. Please click the link to activate your account.</p>
                <div className="pt-6">
                   <Link to="/login" className="inline-flex items-center gap-2 py-4 px-8 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all">
                      Go to Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          {!success && (
            <form onSubmit={handleRegister} className="space-y-4">
              <AnimatePresence mode='wait'>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-xs font-bold text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                      placeholder="name@institution.edu"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                      placeholder="Create password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Join as</label>
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setRole('teacher')}
                        className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${role === 'teacher' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:border-primary/50'}`}
                      >
                        Teacher
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setRole('student')}
                        className={`py-3 rounded-2xl font-bold text-sm transition-all border-2 ${role === 'student' ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:border-primary/50'}`}
                      >
                        Student
                      </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4.5 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-70 group mt-4"
              >
                {loading ? 'Creating Account...' : 'Get Started Now'}
                {!loading && <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              </button>
              
              <div className="pt-6 border-t border-border text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Already member?{' '}
                  <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
