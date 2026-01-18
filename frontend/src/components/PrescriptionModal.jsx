import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import ModernInput from './ModernInput';

const MEDICINES = [
  'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Ciprofloxacin',
  'Metformin', 'Lisinopril', 'Atorvastatin', 'Omeprazole', 'Simvastatin',
  'Losartan', 'Amlodipine', 'Hydrochlorothiazide', 'Furosemide', 'Warfarin',
  'Clopidogrel', 'Prednisone', 'Dexamethasone', 'Insulin', 'Metoprolol'
];

export default function PrescriptionModal({ isOpen, onClose, patient }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [timeOfDay, setTimeOfDay] = useState([]);
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (isOpen && patient) {
      fetchPrescriptions();
    }
  }, [isOpen, patient]);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`/api/prescriptions/patient/${patient._id}`);
      setPrescriptions(response.data);
    } catch (err) {
      toast.error('Failed to fetch prescriptions');
    }
  };

  const addMedication = () => {
    if (!medicineSearch || timeOfDay.length === 0 || !duration) {
      toast.error('Please fill all fields');
      return;
    }
    setMedications([...medications, { name: medicineSearch, timeOfDay, duration: parseInt(duration) }]);
    setMedicineSearch('');
    setTimeOfDay([]);
    setDuration('');
  };

  const submitPrescription = async () => {
    if (medications.length === 0) {
      toast.error('Please add at least one medication');
      return;
    }
    try {
      await axios.post('/api/prescriptions', {
        patient: patient._id,
        medications,
        notes: ''
      });
      toast.success('Prescription submitted');
      setMedications([]);
      onClose();
    } catch (err) {
      toast.error('Failed to submit prescription');
    }
  };

  const filteredMedicines = MEDICINES.filter(med =>
    med.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Patient: {patient?.name}</DialogTitle>
          <div className="text-white/70 text-sm">
            <p>Phone: {patient?.phone}</p>
            <p>Age: {patient?.dateOfBirth ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'}</p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient History */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Patient History</h3>
            <div className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="bg-white/5 p-4 rounded">
                  <p className="text-white/70">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                  <p className="text-white/70">Doctor: {prescription.doctor.name}</p>
                  <ul className="mt-2">
                    {prescription.medications.map((med, i) => (
                      <li key={i} className="text-white">{med.name} - {med.timeOfDay} for {med.duration} days</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Prescribe Medicine</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Medicine Name</label>
                <input
                  type="text"
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  placeholder="Search medicine..."
                  className="w-full bg-white/10 p-3 rounded border border-white/10 focus:border-[#b15df6] text-white"
                  list="medicines"
                />
                <datalist id="medicines">
                  {filteredMedicines.map((med, index) => (
                    <option key={index} value={med} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-white mb-2">Time of Day</label>
                <div className="flex gap-4">
                  {['Morning', 'Afternoon', 'Evening'].map((time) => (
                    <label key={time} className="flex items-center text-white">
                      <input
                        type="checkbox"
                        value={time}
                        checked={timeOfDay.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTimeOfDay([...timeOfDay, time]);
                          } else {
                            setTimeOfDay(timeOfDay.filter(t => t !== time));
                          }
                        }}
                        className="mr-2"
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>

              <ModernInput
                label="Duration (days)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in days"
              />

              <button
                onClick={addMedication}
                className="w-full bg-[#7223b3] py-3 rounded font-bold hover:brightness-110 transition-all text-white"
              >
                Add Medication
              </button>
            </div>

            {/* Medications List */}
            <div className="mt-4">
              <h4 className="text-white mb-2">Medications to Prescribe:</h4>
              <ul className="space-y-2">
                {medications.map((med, index) => (
                  <li key={index} className="bg-white/5 p-2 rounded text-white">
                    {med.name} - {med.timeOfDay} for {med.duration} days
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={submitPrescription}
              className="w-full bg-[#b15df6] py-3 rounded font-bold hover:brightness-110 transition-all text-white mt-4"
            >
              Submit Prescription
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
