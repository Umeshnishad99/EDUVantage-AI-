import { Brain, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Brain className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">EduVantage <span className="text-blue-600">AI</span></span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Empowering the next generation of students with human-centric AI insights and personalized growth roadmaps.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 shadow-sm">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 shadow-sm">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 shadow-sm">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Personalized Home</a></li>
              <li><a href="/student/dashboard" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Growth Dashboard</a></li>
              <li><a href="/student/form" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Performance Journal</a></li>
              <li><a href="/student/predict" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Predictive Insights</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Student Guide</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Mentorship Hub</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Privacy & Data</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">Global Standards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Connect</h4>
            <p className="text-slate-500 text-sm font-medium mb-8">
              Join our mission to humanize education through intelligent support.
            </p>
            <a href="mailto:hello@eduvantage.ai" className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-sm font-black text-slate-700">hello@eduvantage.ai</span>
            </a>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <p className="text-slate-400 text-xs font-bold leading-none">
              &copy; {new Date().getFullYear()} EduVantage AI. Dedicated to Student Potential.
            </p>
          </div>
          <div className="flex gap-10">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] cursor-pointer hover:text-slate-600 transition-colors">Human-Led. AI-Powered.</span>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] cursor-pointer hover:text-slate-600 transition-colors">v3.0 Premium</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
