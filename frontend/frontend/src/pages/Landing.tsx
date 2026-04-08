import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Brain, Target, TrendingUp, 
  CheckCircle, Play, Sparkles, Rocket, Shield, 
  Globe, Laptop, GraduationCap, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EduVantage AI",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "description": "AI-driven student performance prediction and GPA forecasting tool.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Dean of Academic Affairs",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
      text: "EduVantage AI has revolutionized how we identify at-risk students. Our retention rates have improved by 22% in just one semester.",
      stat: "+22% Retention"
    },
    {
      name: "Marcus Thorne",
      role: "Senior Data Science Student",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop",
      text: "The roadmap feature is a game-changer. It told me exactly where to focus my energy, and I saw my GPA jump from 3.2 to 3.8.",
      stat: "3.8 Final GPA"
    },
    {
      name: "Prof. James Miller",
      role: "STEM Department Head",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
      text: "Data-driven education is the future. This platform provides the clarity both teachers and students have been craving for years.",
      stat: "100k+ Data Points"
    }
  ];

  const services = [
    { 
      title: "Predictive Analytics", 
      desc: "Deep-learning models that forecast academic outcomes with 94%+ accuracy.",
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      color: "blue"
    },
    { 
      title: "Smart Roadmaps", 
      desc: "Automated, personalized study plans generated uniquely for your learning style.",
      icon: <Target className="w-8 h-8 text-emerald-500" />,
      color: "emerald"
    },
    { 
      title: "Career Catalyst", 
      desc: "Align your academic path with industry demands and real-world job trends.",
      icon: <TrendingUp className="w-8 h-8 text-indigo-500" />,
      color: "indigo"
    },
    { 
      title: "Global Collaboration", 
      desc: "Connect with educators and students worldwide to share insights and benchmarks.",
      icon: <Globe className="w-8 h-8 text-rose-500" />,
      color: "rose"
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const nextTestimonial = () => setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden transition-colors duration-300">
      <Helmet>
        <title>EduVantage AI | Next-Gen Academic Performance Prediction</title>
        <meta name="description" content="Predict your academic future with EduVantage AI. Get precise GPA forecasts, personalized study roadmaps, and career insights today." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Cinematic Background Video */}
        <div className="absolute inset-0 -z-10 bg-slate-900">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-40 brightness-75 scale-110 motion-safe:animate-[slow-zoom_20s_infinite_alternate]"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-students-working-on-a-project-together-15582-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0f172a_100%)] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-300 text-xs font-black uppercase tracking-widest mb-8">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Next-Gen Academic Intelligence
              </div>

              <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                Your future, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent">Predicted.</span>
              </h1>

              <p className="text-xl text-slate-300 font-medium mb-12 max-w-xl leading-relaxed">
                Empower your educational journey with **EduVantage AI**. We turn raw academic data 
                into precise forecasts and personalized success roadmaps.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl shadow-2xl shadow-primary/40 hover:opacity-90 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg group"
                >
                  Get Started for Free <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 text-lg">
                  <Play className="w-6 h-6 fill-current" /> See Demo
                </button>
              </div>
            </motion.div>

            {/* Interactive Card Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex-1 relative hidden lg:block perspective-1000"
            >
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 overflow-hidden shadow-2xl">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                           <div className="w-3 h-3 rounded-full bg-amber-400" />
                           <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EduVantage Engine v4.0</div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                              <TrendingUp className="text-blue-400 w-6 h-6" />
                           </div>
                           <div className="flex-1">
                              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-blue-500" />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Academic Trajectory: Upward</p>
                           </div>
                           <span className="text-xl font-black text-white">88%</span>
                        </div>
                        
                         <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">GPA Forecast</p>
                              <p className="text-3xl font-black text-white">3.92</p>
                           </div>
                           <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl">
                              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Credits Earned</p>
                              <p className="text-3xl font-black text-white">124</p>
                           </div>
                         </div>

                         <div className="p-6 bg-primary rounded-2xl shadow-xl shadow-primary/40">
                           <div className="flex items-center gap-3 mb-3">
                              <GraduationCap className="text-primary-foreground w-6 h-6" />
                              <p className="text-sm font-black text-primary-foreground">Next Milestone</p>
                           </div>
                           <p className="text-xs text-primary-foreground/80 font-medium">Research Paper Submission in 12 days. Suggested focus: Methodology & Abstract.</p>
                         </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rebranded Services Section */}
      <section id="services" className="py-32 bg-muted/30 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <motion.div 
               {...fadeIn}
               className="text-center max-w-3xl mx-auto mb-20"
            >
               <h2 className="text-4xl lg:text-6xl font-black text-foreground tracking-tight mb-8 leading-none">
                  Comprehensive <br />
                  <span className="text-primary">Educational Services.</span>
               </h2>
               <p className="text-xl text-muted-foreground font-medium">
                  We don't just predict; we provide a full-spectrum ecosystem for institutional 
                  and personal academic growth.
               </p>
            </motion.div>

                {services.map((service, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     whileHover={{ y: -10 }}
                     className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                  >
                     <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                        {service.icon}
                     </div>
                     <h3 className="text-2xl font-black text-foreground mb-4">{service.title}</h3>
                     <p className="text-muted-foreground font-medium leading-relaxed">{service.desc}</p>
                  </motion.div>
                ))}
         </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-32 bg-white px-6">
         <div className="max-w-7xl mx-auto rounded-[3rem] bg-slate-900 overflow-hidden relative group">
             <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                <div className="p-12 lg:p-20 relative z-10">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">
                      Experience the Engine
                   </div>
                   <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
                      See the future <br />
                      of learning in action.
                   </h2>
                   <ul className="space-y-6 mb-12">
                      {[
                        "Real-time Behavioral Analysis",
                        "Automated Grade Projections",
                        "Institutional Benchmark Tracking"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-slate-300 font-bold">
                           <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                           </div>
                           {item}
                        </li>
                      ))}
                   </ul>
                   <button className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all text-sm uppercase tracking-widest">
                      Request Full Demo
                   </button>
                </div>
                
                <div className="relative aspect-video lg:aspect-square bg-slate-800">
                   <video 
                     autoPlay 
                     muted 
                     loop 
                     playsInline
                     className="w-full h-full object-cover opacity-60"
                   >
                     <source src="https://assets.mixkit.co/videos/preview/mixkit-student-studying-in-a-library-15581-large.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl scale-1 group-hover:scale-110 transition-transform">
                         <Play className="w-8 h-8 text-blue-600 fill-current ml-1" />
                      </button>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent hidden lg:block" />
                </div>
             </div>
         </div>
      </section>

      {/* Testimonial Slider */}
      <section id="testimonials" className="py-32 bg-slate-50 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
         
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
               <div className="max-w-2xl">
                  <h2 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6">Success Stories.</h2>
                  <p className="text-xl text-slate-500 font-medium">Hear from the educators and students who have already unlocked their academic leverage.</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={prevTestimonial} className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all"><ChevronLeft /></button>
                  <button onClick={nextTestimonial} className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all"><ChevronRight /></button>
               </div>
            </div>

            <div className="relative min-h-[400px]">
               <AnimatePresence mode="wait">
                  <motion.div 
                     key={activeTestimonial}
                     initial={{ opacity: 0, x: 100 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -100 }}
                     transition={{ duration: 0.5, ease: "circOut" }}
                     className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                     <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-300">
                        <img src={testimonials[activeTestimonial].image} alt={`Educational professional - ${testimonials[activeTestimonial].name}`} className="w-full h-full object-cover" />
                        <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl">
                           <p className="text-white text-3xl font-black">{testimonials[activeTestimonial].stat}</p>
                           <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.3em]">Verified Outcome</p>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <div className="flex gap-1 text-amber-400">
                           {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-6 h-6 fill-current" />)}
                        </div>
                        <p className="text-3xl lg:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight italic">
                           "{testimonials[activeTestimonial].text}"
                        </p>
                        <div>
                           <p className="text-2xl font-black text-slate-900">{testimonials[activeTestimonial].name}</p>
                           <p className="text-blue-600 font-black uppercase text-xs tracking-widest px-1">{testimonials[activeTestimonial].role}</p>
                        </div>
                     </div>
                  </motion.div>
               </AnimatePresence>
            </div>
         </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-32 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div {...fadeIn}>
                <h2 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-8 italic">
                   Fuel your <br />
                   <span className="text-indigo-600">future career.</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                   Academic success is just the beginning. EduVantage AI maps your course work to 
                   real-world career trends, helping you graduate not just with a degree, but with 
                   the specific leverage required by top-tier employers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                         <Laptop className="text-indigo-600 w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900">Industry Insights</h4>
                         <p className="text-sm text-slate-500">Real-time matching of your grades to tech industry role requirements.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                         <Rocket className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900">Career Launchpad</h4>
                         <p className="text-sm text-slate-500">Automated portfolio suggestions based on your top academic areas.</p>
                      </div>
                   </div>
                </div>
                <button className="flex items-center gap-3 text-lg font-black text-slate-900 group">
                   Explore Careers Path <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-indigo-600 rounded-[3rem] p-1 shadow-2xl shadow-indigo-900/20"
             >
                <div className="bg-white rounded-[2.9rem] p-10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Career Compatibility</p>
                   <div className="space-y-8">
                      {[
                        { role: "Machine Learning Engineer", match: 96, col: "indigo" },
                        { role: "Data Scientist", match: 91, col: "blue" },
                        { role: "Backend Developer", match: 84, col: "slate" }
                      ].map((item, i) => (
                        <div key={i}>
                           <div className="flex justify-between items-center mb-3">
                              <span className="font-black text-slate-900">{item.role}</span>
                              <span className={`text-${item.col}-600 font-black`}>{item.match}%</span>
                           </div>
                           <div className="h-4 w-full bg-slate-100 rounded-lg overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }} 
                                 whileInView={{ width: `${item.match}%` }} 
                                 transition={{ duration: 1.5, delay: 0.5 }}
                                 className={`h-full bg-${item.col}-500`}
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-600 italic">"Based on your 4.0 in Database Systems and 3.9 in Linear Algebra, you are a top 5% candidate for Data Engineering roles."</p>
                   </div>
                </div>
             </motion.div>
         </div>
      </section>

      {/* Global Security / Trust */}
      <section className="py-24 bg-slate-900 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
               <div className="lg:col-span-1">
                  <h3 className="text-3xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
                     <Shield className="text-blue-500 w-8 h-8" /> Secure Integrity.
                  </h3>
                  <p className="text-slate-400 font-medium">Your data is yours. Period. We use military-grade encryption and FERPA-compliant standards to protect your academic records.</p>
               </div>
               <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl flex items-center justify-center p-6 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all cursor-crosshair">
                       <Shield className="w-full h-full text-white/20" />
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Footer / Final CTA */}
      <footer className="pt-32 pb-16 bg-card border-t border-border">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-32">
               <h2 className="text-5xl lg:text-8xl font-black text-foreground tracking-tighter mb-12">Join the revolution.</h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => navigate('/register')} className="w-full sm:w-auto px-12 py-6 bg-primary text-primary-foreground font-black rounded-2xl shadow-2xl shadow-primary/30 hover:opacity-90 transition-all text-xl uppercase tracking-widest">
                     Launch your future
                  </button>
                  <button className="w-full sm:w-auto px-12 py-6 bg-foreground text-background font-black rounded-2xl hover:opacity-90 transition-all text-xl uppercase tracking-widest">
                     View Pricing
                  </button>
               </div>
            </div>

            <div className="pt-16 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
               <div className="col-span-1">
                  <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                     <Brain className="text-primary w-8 h-8" />
                     <span className="text-2xl font-black tracking-tight tracking-tighter">EduVantage AI</span>
                  </div>
                  <p className="text-muted-foreground font-medium">The world's most advanced engine for academic behavioral forecasting and personal growth.</p>
               </div>
               <div>
                  <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-xs">Product</h4>
                  <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                     <li className="hover:text-primary cursor-pointer transition-colors">Predict GPA</li>
                     <li className="hover:text-primary cursor-pointer transition-colors">Career Insights</li>
                     <li className="hover:text-primary cursor-pointer transition-colors">Security</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-xs">Company</h4>
                  <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                     <li className="hover:text-primary cursor-pointer transition-colors">About Story</li>
                     <li className="hover:text-primary cursor-pointer transition-colors">Services</li>
                     <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-xs">Compliance</h4>
                  <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                     <li className="hover:text-primary cursor-pointer transition-colors">FERPA</li>
                     <li className="hover:text-primary cursor-pointer transition-colors">GDPR</li>
                     <li className="hover:text-primary cursor-pointer transition-colors">Privacy</li>
                  </ul>
               </div>
            </div>
            
            <div className="mt-20 pt-8 border-t border-border flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
               <p>&copy; 2026 EduVantage AI. All Rights Reserved.</p>
               <div className="flex gap-4">
                  <span>In Collaboration with GDM</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
