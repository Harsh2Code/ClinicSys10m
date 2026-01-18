import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import ModernInput from '../components/ModernInput';
import { MinimalNavbar } from '../components/Navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '../components/ui/select';
import { useMessage } from '../lib/MessageContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'admin' });
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
    <div className="min-h-screen bg-[#0a0a0a]" >
      <MinimalNavbar />
      <div className="flex items-center justify-center min-h-screen p-4 pt-32">
        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-md shadow-2xl"
        style={{backgroundColor: "#120f14"}}>
          <div className="flex flex-col items-center mb-8">
            <h1 className="mt-4 text-4xl font-montserrat tracking-[0.5rem] uppercase font-bold tracking-tighter">Direction</h1>
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

            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-[#191919fd] border-2 rounded" style={{color:"white"}}>
                  <SelectLabel className="mb-3">Roles</SelectLabel>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
    </div>
  );
}
