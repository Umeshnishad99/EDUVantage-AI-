import { motion } from 'framer-motion';
import { 
  Briefcase, Target, TrendingUp, Globe, 
  Laptop, GraduationCap, Sparkles 
} from 'lucide-react';

const Services = () => {

  const services = [
    {
      title: "Predictive Academic Engine",
      desc: "Our core AI model analyzes behavioral and academic data to forecast performance with over 94% accuracy.",
      icon: <Target className="w-10 h-10 text-blue-500" />,
      features: ["Real-time GPA forecasting", "Risk level assessment", "Automatic outlier detection"]
    },
    {
      title: "Smart Course Roadmaps",
      desc: "Dynamically generated study paths that adapt based on your progress and focus areas.",
      icon: <TrendingUp className="w-10 h-10 text-emerald-500" />,
      features: ["Weak subject reinforcement", "Priority scheduling", "Milestone tracking"]
    },
    {
      title: "Career-Path Alignment",
      desc: "Institutional data mapped to real-world job requirements, ensuring you graduate career-ready.",
      icon: <Briefcase className="w-10 h-10 text-indigo-500" />,
      features: ["Skill gap analysis", "Industry demand forecasting", "LinkedIn-ready milestones"]
    },
    {
      title: "Global Collaboration",
      desc: "Connect with educational networks worldwide to benchmark performance and share best practices.",
      icon: <Globe className="w-10 h-10 text-rose-500" />,
      features: ["Cross-institutional benchmarks", "Knowledge sharing portal", "Peer-to-peer insights"]
    },
    {
      title: "Institutional Analytics",
      desc: "Comprehensive dashboards for educators to track class health and individual student success.",
      icon: <Laptop className="w-10 h-10 text-amber-500" />,
      features: ["Department-wide overviews", "Retention heatmaps", "Automated alert systems"]
    },
    {
      title: "Personalized Tutoring",
      desc: "AI-driven supplemental material suggested specifically for areas where you need the most help.",
      icon: <GraduationCap className="w-10 h-10 text-purple-500" />,
      features: ["Generated study guides", "Subject-matter deep dives", "Practice exam modules"]
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-sans selection:bg-blue-100">
      
      {/* Hero Section */}
      <section className="px-6 mb-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Empowering Academic Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-12"
          >
            Our Professional <br />
            <span className="text-blue-600">AI Services.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            EduVantage AI provides a suite of advanced tools designed to transform how 
            students learn, how teachers teach, and how institutions succeed.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-default"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">{service.desc}</p>
              
              <ul className="space-y-4 pt-8 border-t border-slate-100">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Institutional CTA */}
      <section className="mt-32 px-6">
         <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center lg:text-left">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
               <Globe className="w-full h-full text-white" />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
               <div className="flex-1">
                  <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
                     Looking to deploy at an institutional level?
                  </h2>
                  <p className="text-slate-400 text-lg font-medium mb-10 max-w-xl">
                     We offer custom API configurations and enterprise-grade security for large scale organizations.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                     <button className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all text-sm uppercase tracking-widest">
                        Talk to an Expert
                     </button>
                     <button className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-sm uppercase tracking-widest">
                        View Documentation
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Services;
