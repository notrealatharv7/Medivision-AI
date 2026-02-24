import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import Prism from './components/Prism/Prism.jsx';
// import Silk from './components/silk/silk.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <div className="min-h-screen font-sans text-gray-900 relative">
      {/* Global Background Layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-60">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          scale={3.6}
          height={3.5}
          baseWidth={5.5}
          noise={0}
          glow={1}
          hueShift={0}
          colorFrequency={1}
        />
      </div>

      <Navbar />
      <div className="relative z-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
