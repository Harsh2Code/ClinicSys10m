import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import ModernInput from '../components/ModernInput';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'receptionist' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(formData.role === 'doctor' ? '/doctor' : '/receptionist');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="mt-4 text-4xl font-montserrat font-bold tracking-tighter">Direction</h1>
          <p className="text-white/50 text-sm">Clinic Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <ModernInput
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <ModernInput
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="receptionist">Receptionist</option>
            <option value="doctor">Doctor</option>
          </select>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#b15df6]/80 hover:bg-[#b15df6] rounded-2xl transition-all font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
