import { motion } from 'framer-motion';
import { 
  Heart, Shield, Target, Award, 
  Globe, Rocket, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
  const navigate = useNavigate();

  const values = [
    { icon: <Heart className="w-5 h-5 text-rose-500" />, title: "Student-First", desc: "Every insight we provide is designed to help students reach their full potential." },
    { icon: <Shield className="w-5 h-5 text-emerald-500" />, title: "Privacy First", desc: "We handle student data with the highest security standards and transparency." },
    { icon: <Target className="w-5 h-5 text-blue-500" />, title: "AI Accuracy", desc: "Our models are continuously trained to provide reliable academic forecasts." },
    { icon: <Award className="w-5 h-5 text-amber-500" />, title: "Academic Excellence", desc: "We bridge the gap between effort and institutional achievement." }
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      <Helmet>
        <title>About EduVantage AI | Our Mission & Vision</title>
        <meta name="description" content="Learn about the mission behind EduVantage AI. We aim to empower students and institutions through advanced predictive academic analytics." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-8">
              Our Mission
            </div>
            <h1 className="text-4xl lg:text-7xl font-black tracking-tight leading-tight mb-8">
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">future of learning.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              EduVantage AI was born from a simple vision: to ensure no student falls behind by leveraging 
              the power of machine learning to predict and improve academic outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "10K+" },
              { label: "Predictions Made", value: "500K+" },
              { label: "Partner Schools", value: "200+" },
              { label: "Success Rate", value: "94.8%" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl bg-slate-50 border border-slate-100"
              >
                <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">Core Values</h2>
            <p className="text-lg text-slate-500 font-medium">The principles that guide our innovation every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Story */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-8">
              Why we started <br />
              <span className="text-blue-600">EduVantage AI.</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-500 font-medium leading-relaxed italic">
              <p>
                "In 2024, we noticed a critical gap in education: teachers had the data, but not the time 
                to analyze it effectively. Students had the potential, but not the roadmap to achieve it."
              </p>
              <p>
                "By combining behavioral analysis with advanced machine learning, we built a tool that 
                doesn't just predict grades—it empowers interventions that change academic trajectories."
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="bg-blue-600 rounded-[3rem] p-8 lg:p-12 aspect-square relative overflow-hidden shadow-2xl shadow-blue-200">
               <div className="absolute inset-0 opacity-20">
                 <Globe className="w-full h-full text-white" />
               </div>
               <div className="relative z-10 flex flex-col justify-end h-full text-white">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-inner">
                    <Rocket className="text-white w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Global Reach, Local Impact.</h3>
                  <p className="font-bold text-blue-100">Helping schools from every corner of the world predict success.</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-8 text-white">
              Join the educational revolution.
            </h2>
            <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto">
              Ready to see how data-driven predictions can transform your students' outcomes?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-blue-900/20 text-lg uppercase tracking-widest flex items-center justify-center gap-3"
              >
                Get Started <ArrowRight className="w-6 h-6" />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-lg uppercase tracking-widest">
                Partner with us
              </button>
            </div>
        </div>
      </section>

    </div>
  );
};

export default About;
