import { Brain, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 mt-auto font-sans transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-xl shadow-primary/20">
                <Brain className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-xl font-black text-foreground tracking-tight">EduVantage <span className="text-primary">AI</span></span>
            </div>

            <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">

              Empowering the next generation of students with human-centric AI insights and personalized growth roadmaps.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-border shadow-sm">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-border shadow-sm">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-border shadow-sm">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

          </div>

          <div>
            <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Personalized Home</a></li>
              <li><a href="/student/dashboard" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Growth Dashboard</a></li>
              <li><a href="/student/form" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Performance Journal</a></li>
              <li><a href="/student/predict" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Predictive Insights</a></li>
            </ul>
          </div>


          <div>
            <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-8">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Student Guide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Mentorship Hub</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Privacy & Data</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm font-bold transition-colors">Global Standards</a></li>
            </ul>
          </div>


          <div>
            <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-8">Connect</h4>
            <p className="text-muted-foreground text-sm font-medium mb-8">
              Join our mission to humanize education through intelligent support.
            </p>
            <a href="mailto:hello@eduvantage.ai" className="flex items-center gap-4 p-5 bg-muted rounded-[1.5rem] border border-border hover:border-primary/20 hover:bg-card transition-all group">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-inner">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-sm font-black text-muted-foreground group-hover:text-foreground transition-colors">hello@eduvantage.ai</span>
            </a>
          </div>

        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <p className="text-muted-foreground text-xs font-bold leading-none">
              &copy; {new Date().getFullYear()} EduVantage AI. Dedicated to Student Potential.
            </p>
          </div>
          <div className="flex gap-10">
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.15em] cursor-pointer hover:text-foreground transition-colors">Human-Led. AI-Powered.</span>
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.15em] cursor-pointer hover:text-foreground transition-colors">v3.0 Premium</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
