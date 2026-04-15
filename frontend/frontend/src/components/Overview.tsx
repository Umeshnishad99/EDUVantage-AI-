import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { 
  Users, TrendingUp, AlertTriangle, Bell, ArrowRight, Loader2,
  GraduationCap, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import { motion } from 'framer-motion';

const PIE_COLORS: Record<string, string> = {
  High:    '#10b981',
  Medium:  '#3b82f6',
  Low:     '#f59e0b',
  Unknown: '#94a3b8',
};

const Overview = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/performance/stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 transition-colors duration-300">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-muted-foreground font-bold">Aggregating institutional data...</p>
    </div>
  );

  const dist = stats?.categoryDistribution || {};
  const pieData = Object.entries(dist).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-10 pb-10">
      
      {/* Human-Centric Hero Section */}
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border transition-all duration-500">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
          alt="Student Collaboration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-widest">
              Institutional Overview
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              Welcome back, <br/>
              <span className="text-primary">{user?.name.split(' ')[0] || 'Teacher'}</span>
            </h1>
            <p className="text-white/80 font-medium text-sm md:text-base">
              Empowering student potential through precision analytics and human-centric mentorship.
            </p>
          </motion.div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Students"   value={stats?.totalStudents?.toLocaleString() || '0'}  trend="Registered learners"       icon={<Users         className="w-6 h-6 text-primary"   />} gradient="from-primary/10 to-primary/5"     />
        <StatCard title="Predictive GPA"    value={`${stats?.avgGpa || '0.0'} / 10`}              trend="Institutional avg"     icon={<GraduationCap  className="w-6 h-6 text-primary"/>} gradient="from-primary/10 to-primary/5" />
        <StatCard title="Intervention Needs" value={stats?.alerts?.length.toString() || '0'}          trend="Critical alerts"     icon={<AlertTriangle  className="w-6 h-6 text-amber-500" />} gradient="from-amber-500/10 to-amber-500/5"    />
        <StatCard title="Global Rank" value="#12"         trend="Industry benchmark"              icon={<TrendingUp       className="w-6 h-6 text-emerald-500"/>} gradient="from-emerald-500/10 to-emerald-500/5"  />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
        <div className="xl:col-span-8 space-y-6 md:space-y-10">
          
          <div className="bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border transition-colors duration-300">
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Performance Statistics</h3>
              <p className="text-sm text-muted-foreground font-bold mt-1">GPA distribution across performance categories</p>
            </div>
            {pieData.length === 0 ? (
              <div className="h-48 flex items-center justify-center bg-muted/50 rounded-3xl border-2 border-dashed border-border text-muted-foreground font-bold italic text-center p-4">
                No data yet — predictions will populate this chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={pieData} barSize={60}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[12, 12, 0, 0]}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || 'hsl(var(--primary))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border transition-colors duration-300">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-black text-foreground flex items-center gap-3">
                <Bell className="w-6 h-6 text-amber-500" /> AI Risk Alerts
              </h3>
              <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {stats?.alerts?.length || 0} Critical
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats?.alerts?.length > 0 ? stats.alerts.map((alert: any, idx: number) => (
                <div key={idx} className="p-4 md:p-5 bg-muted/30 rounded-2xl border border-border flex items-start gap-4 hover:border-primary transition-all cursor-pointer">
                  <div className={`w-2 h-10 rounded-full shrink-0 ${alert.severity === 'high' ? 'bg-destructive' : 'bg-amber-500'}`} />
                  <div>
                    <p className="text-sm font-black text-foreground">{alert.name}</p>
                    <p className="text-xs font-bold text-muted-foreground mt-0.5">{alert.message}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 py-10 text-center text-muted-foreground font-bold italic">No critical alerts detected.</div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6 md:space-y-10">

          <div className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-border transition-colors duration-300">
            <h3 className="text-lg font-black text-foreground mb-6 tracking-tight">Distribution</h3>
            {pieData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground font-bold italic text-sm text-center">
                No predictions yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} stroke="none">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[entry.name] || 'hsl(var(--muted))'} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-muted/50 rounded-[2.5rem] p-8 text-foreground flex flex-col shadow-sm border border-border relative overflow-hidden">

            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Users className="w-32 h-32 text-blue-400" />
            </div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Calendar className="w-7 h-7 text-blue-400" /> Recent Activity
              </h3>
            </div>
            <div className="space-y-4 flex-1 relative z-10">
              {stats?.recentStudents?.length > 0 ? stats.recentStudents.map((student: any, idx: number) => (
                <div key={idx} className="group flex items-center justify-between bg-white/5 p-4 md:p-5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{student.name}</p>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{student.category} / GPA {student.gpa}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              )) : (
                <div className="py-10 text-center text-slate-500 font-bold italic border-t border-white/5">No recent activity.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, icon, gradient }: { title: string; value: string; trend: string; icon: React.ReactNode; gradient: string }) => (
  <div className="bg-card p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-border flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">{title}</p>
        <h4 className="text-3xl font-black text-foreground tracking-tighter">{value}</h4>
      </div>
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
    </div>
    <div className="mt-6 flex items-center gap-2">
      <div className="flex h-6 px-3 items-center bg-muted border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest">
        {trend}
      </div>
    </div>
  </div>
);

export default Overview;
