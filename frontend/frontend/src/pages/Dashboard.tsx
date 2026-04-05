import { Routes, Route } from 'react-router-dom';
import Overview from '../components/Overview';
import StudentList from '../components/StudentList';
import StudentDetail from '../components/StudentDetail';
import AddStudent from '../components/AddStudent';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden transition-colors duration-300">
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative pt-24">
        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="students" element={<StudentList />} />
              <Route path="students/:id" element={<StudentDetail />} />
              <Route path="add-student" element={<AddStudent />} />
              <Route path="admin" element={<AdminPanel />} />
            </Routes>
          </div>
          <footer className="mt-auto py-6 border-t border-border text-center bg-card shadow-inner">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Made by Umesh Nishad &copy; 2026
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
