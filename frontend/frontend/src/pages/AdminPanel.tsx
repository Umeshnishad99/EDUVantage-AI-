import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users, TrendingUp, AlertTriangle, BarChart2,
  Trash2, Edit, Plus, X, Loader2, ChevronDown,
  CheckCircle2, AlertCircle, RefreshCw, MapPin, BookOpen,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { API_BASE_URL } from '../utils/api';

const CAT_COLORS: Record<string, string> = { High: '#10b981', Medium: '#3b82f6', Low: '#f59e0b' };

type Tab = 'overview' | 'students' | 'recommendations' | 'cgpa-recs' | 'cgpa-roadmaps';

// ─── Reusable empty row ────────────────────────────────────────────────────
const EmptyRow = ({ cols, msg }: { cols: number; msg: string }) => (
  <tr><td colSpan={cols} className="py-16 text-center text-slate-400 font-bold italic">{msg}</td></tr>
);

export default function AdminPanel() {
  const { token } = useAuth();

  /* ── existing state ─────────────────────────────────────────────── */
  const [students, setStudents]   = useState<any[]>([]);
  const [stats, setStats]         = useState<any>(null);
  const [recs, setRecs]           = useState<any[]>([]);
  const [tab, setTab]             = useState<Tab>('overview');
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('All');
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<any>(null);
  const [formData, setFormData]   = useState({ target_category: 'All', title: '', content: '' });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  /* ── CGPA Recommendation state ──────────────────────────────────── */
  const [cgpaRecs, setCgpaRecs]         = useState<any[]>([]);
  const [cgpaRecLoading, setCgpaRecLoading] = useState(false);
  const [showCgpaRecForm, setShowCgpaRecForm] = useState(false);
  const [editingCgpaRec, setEditingCgpaRec] = useState<any>(null);
  const [cgpaRecForm, setCgpaRecForm] = useState({ min_cgpa: '', max_cgpa: '', title: '', description: '' });
  const [cgpaRecSaving, setCgpaRecSaving] = useState(false);
  const [cgpaRecError, setCgpaRecError] = useState('');

  /* ── CGPA Roadmap state ─────────────────────────────────────────── */
  const [cgpaRoadmaps, setCgpaRoadmaps]     = useState<any[]>([]);
  const [cgpaRoadmapLoading, setCgpaRoadmapLoading] = useState(false);
  const [showRoadmapForm, setShowRoadmapForm] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<any>(null);
  const [roadmapForm, setRoadmapForm] = useState({
    min_cgpa: '', max_cgpa: '', title: '',
    steps: [{ title: '', description: '' }],
  });
  const [roadmapSaving, setRoadmapSaving] = useState(false);
  const [roadmapError, setRoadmapError] = useState('');

  /* ── Fetch helpers ──────────────────────────────────────────────── */
  const authHeaders = { Authorization: `Bearer ${token}` } as const;
  const jsonHeaders = { 'Content-Type': 'application/json', ...authHeaders } as const;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [studRes, statsRes, recsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/performance/all`,   { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/performance/stats`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/recommendations`,   { headers: authHeaders }),
      ]);
      if (studRes.ok)  setStudents(await studRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (recsRes.ok)  setRecs(await recsRes.json());
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchCgpaRecs = async () => {
    setCgpaRecLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cgpa/admin/recommendations`, { headers: authHeaders });
      if (res.ok) setCgpaRecs(await res.json());
    } catch(e) { console.error(e); }
    finally { setCgpaRecLoading(false); }
  };

  const fetchCgpaRoadmaps = async () => {
    setCgpaRoadmapLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/cgpa/admin/roadmaps`, { headers: authHeaders });
      if (res.ok) setCgpaRoadmaps(await res.json());
    } catch(e) { console.error(e); }
    finally { setCgpaRoadmapLoading(false); }
  };

  useEffect(() => { if (token) fetchAll(); }, [token]);
  useEffect(() => { if (token && tab === 'cgpa-recs') fetchCgpaRecs(); }, [token, tab]);
  useEffect(() => { if (token && tab === 'cgpa-roadmaps') fetchCgpaRoadmaps(); }, [token, tab]);

  /* ── Old recommendation helpers ─────────────────────────────────── */
  const filteredStudents = filter === 'All' ? students : students.filter(s => s.category === filter);
  const pieData = stats ? Object.entries(stats.categoryDistribution || {}).map(([name, value]) => ({ name, value })) : [];

  const openEdit = (rec: any) => {
    setEditing(rec);
    setFormData({ target_category: rec.target_category, title: rec.title, content: rec.content });
    setShowForm(true);
  };
  const openNew = () => { setEditing(null); setFormData({ target_category: 'All', title: '', content: '' }); setShowForm(true); };

  const saveRec = async () => {
    setSaving(true); setError('');
    try {
      const url = editing ? `${API_BASE_URL}/api/recommendations/${editing.id}` : `${API_BASE_URL}/api/recommendations`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: jsonHeaders, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed to save');
      await fetchAll(); setShowForm(false);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const deleteRec = async (id: number) => {
    if (!confirm('Delete this recommendation?')) return;
    await fetch(`${API_BASE_URL}/api/recommendations/${id}`, { method: 'DELETE', headers: authHeaders });
    fetchAll();
  };

  /* ── CGPA Recommendation helpers ────────────────────────────────── */
  const openNewCgpaRec = () => {
    setEditingCgpaRec(null);
    setCgpaRecForm({ min_cgpa: '', max_cgpa: '', title: '', description: '' });
    setCgpaRecError('');
    setShowCgpaRecForm(true);
  };
  const openEditCgpaRec = (rec: any) => {
    setEditingCgpaRec(rec);
    setCgpaRecForm({ min_cgpa: rec.min_cgpa, max_cgpa: rec.max_cgpa, title: rec.title, description: rec.description });
    setCgpaRecError('');
    setShowCgpaRecForm(true);
  };
  const saveCgpaRec = async () => {
    setCgpaRecSaving(true); setCgpaRecError('');
    try {
      const url = editingCgpaRec
        ? `${API_BASE_URL}/api/cgpa/admin/recommendation/${editingCgpaRec.id}`
        : `${API_BASE_URL}/api/cgpa/admin/recommendation`;
      const res = await fetch(url, { method: editingCgpaRec ? 'PUT' : 'POST', headers: jsonHeaders, body: JSON.stringify(cgpaRecForm) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      await fetchCgpaRecs(); setShowCgpaRecForm(false);
    } catch (e: any) { setCgpaRecError(e.message); }
    finally { setCgpaRecSaving(false); }
  };
  const deleteCgpaRec = async (id: number) => {
    if (!confirm('Delete this CGPA recommendation?')) return;
    await fetch(`${API_BASE_URL}/api/cgpa/admin/recommendation/${id}`, { method: 'DELETE', headers: authHeaders });
    fetchCgpaRecs();
  };

  /* ── Roadmap helpers ────────────────────────────────────────────── */
  const openNewRoadmap = () => {
    setEditingRoadmap(null);
    setRoadmapForm({ min_cgpa: '', max_cgpa: '', title: '', steps: [{ title: '', description: '' }] });
    setRoadmapError('');
    setShowRoadmapForm(true);
  };
  const openEditRoadmap = (rm: any) => {
    setEditingRoadmap(rm);
    const steps = typeof rm.steps === 'string' ? JSON.parse(rm.steps) : rm.steps;
    setRoadmapForm({ min_cgpa: rm.min_cgpa, max_cgpa: rm.max_cgpa, title: rm.title, steps: steps.length > 0 ? steps : [{ title: '', description: '' }] });
    setRoadmapError('');
    setShowRoadmapForm(true);
  };
  const addStep = () => setRoadmapForm(p => ({ ...p, steps: [...p.steps, { title: '', description: '' }] }));
  const removeStep = (i: number) => setRoadmapForm(p => ({ ...p, steps: p.steps.filter((_, idx) => idx !== i) }));
  const updateStep = (i: number, field: 'title' | 'description', val: string) =>
    setRoadmapForm(p => { const s = [...p.steps]; s[i] = { ...s[i], [field]: val }; return { ...p, steps: s }; });

  const saveRoadmap = async () => {
    setRoadmapSaving(true); setRoadmapError('');
    try {
      const url = editingRoadmap
        ? `${API_BASE_URL}/api/cgpa/admin/roadmap/${editingRoadmap.id}`
        : `${API_BASE_URL}/api/cgpa/admin/roadmap`;
      const res = await fetch(url, { method: editingRoadmap ? 'PUT' : 'POST', headers: jsonHeaders, body: JSON.stringify(roadmapForm) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Failed'); }
      await fetchCgpaRoadmaps(); setShowRoadmapForm(false);
    } catch (e: any) { setRoadmapError(e.message); }
    finally { setRoadmapSaving(false); }
  };
  const deleteRoadmap = async (id: number) => {
    if (!confirm('Delete this roadmap?')) return;
    await fetch(`${API_BASE_URL}/api/cgpa/admin/roadmap/${id}`, { method: 'DELETE', headers: authHeaders });
    fetchCgpaRoadmaps();
  };

  /* ── UI Helpers ─────────────────────────────────────────────────── */
  const TabBtn = ({ id, label, icon }: { id: Tab; label: string; icon: React.ReactNode }) => (
    <button onClick={() => setTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all ${tab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-500 border border-slate-100 hover:border-blue-200 hover:text-blue-600'}`}>
      {icon}{label}
    </button>
  );

  const InputField = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
    <div>
      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-semibold text-slate-800 text-sm" />
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-bold">Loading admin data...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Panel</h2>
          <p className="text-slate-500 font-medium mt-1">Manage students, recommendations, and roadmaps.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-slate-600 hover:border-blue-300 transition-all text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <TabBtn id="overview"       label="Overview"            icon={<BarChart2 className="w-4 h-4" />} />
        <TabBtn id="students"       label="Students"            icon={<Users className="w-4 h-4" />} />
        <TabBtn id="recommendations" label="Category Recs"      icon={<CheckCircle2 className="w-4 h-4" />} />
        <TabBtn id="cgpa-recs"      label="CGPA Recommendations" icon={<BookOpen className="w-4 h-4" />} />
        <TabBtn id="cgpa-roadmaps"  label="CGPA Roadmaps"       icon={<MapPin className="w-4 h-4" />} />
      </div>

      {/* ─── OVERVIEW ─────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Total Students',  value: stats?.totalStudents || 0,       icon:<Users className="w-6 h-6 text-blue-600" />,   bg:'from-blue-50 to-blue-100/50' },
              { label:'Avg GPA',          value: `${stats?.avgGpa || 0} / 10`,   icon:<TrendingUp className="w-6 h-6 text-emerald-600" />, bg:'from-emerald-50 to-emerald-100/50' },
              { label:'Alerts',           value: stats?.alerts?.length || 0,     icon:<AlertTriangle className="w-6 h-6 text-amber-600" />, bg:'from-amber-50 to-amber-100/50' },
              { label:'High Performers',  value: stats?.categoryDistribution?.High || 0, icon:<CheckCircle2 className="w-6 h-6 text-purple-600" />, bg:'from-purple-50 to-purple-100/50' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center`}>{c.icon}</div>
                </div>
                <p className="text-3xl font-black text-slate-900">{c.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4">Performance Distribution</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((e,i) => <Cell key={i} fill={CAT_COLORS[e.name]||'#94a3b8'} />)}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center py-16 text-slate-400 font-bold italic">No prediction data yet.</p>}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Risk Alerts
              </h3>
              {stats?.alerts?.length > 0 ? (
                <div className="space-y-3">
                  {stats.alerts.map((a: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className={`w-2 h-10 rounded-full shrink-0 ${a.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className="text-sm font-black text-slate-800">{a.name}</p>
                        <p className="text-xs font-medium text-slate-500">{a.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center py-10 text-slate-400 font-bold italic">No alerts.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ─── STUDENTS ─────────────────────────────────────────────── */}
      {tab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['All','High','Medium','Low'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>{['Student','GPA','Score','Category','Attendance','Study Hrs','Submitted'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length > 0 ? filteredStudents.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">{s.name?.[0]}</div>
                          <div>
                            <p className="font-black text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-black text-blue-600">{s.gpa || '—'}</td>
                      <td className="px-5 py-4 font-black text-slate-700">{s.predicted_score || '—'}</td>
                      <td className="px-5 py-4">
                        {s.category ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            s.category==='High' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            s.category==='Medium' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>{s.category}</span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-600">{s.attendance != null ? `${(s.attendance*100).toFixed(0)}%` : '—'}</td>
                      <td className="px-5 py-4 font-semibold text-slate-600">{s.study_hours != null ? `${s.study_hours}h/day` : '—'}</td>
                      <td className="px-5 py-4 text-slate-400">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  )) : <EmptyRow cols={7} msg="No students found for this filter." />}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── CATEGORY RECOMMENDATIONS (existing) ──────────────────── */}
      {tab === 'recommendations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-500 font-medium">{recs.length} custom recommendations</p>
            <button onClick={openNew}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-sm">
              <Plus className="w-4 h-4" /> Add Recommendation
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recs.length > 0 ? recs.map(rec => (
              <div key={rec.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    rec.target_category==='High' ? 'bg-emerald-50 text-emerald-700' :
                    rec.target_category==='Medium' ? 'bg-blue-50 text-blue-700' :
                    rec.target_category==='Low' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>{rec.target_category}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(rec)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteRec(rec.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h4 className="font-black text-slate-900 mb-2">{rec.title}</h4>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{rec.content}</p>
                <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-widest">By {rec.teacher_name}</p>
              </div>
            )) : (
              <div className="md:col-span-2 py-16 text-center text-slate-400 font-bold italic">
                No custom recommendations yet. Add one to guide students!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── CGPA RECOMMENDATIONS ─────────────────────────────────── */}
      {tab === 'cgpa-recs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">CGPA-Based Recommendations</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Students see recommendations matching their GPA range</p>
            </div>
            <button onClick={openNewCgpaRec}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add Recommendation
            </button>
          </div>

          {cgpaRecLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>{['CGPA Range','Title','Description','Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {cgpaRecs.length > 0 ? cgpaRecs.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-5 py-4">
                          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                            {rec.min_cgpa} – {rec.max_cgpa}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-black text-slate-800 max-w-[180px] truncate">{rec.title}</td>
                        <td className="px-5 py-4 text-slate-500 font-medium max-w-[260px] truncate">{rec.description}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEditCgpaRec(rec)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteCgpaRec(rec.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )) : <EmptyRow cols={4} msg="No CGPA recommendations yet. Add one!" />}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── CGPA ROADMAPS ────────────────────────────────────────── */}
      {tab === 'cgpa-roadmaps' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">CGPA-Based Roadmaps</h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Step-by-step guidance matched to student GPA ranges</p>
            </div>
            <button onClick={openNewRoadmap}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add Roadmap
            </button>
          </div>

          {cgpaRoadmapLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cgpaRoadmaps.length > 0 ? cgpaRoadmaps.map(rm => {
                const steps = typeof rm.steps === 'string' ? JSON.parse(rm.steps) : rm.steps;
                return (
                  <div key={rm.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-emerald-200 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                        CGPA {rm.min_cgpa} – {rm.max_cgpa}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditRoadmap(rm)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteRoadmap(rm.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h4 className="font-black text-slate-900 mb-3">{rm.title}</h4>
                    <div className="space-y-2">
                      {steps.slice(0, 3).map((s: any, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                          <p className="text-xs text-slate-600 font-medium truncate">{s.title || s.topic}</p>
                        </div>
                      ))}
                      {steps.length > 3 && (
                        <p className="text-[10px] text-slate-400 font-bold pl-7">+{steps.length - 3} more steps</p>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="md:col-span-2 py-16 text-center text-slate-400 font-bold italic">
                  No CGPA roadmaps yet. Create one to guide students!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── CATEGORY REC MODAL ───────────────────────────────────── */}
      {showForm && (
        <FormModal title={`${editing ? 'Edit' : 'New'} Recommendation`} onClose={() => setShowForm(false)} onSave={saveRec} saving={saving} error={error}>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Target Category</label>
            <div className="relative">
              <select value={formData.target_category} onChange={e => setFormData(p => ({...p, target_category: e.target.value}))}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-semibold text-slate-800 text-sm appearance-none">
                {['All','Low','Medium','High'].map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <InputField label="Title" value={formData.title} onChange={(v: string) => setFormData(p => ({...p, title: v}))} placeholder="e.g. Learn DSA this semester" />
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Content</label>
            <textarea rows={4} value={formData.content} onChange={e => setFormData(p => ({...p, content: e.target.value}))}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-semibold text-slate-800 text-sm resize-none"
              placeholder="Write your recommendation here..." />
          </div>
        </FormModal>
      )}

      {/* ─── CGPA REC MODAL ───────────────────────────────────────── */}
      {showCgpaRecForm && (
        <FormModal title={`${editingCgpaRec ? 'Edit' : 'New'} CGPA Recommendation`} onClose={() => setShowCgpaRecForm(false)} onSave={saveCgpaRec} saving={cgpaRecSaving} error={cgpaRecError}>
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Min CGPA" value={cgpaRecForm.min_cgpa} onChange={(v: string) => setCgpaRecForm(p => ({...p, min_cgpa: v}))} placeholder="e.g. 6.0" type="number" />
            <InputField label="Max CGPA" value={cgpaRecForm.max_cgpa} onChange={(v: string) => setCgpaRecForm(p => ({...p, max_cgpa: v}))} placeholder="e.g. 7.5" type="number" />
          </div>
          <InputField label="Title" value={cgpaRecForm.title} onChange={(v: string) => setCgpaRecForm(p => ({...p, title: v}))} placeholder="e.g. Focus on core subjects" />
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
            <textarea rows={4} value={cgpaRecForm.description} onChange={e => setCgpaRecForm(p => ({...p, description: e.target.value}))}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-semibold text-slate-800 text-sm resize-none"
              placeholder="Detailed recommendation for this CGPA range..." />
          </div>
        </FormModal>
      )}

      {/* ─── ROADMAP MODAL ────────────────────────────────────────── */}
      {showRoadmapForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowRoadmapForm(false)} />
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-slate-900">{editingRoadmap ? 'Edit' : 'New'} CGPA Roadmap</h3>
              <button onClick={() => setShowRoadmapForm(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {roadmapError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span className="font-bold">{roadmapError}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Min CGPA" value={roadmapForm.min_cgpa} onChange={(v: string) => setRoadmapForm(p => ({...p, min_cgpa: v}))} placeholder="e.g. 6.0" type="number" />
                <InputField label="Max CGPA" value={roadmapForm.max_cgpa} onChange={(v: string) => setRoadmapForm(p => ({...p, max_cgpa: v}))} placeholder="e.g. 7.5" type="number" />
              </div>
              <InputField label="Roadmap Title" value={roadmapForm.title} onChange={(v: string) => setRoadmapForm(p => ({...p, title: v}))} placeholder="e.g. Academic Recovery Plan" />

              {/* Steps Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Steps</label>
                  <button onClick={addStep} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 font-black rounded-lg text-xs hover:bg-blue-100 transition-all">
                    <Plus className="w-3 h-3" /> Add Step
                  </button>
                </div>
                <div className="space-y-3">
                  {roadmapForm.steps.map((step, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {i + 1}</span>
                        {roadmapForm.steps.length > 1 && (
                          <button onClick={() => removeStep(i)} className="p-1 text-slate-300 hover:text-red-500 rounded transition-all">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input value={step.title} onChange={e => updateStep(i, 'title', e.target.value)} placeholder="Step title"
                        className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-blue-400 rounded-lg outline-none font-semibold text-slate-800 text-sm" />
                      <textarea rows={2} value={step.description} onChange={e => updateStep(i, 'description', e.target.value)} placeholder="Step description"
                        className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-blue-400 rounded-lg outline-none text-slate-700 text-sm resize-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3 shrink-0 border-t border-slate-100 mt-2">
              <button onClick={() => setShowRoadmapForm(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-black rounded-xl hover:bg-slate-200 transition-all text-sm">Cancel</button>
              <button onClick={saveRoadmap} disabled={roadmapSaving}
                className="flex-1 py-3 bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {roadmapSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Roadmap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared modal wrapper for simple forms ──────────────────────────────── */
function FormModal({ title, onClose, onSave, saving, error, children }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-all"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /><span className="font-bold">{error}</span>
            </div>
          )}
          {children}
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 font-black rounded-xl hover:bg-slate-200 transition-all text-sm">Cancel</button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
