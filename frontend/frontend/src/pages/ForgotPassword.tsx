import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, ArrowRight, Mail, Brain, CheckCircle
} from 'lucide-react';
import { API_BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await resp.json();

      if (resp.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Connection error. Is the server running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 w-full max-w-[440px] px-6 py-12"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-border rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
          
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <Brain className="text-primary-foreground w-7 h-7" />
              </div>
              <span className="text-2xl font-black text-foreground uppercase tracking-tight">EduVantage AI</span>
            </Link>
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Reset Password</h1>
            <p className="text-muted-foreground font-medium">Enter your email and we'll send you a link.</p>
          </div>

          <AnimatePresence mode='wait'>
            {status === 'success' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <p className="text-foreground font-bold">{message}</p>
                <Link to="/login" className="block text-primary font-black hover:underline uppercase text-xs tracking-widest">Back to Login</Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-xs font-bold text-red-400">{message}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold"
                      placeholder="name@institution.edu"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full py-5 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}
                  {status !== 'loading' && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="text-center pt-4">
                  <Link to="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Remembered? Sign In</Link>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
