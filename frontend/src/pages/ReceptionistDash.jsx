import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ModernInput from '../components/ModernInput';
import { MinimalNavbar } from '../components/Navbar';

export default function ReceptionistDash() {
  const [patient, setPatient] = useState({ name: '', email: '', phone: '', address: '', dateOfBirth: '', medicalHistory: '' });
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data);
    } catch (err) {
      toast.error('Failed to fetch patients');
    }
  };

  const registerPatient = async (e) => {
    e.preventDefault();
    try {
      // Create patient (token is automatically generated in backend)
      const patientResponse = await axios.post('/api/patients', patient);
      const newPatient = patientResponse.data;

      toast.success(`Patient registered! Token #${newPatient.currentToken.tokenNumber} issued!`);
      setPatient({ name: '', email: '', phone: '', address: '', dateOfBirth: '', medicalHistory: '' });
      fetchPatients();
    } catch (err) {
      toast.error('Error registering patient');
    }
  };

  const createBill = async (patientId, items, total) => {
    try {
      await axios.post('/api/bills', { patient: patientId, items, totalAmount: total });
      toast.success('Bill created successfully');
    } catch (err) {
      toast.error('Error creating bill');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MinimalNavbar />
      <main className="max-w-7xl mx-auto pt-32 px-8">
        <header className="mb-16">
          <h2 className="text-4xl font-montserrat font-light tracking-tight text-white">
            Receptionist <span className="font-bold">Desk</span>
          </h2>
          <button
            onClick={() => navigate('/patient-history')}
            className="mt-4 bg-[#b15df6] text-white px-6 py-2 rounded-lg hover:bg-[#a14ae5] transition-all"
          >
            View Patient History & Billing
          </button>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Patient Registration */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded">
            <h3 className="text-xl font-semibold mb-6">Register New Patient</h3>
            <form onSubmit={registerPatient} className="space-y-4">
              <ModernInput
                placeholder="Full Name"
                label="Full Name"
                value={patient.name}
                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                required
              />
              <ModernInput
                type="email"
                label="E-Mail"
                placeholder="Email"
                value={patient.email}
                onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                required
              />
              <ModernInput
                placeholder="Phone"
                label="Phone Nr"
                value={patient.phone}
                onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                required
              />
              <ModernInput
                placeholder="Address here"
                label="Address"
                value={patient.address}
                onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                required
              />
              <ModernInput
                type="date"
                label="DOB"
                placeholder="Date of Birth"
                value={patient.dateOfBirth}
                onChange={(e) => setPatient({ ...patient, dateOfBirth: e.target.value })}
                required
              />
              <textarea
                className="w-full bg-white/10 p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[#b15df6] h-32"
                placeholder="Medical History"
                label="Medical History(if any)"
                value={patient.medicalHistory}
                onChange={(e) => setPatient({ ...patient, medicalHistory: e.target.value })}
              />
              <button className="w-full bg-[#7223b3] py-4 rounded-xl font-bold hover:brightness-110 transition-all">
                Register Patient & Assign Token
              </button>
            </form>
          </div>

          {/* Patients List */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded">
            <h3 className="text-xl font-semibold mb-6">Recent Patients</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {patients.slice(0, 10).map((p) => (
                <div key={p._id} className="bg-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-white/70">{p.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Token: {p.currentToken?.tokenNumber || 'None'}</p>
                      <p className="text-sm text-white/70">{p.currentToken?.status || 'No token'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
