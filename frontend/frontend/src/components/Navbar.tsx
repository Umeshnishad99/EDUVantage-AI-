import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, LogOut, Settings, User, 
  HelpCircle, Brain, Home, Info, Briefcase, Globe,
  LayoutDashboard, Users, UserPlus, BrainCircuit, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: user ? (user.role === 'teacher' ? '/dashboard' : '/student/dashboard') : '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Services', path: '/services', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Careers', path: '/careers', icon: <Globe className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <Info className="w-4 h-4" /> },
  ];

  const dashboardLinks = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Students', path: '/dashboard/students', icon: <Users className="w-4 h-4" /> },
    { name: 'Add Student', path: '/dashboard/add-student', icon: <UserPlus className="w-4 h-4" /> },
    { name: 'ML Insights', path: '/dashboard/predictions', icon: <BrainCircuit className="w-4 h-4" /> },
    { name: 'Admin Panel', path: '/dashboard/admin', icon: <Shield className="w-4 h-4" /> },
  ];

  const studentLinks = [
    { name: 'My Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'AI Predict', path: '/student/predict', icon: <BrainCircuit className="w-4 h-4" /> },
    { name: 'Update Data', path: '/student/form', icon: <UserPlus className="w-4 h-4" /> },
  ];

  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isStudentRoute = location.pathname.startsWith('/student');
  const currentSubLinks = isDashboardRoute ? dashboardLinks : (isStudentRoute ? studentLinks : null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
  if (user) {
    if (user.role === 'teacher') {
      navigate('/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  } else {
    navigate('/');
  }
};

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled || currentSubLinks 
        ? 'bg-card/80 backdrop-blur-lg shadow-sm border-b border-border py-1' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Brain className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground border-b border-transparent">
              EduVantage <span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Right-aligned Desktop Nav Links (Global) */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-6 text-foreground">
            {!currentSubLinks && (
              <div className="flex items-center gap-8 mr-4 text-foreground font-bold">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    className={`text-sm font-bold flex items-center gap-2 transition-colors ${
                      location.pathname === link.path ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Dashboard Sub-Links (Inline for Desktop) */}
            {currentSubLinks && (
              <div className="flex items-center gap-4 mr-6 px-4 py-1.5 bg-muted rounded-2xl border border-border">
                {currentSubLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      location.pathname === link.path 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-card'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center gap-4 border-l border-border pl-6">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-muted transition-all border border-transparent hover:border-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-foreground leading-none mb-0.5">{user.name.split(' ')[0]}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">{user.role}</p>
                    </div>
                  </button>

                  <AnimatePresence>
                    {showProfile && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-3 w-72 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                          <div className="p-4 bg-muted border-b border-border">
                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          
                          {/* Theme Switcher Integration */}
                          <div className="border-b border-border">
                            <ThemeSwitcher />
                          </div>

                          <div className="p-2">
                            <button 
                              onClick={() => { navigate('/settings'); setShowProfile(false); }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                            >
                              <Settings className="w-4 h-4" /> Settings
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                              <HelpCircle className="w-4 h-4" /> Help Center
                            </button>
                          </div>
                          <div className="p-2 border-t border-border">
                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <LogOut className="w-4 h-4" /> Sign out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    Sign in
                  </Link>
                  <Link to="/register" className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 lg:hidden text-muted-foreground hover:text-foreground z-50"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border shadow-xl overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {/* If on dashboard, show dashboard links first in mobile */}
              {currentSubLinks ? (
                <div className="space-y-2 pb-6 border-b border-border">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4 mb-4">Management</p>
                  {currentSubLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-bold transition-all ${
                        location.pathname === link.path 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>
              ) : (
                navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-lg font-bold text-foreground px-4 py-2 hover:bg-muted rounded-2xl transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      {link.icon}
                    </div>
                    {link.name}
                  </Link>
                ))
              )}
              
              {!user && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <Link to="/login" onClick={() => setIsOpen(false)} className="px-6 py-4 bg-muted text-foreground text-center font-bold rounded-2xl">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="px-6 py-4 bg-primary text-primary-foreground text-center font-bold rounded-2xl">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
