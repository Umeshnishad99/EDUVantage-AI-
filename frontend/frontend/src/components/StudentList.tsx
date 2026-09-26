import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, MoreHorizontal, User, Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  predicted_gpa_4: number;
  predicted_gpa_10: number;
}

const StudentList = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStudents();
  }, [token]);

  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 transition-colors duration-300">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-muted-foreground font-bold">Loading student directory...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Student Directory</h2>
          <p className="text-xs md:text-sm font-bold text-muted-foreground mt-1">Manage and track individual findings</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-2xl bg-card focus:border-primary outline-none font-bold text-sm text-foreground transition-all"
            />
          </div>
          <button className="w-full sm:w-auto p-3 border-2 border-border rounded-2xl bg-card text-muted-foreground hover:bg-muted transition-all shadow-sm flex items-center justify-center gap-2">
            <Filter className="w-5 h-5" />
            <span className="sm:hidden font-bold">Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-card rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-primary/5 border border-border overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">
                <th className="p-4 md:p-6 pl-6 md:pl-8">Student Profile</th>
                <th className="p-4 md:p-6">4.0 GPA</th>
                <th className="p-4 md:p-6">10.0 GPA</th>
                <th className="p-4 md:p-6">Status</th>
                <th className="p-4 md:p-6 text-right pr-6 md:pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-primary/5 transition-all cursor-pointer group"
                  onClick={() => navigate(`/dashboard/students/${student.id}`)}
                >
                  <td className="p-4 md:p-6 pl-6 md:pl-8">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-muted flex items-center justify-center border-2 border-transparent text-muted-foreground group-hover:bg-card group-hover:text-primary group-hover:border-primary/20 transition-all">
                        <User className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight text-sm md:text-base">{student.first_name} {student.last_name}</span>
                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground truncate max-w-[120px] md:max-w-none">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 md:p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-black text-foreground text-base md:text-lg">
                        {student.predicted_gpa_4 ? student.predicted_gpa_4.toFixed(2) : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 md:p-6">
                    <span className="font-black text-muted-foreground text-xs md:text-sm">
                      {student.predicted_gpa_10 ? student.predicted_gpa_10.toFixed(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 md:p-6">
                    <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                      student.predicted_gpa_4 >= 3.5 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      student.predicted_gpa_4 >= 2.5 ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {student.predicted_gpa_4 >= 3.5 ? 'Excellent' : student.predicted_gpa_4 >= 2.5 ? 'On Track' : 'Monitor'}
                    </span>
                  </td>
                  <td className="p-4 md:p-6 text-right pr-6 md:pr-8">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-all">
                      <MoreHorizontal className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={5} className="p-12 md:p-20 text-center">
                      <p className="text-muted-foreground font-bold italic">No students found.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
