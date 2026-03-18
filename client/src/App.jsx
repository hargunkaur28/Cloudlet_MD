import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SharedFile from './pages/SharedFile';
import Requests from './pages/Requests';
import SharedWithMe from './pages/SharedWithMe';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Starred from './pages/Starred';
import Trash from './pages/Trash';
import Recent from './pages/Recent';
import Home from './pages/Home';
import Security from './pages/Security';
import Contact from './pages/Contact';

function App() {
  const { user } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!user || user.role !== 'admin') return <Navigate to="/" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? "/admin" : "/"} />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to={user.role === 'admin' ? "/admin" : "/"} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/file/:id" element={<SharedFile />} />
      <Route path="/security" element={<Security />} />
      <Route path="/contact" element={<Contact />} />
      
      <Route path="/" element={!user ? <Home /> : <Layout />}>
        <Route index element={user?.role === 'admin' ? <AdminDashboard /> : <Dashboard />} />
        <Route path="folder/:folderId" element={<Dashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="shared" element={<SharedWithMe />} />
        <Route path="starred" element={<Starred />} />
        <Route path="recent" element={<Recent />} />
        <Route path="trash" element={<Trash />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
