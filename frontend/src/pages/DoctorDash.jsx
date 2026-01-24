import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import PrescriptionModal from '@/components/PrescriptionModal';
import { MinimalNavbar } from '../components/Navbar';
import { InteractionCard } from '../components/InteractionCard';
import { LuStethoscope } from 'react-icons/lu';
import API_URL from '../lib/api';

export default function DoctorDash() {
  const { user } = useSelector(state => state.auth);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_URL}/patients`);
      setPatients(response.data);
    } catch (err) {
      toast.error('Failed to fetch patients');
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
            <p className="text-white/70 text-sm">Welcome, {user?.name} ({user?.role})</p>
          </div>
          <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
            <LuStethoscope size={24} className="text-[#b15df6]" />
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((p, i) => (
            <InteractionCard
              key={i}
              patient={{
                name: p.name,
                token: p.currentToken?.tokenNumber || 'N/A',
                status: p.currentToken?.status || 'No Token',
                age: calculateAge(p.dateOfBirth)
              }}
              onSelect={(p) => {
                const fullPatient = patients.find(pt => pt.name === p.name);
                setSelectedPatient(fullPatient);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      </main>

      {selectedPatient && (
        <PrescriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          patient={selectedPatient}
        />
      )}
    </div>
  );
}
