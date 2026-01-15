import { MinimalNavbar } from '../components/Navbar';
import { InteractionCard } from '../components/InteractionCard';
import { LuStethoscope } from 'react-icons/lu';

export default function DoctorDash() {
  const mockPatients = [
    { name: "Julian Casablancas", age: 42, token: "082", status: "WAITING" },
    { name: "Sarah Konnor", age: 29, token: "083", status: "WAITING" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MinimalNavbar />
      <main className="max-w-7xl mx-auto pt-32 px-8">
        <header className="mb-16 flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="font-montserrat text-4xl font-light tracking-tight text-white">
              Clinical <span className="font-bold">Queue</span>
            </h2>
            <p className="text-white/30 text-xs uppercase tracking-[0.2em]">Live updates from reception</p>
          </div>
          <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
            <LuStethoscope size={24} className="text-[#b15df6]" />
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPatients.map((p, i) => (
            <InteractionCard key={i} patient={p} onSelect={(p) => console.log(p)} />
          ))}
        </div>
      </main>
    </div>
  );
}
