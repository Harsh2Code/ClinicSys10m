import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import ModernInput from '../components/ModernInput';
import { MinimalNavbar } from '../components/Navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '../components/ui/select';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'receptionist' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MinimalNavbar />
      <div className="flex items-center justify-center min-h-screen p-4 pt-32">
        <div className="w-full max-w-md p-8 bg-[#120f14] backdrop-blur-xl border border-white/20 rounded-md shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <h1 className="mt-4 text-4xl font-montserrat font-bold tracking-tighter">Direction</h1>
            <p className="text-white/50 text-sm">Clinic Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ModernInput
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
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
                <SelectValue placeholder="Select a Role" /> Pick Role
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-[#191919fd] border-2 rounded" style={{color:"white"}}>
                  <SelectLabel className="mb-3">Roles</SelectLabel>
                  
                  <SelectItem value="receptionist">Reception</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <select
              
              className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="receptionist">Receptionist</option>
              <option value="doctor">Doctor</option>
            </select> */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#b15df6]/80 hover:bg-[#b15df6] rounded-2xl transition-all font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
