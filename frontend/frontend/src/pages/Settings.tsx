import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Camera, Shield, Bell, 
  Trash2, Save, CheckCircle2, AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image must be under 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({ name, email, avatar });
      setUpdating(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-medium">Manage your profile and account preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Tabs (Desktop) */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'profile', icon: <User className="w-4 h-4" />, name: 'Personal Info' },
              { id: 'security', icon: <Shield className="w-4 h-4" />, name: 'Security' },
              { id: 'notifications', icon: <Bell className="w-4 h-4" />, name: 'Notifications' },
              { id: 'danger', icon: <Trash2 className="w-4 h-4" />, name: 'Delete Account', color: 'text-red-600' }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  tab.id === 'profile' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : `bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 ${tab.color || ''}`
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
            >
              <form onSubmit={handleSave} className="space-y-8">
                
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2rem] bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-slate-300" />
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all border-4 border-white"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Profile Picture</h3>
                    <p className="text-sm text-slate-500 font-medium mb-3">PNG, JPG up to 1MB</p>
                    <div className="flex gap-2">
                       <button 
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
                       >
                        Change Image
                      </button>
                      {avatar && (
                        <button 
                          type="button"
                          onClick={() => setAvatar('')}
                          className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Personalized data helps EduVantage AI provide more accurate predictions. Your email is used for account security and recovery.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    type="submit"
                    disabled={updating}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                    {!updating && <Save className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </form>
            </motion.div>

            {/* Password Section Mockup */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 opacity-60">
               <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                 <Shield className="w-5 h-5 text-blue-600" /> Security & Password
               </h3>
               <p className="text-sm text-slate-500 font-medium mb-8">Change your password and manage security settings (Coming soon).</p>
               <button disabled className="px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed">
                 Update Security Settings
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
