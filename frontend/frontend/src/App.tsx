import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Settings from './pages/Settings';
import About from './pages/About';
import Services from './pages/Services';
import Careers from './pages/Careers';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import PerformanceForm from './pages/PerformanceForm';
import PredictGPA from './pages/PredictGPA';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChatbotWidget from './components/ChatbotWidget';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground font-sans flex flex-col transition-colors duration-300">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify/:token" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route path="/about"    element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/careers"  element={<Careers />} />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />

                {/* Teacher / Admin Routes */}
                <Route path="/dashboard/*" element={
                  <ProtectedRoute allowedRole="teacher">
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Student routes... */}
                <Route path="/student/form" element={
                  <ProtectedRoute allowedRole="student">
                    <PerformanceForm />
                  </ProtectedRoute>
                } />
                <Route path="/student/predict" element={
                  <ProtectedRoute allowedRole="student">
                    <PredictGPA />
                  </ProtectedRoute>
                } />
                <Route path="/student/dashboard" element={
                  <ProtectedRoute allowedRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <ChatbotWidget />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
