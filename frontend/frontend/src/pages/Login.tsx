import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertCircle, ArrowRight, 
  Mail, Lock, ShieldCheck, Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUnverifiedEmail('');
    setResendStatus('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate(data.user.role === 'teacher' ? '/dashboard' : '/student/dashboard');
      } else {
        if (response.status === 401 && data.message.toLowerCase().includes('verify your email')) {
          setUnverifiedEmail(email);
        }
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendStatus('Sending...');
    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail })
      });
      const data = await resp.json();
      if (resp.ok) {
        setResendStatus('Verification email sent successfully! Please check your inbox.');
      } else {
        setResendStatus(data.message || 'Error sending verification email.');
      }
    } catch (err) {
      setResendStatus('Connection error. Is the server running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-30 grayscale"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-students-working-on-a-project-together-15582-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background z-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 w-full max-w-[440px] px-6 py-12"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-border rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-primary/10">
          
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Brain className="text-primary-foreground w-7 h-7" />
              </div>
              <span className="text-2xl font-black text-foreground tracking-tight">
                EduVantage <span className="text-primary">AI</span>
              </span>
            </Link>
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Welcome Back</h1>
            <p className="text-muted-foreground font-medium">Log in to your predictive portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode='wait'>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-xs font-bold text-red-400">{error}</p>
                  </div>
                  {unverifiedEmail && (
                    <div className="flex flex-col items-start gap-2 pt-2 border-t border-red-500/10">
                        <button 
                            type="button" 
                            onClick={handleResendVerification}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-colors"
                        >
                            Resend Verification Email
                        </button>
                        {resendStatus && <span className="text-xs text-red-300 font-medium">{resendStatus}</span>}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                    placeholder="name@institution.edu"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</Link>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/50"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-70 group"
            >
              {loading ? 'Authenticating...' : 'Sign In Now'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <div className="pt-6 border-t border-border text-center">
              <p className="text-sm font-medium text-muted-foreground">
                New to EduVantage?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
              </p>
            </div>

            <div className="flex items-center gap-3 justify-center text-muted-foreground pt-4 opacity-50">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] uppercase font-black tracking-widest">Enterprise Encrypted</span>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
