import { motion } from 'framer-motion';
import { 
  Briefcase, Rocket, Globe, 
  Laptop, GraduationCap, ArrowRight, Sparkles, 
  Map, UserCheck, Shield 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Careers = () => {
  const jobRoles = [
    { title: "Machine Learning Engineer", department: "Engineering", location: "Remote / San Francisco", type: "Full-Time" },
    { title: "Educational Data Scientist", department: "Data Science", location: "London / Remote", type: "Full-Time" },
    { title: "UI/UX Designer (EdTech)", department: "Design", location: "Berlin / Remote", type: "Full-Time" },
    { title: "Customer Success Lead", department: "Operations", location: "Singapore / Remote", type: "Full-Time" },
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-sans selection:bg-indigo-100">
      <Helmet>
        <title>Careers | Join the EduVantage AI Team</title>
        <meta name="description" content="Build the future of education with us. Explore open positions at EduVantage AI in Engineering, Data Science, and Design." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="px-6 mb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Rocket className="w-4 h-4" />
            Build the Future of Education
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-12"
          >
            Join <br />
            <span className="text-indigo-600">EduVantage AI.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            We are a mission-driven team of educators, data scientists, and engineers 
            dedicated to unlocking human potential through data-driven academic intelligence.
          </motion.p>
        </div>
      </section>

      {/* Values/Culture Section */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: "Mission Centric", 
              desc: "Our work directly impacts the lives of thousands of students worldwide every day.",
              icon: <GraduationCap className="w-8 h-8 text-indigo-500" />
            },
            { 
              title: "Innovation First", 
              desc: "We push the boundaries of what is possible with ML and predictive modeling in education.",
              icon: <Sparkles className="w-8 h-8 text-indigo-500" />
            },
            { 
              title: "Global Impact", 
              desc: "We are a fully decentralized team collaborating across 12+ timezones.",
              icon: <Globe className="w-8 h-8 text-indigo-500" />
            }
          ].map((val, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-left"
            >
               <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                  {val.icon}
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4">{val.title}</h3>
               <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="px-6 py-24 bg-slate-900 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col lg:flex-row items-end justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
               <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-8">
                  Open <span className="text-indigo-400">Positions.</span>
               </h2>
               <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  We are always looking for curious minds to join our mission. 
                  Don't see a fit? Feel free to reach out anyway.
               </p>
            </div>
            <button className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
               Send General Application
            </button>
          </div>

          <div className="space-y-4">
             {jobRoles.map((role, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all flex flex-col md:flex-row items-center justify-between gap-8"
                >
                   <div>
                      <h4 className="text-xl font-bold text-white mb-2">{role.title}</h4>
                      <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                         <span className="flex items-center gap-2"><Briefcase className="w-3 h-3" /> {role.department}</span>
                         <span className="flex items-center gap-2"><Map className="w-3 h-3" /> {role.location}</span>
                         <span className="flex items-center gap-2"><Laptop className="w-3 h-3" /> {role.type}</span>
                      </div>
                   </div>
                   <button className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-indigo-500 hover:text-white transition-all text-xs uppercase tracking-widest group-hover:scale-105 transition-transform flex items-center gap-2">
                       Apply Now <ArrowRight className="w-4 h-4" />
                   </button>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Career Benefits */}
      <section className="px-6 py-32 bg-white">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 order-2 lg:order-1">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="grid grid-cols-2 gap-4"
               >
                  <div className="p-8 bg-indigo-50 rounded-[3rem] text-center">
                     <p className="text-4xl font-black text-indigo-600 mb-2">4.9/5</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Glassdoor Rating</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[3rem] text-center">
                     <p className="text-4xl font-black text-slate-900 mb-2">100%</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Remote-Friendly</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[3rem] text-center col-span-2">
                     <p className="text-2xl font-black text-slate-900 mb-4 px-4">Competitive Equity & Benefits Package</p>
                     <div className="flex justify-center gap-4 text-indigo-600">
                        <Shield className="w-6 h-6" />
                        <UserCheck className="w-6 h-6" />
                        <Rocket className="w-6 h-6" />
                     </div>
                  </div>
               </motion.div>
            </div>
            
            <div className="flex-1 order-1 lg:order-2">
               <motion.div {...fadeIn}>
                  <h2 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-none">
                     Employee first. <br />
                     <span className="text-indigo-600">Impact always.</span>
                  </h2>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">
                     We believe that providing the best tools for students starts with providing 
                     the best environment for our team. We offer top-tier healthcare, unlimited 
                     learning stipends, and the freedom to work from anywhere on Earth.
                  </p>
               </motion.div>
            </div>
         </div>
      </section>
    </div>
  );
};

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
};

export default Careers;
