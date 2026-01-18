import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { MeditationIcon } from './MeditationIcon';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export const MinimalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const getNavItems = () => {
    if (!user) return [];
    const items = [];
    if (user.role === 'receptionist') {
      items.push({ label: 'Reception', path: '/receptionist' });
    } else if (user.role === 'doctor') {
      items.push({ label: 'Doctor', path: '/doctor' });
    }
  items.push({ label: 'Prescription', path: '/patient-history' });
    return items;
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <MeditationIcon size={22} />
          <span className="font-montserrat font-bold tracking-[0.3em] text-[11px] text-white uppercase">
            Direction
          </span>
        </div>

        <div className="flex gap-10 items-center h-full">
          {user && navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`relative h-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                location.pathname === item.path ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b15df6] shadow-[0_0_10px_#b15df6]" />
              )}
            </button>
          ))}

          {user && (
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2 text-white/60">
                <FaUserCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {user.name} ({user.role})
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-white/10 rounded-sm text-[10px] font-bold text-white/40 hover:text-white hover:border-white/40 transition-all uppercase tracking-widest flex items-center gap-1"
              >
                <FaSignOutAlt size={10} />
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-1 border border-white/10 rounded-sm text-[10px] font-bold text-white/40 hover:text-white hover:border-white/40 transition-all uppercase tracking-widest"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-1 border border-white/10 rounded-sm text-[10px] font-bold text-white/40 hover:text-white hover:border-white/40 transition-all uppercase tracking-widest"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
