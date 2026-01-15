import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './store/authSlice';
import Login from './pages/Login';
import ReceptionistDash from './pages/ReceptionistDash';
import DoctorDash from './pages/DoctorDash';
import PatientHistory from './pages/PatientHistory';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/receptionist" element={<ReceptionistDash />} />
        <Route path="/doctor" element={<DoctorDash />} />
        <Route path="/patient-history" element={<PatientHistory />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 text-white font-inter">
        <Toaster position="bottom-center" />
        <AppContent />
      </div>
    </Provider>
  );
}
