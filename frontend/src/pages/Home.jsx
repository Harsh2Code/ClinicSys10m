import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MinimalNavbar } from '../components/Navbar';

export default function Home() {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MinimalNavbar />
      <div className="min-h-screen flex items-center justify-center p-4 pt-32">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-montserrat font-bold mb-4">Welcome to Direction</h1>
        <p className="text-white/70 text-lg mb-8">Clinic Management System</p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 hover:bg-white/15 transition-all">
            <h3 className="text-2xl font-bold mb-4">Receptionist Portal</h3>
            <p className="text-white/60 mb-6">Manage patient registrations, tokens, and billing</p>
            <button
              onClick={() => navigate('/receptionist')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all font-semibold"
            >
              Access Receptionist Dashboard
            </button>
          </div>

          <div className="bg-[#b15df6]/10 backdrop-blur-xl border border-[#b15df6]/20 rounded-[2.5rem] p-8 hover:bg-[#b15df6]/20 transition-all">
            <h3 className="text-2xl font-bold mb-4">Doctor Portal</h3>
            <p className="text-white/60 mb-6">View patient details and manage prescriptions</p>
            <button
              onClick={() => navigate('/doctor')}
              className="w-full py-3 bg-[#b15df6]/80 hover:bg-[#b15df6] rounded-2xl transition-all font-semibold shadow-lg shadow-purple-500/20"
            >
              Access Doctor Dashboard
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
