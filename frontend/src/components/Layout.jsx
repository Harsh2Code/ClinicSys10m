import { Toaster } from 'react-hot-toast';

export const Layout = ({ children, role }) => (
  <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-black text-slate-200 font-inter selection:bg-purple-500/30">
    <Toaster position="top-center" reverseOrder={false} />
    <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
          <span className="text-[#b15df6] font-bold">D</span>
        </div>
        <h1 className="font-montserrat font-extrabold text-2xl tracking-tighter uppercase italic">Direction</h1>
      </div>
      <div className="badge badge-outline border-white/20 py-4 px-6 rounded-full opacity-60">
        {role} Portal
      </div>
    </nav>
    <main className="max-w-7xl mx-auto p-6 pb-20">{children}</main>
  </div>
);