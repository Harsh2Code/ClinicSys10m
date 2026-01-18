import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from './store/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ReceptionistDash from './pages/ReceptionistDash';
import DoctorDash from './pages/DoctorDash';
import PatientHistory from './pages/PatientHistory';
import ProtectedRoute from './components/ProtectedRoute';
import MessageModal from './components/MessageModal';

function AppContent() {
  const dispatch = useDispatch();
  const { user, message } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleCloseMessage = () => {
    dispatch({ type: 'auth/hideMessage' });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/receptionist" element={<ProtectedRoute><ReceptionistDash /></ProtectedRoute>} />
        <Route path="/doctor" element={<ProtectedRoute><DoctorDash /></ProtectedRoute>} />
        <Route path="/patient-history" element={<ProtectedRoute><PatientHistory /></ProtectedRoute>} />
      </Routes>
      {message && (
        <MessageModal
          isOpen={!!message}
          onClose={handleCloseMessage}
          title={message.title}
          message={message.message}
          type={message.type}
          className="bottom-right"
        />
      )}
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 text-white font-inter">
        <Toaster position="bottom-right" />
        <AppContent />
      </div>
    </Provider>
  );
}
