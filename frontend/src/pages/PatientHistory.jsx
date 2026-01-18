import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MinimalNavbar } from '../components/Navbar';
import BillingModal from '../components/BillingModal';

export default function PatientHistory() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const { user } = useSelector(state => state.auth);

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

  const fetchPrescriptions = async (patientId) => {
    try {
      const response = await axios.get(`/api/prescriptions/patient/${patientId}`);
      setPrescriptions(response.data);
      setSelectedPatient(patients.find(p => p._id === patientId));
    } catch (err) {
      toast.error('Failed to fetch prescriptions');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MinimalNavbar />
      <main className="max-w-7xl mx-auto pt-32 px-8">
        <header className="mb-16">
          <h2 className="text-4xl font-montserrat font-light tracking-tight text-white">
            Patient <span className="font-bold">History</span>
          </h2>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Patients List */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded">
            <h3 className="text-xl font-semibold mb-6 text-white">Patients with Prescriptions</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {patients.map((p) => (
                <div key={p._id} className="bg-white/5 p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onClick={() => fetchPrescriptions(p._id)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-sm text-white/70">{p.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/70">Token: {p.currentToken?.tokenNumber || 'None'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Details */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded">
            <h3 className="text-xl font-semibold mb-6 text-white">
              {selectedPatient ? `Prescriptions for ${selectedPatient.name}` : 'Select a patient'}
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="bg-white/5 p-4 rounded">
                  <p className="text-white/70">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                  <p className="text-white/70">Doctor: {prescription.doctor.name}</p>
                  <ul className="mt-2">
                    {prescription.medications.map((med, i) => (
                      <li key={i} className="text-white">{med.name} - {Array.isArray(med.timeOfDay) ? med.timeOfDay.join(', ') : med.timeOfDay} for {med.duration} days</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      setSelectedPrescription(prescription);
                      setIsBillingModalOpen(true);
                    }}
                    className="mt-2 bg-[#7223b3] py-2 px-4 rounded font-bold hover:brightness-110 transition-all text-white text-sm"
                  >
                    Generate Bill
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {isBillingModalOpen && selectedPrescription && (
        <BillingModal
          isOpen={isBillingModalOpen}
          onClose={() => setIsBillingModalOpen(false)}
          prescription={selectedPrescription}
          patient={selectedPatient}
        />
      )}
    </div>
  );
}
