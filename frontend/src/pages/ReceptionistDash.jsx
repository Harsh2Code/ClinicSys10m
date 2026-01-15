import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ReceptionistDash() {
  const [patient, setPatient] = useState({ name: '', age: '', history: '' });

  const registerPatient = async (e) => {
    e.preventDefault();
    const token = Math.floor(100 + Math.random() * 900);
    try {
      await addDoc(collection(db, "patients"), {
        ...patient,
        token,
        status: "pending",
        timestamp: serverTimestamp()
      });
      toast.success(`Token #${token} issued!`);
      setPatient({ name: '', age: '', history: '' });
    } catch (err) { toast.error("Error saving data"); }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-montserrat font-bold mb-8">Receptionist Desk</h2>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
        <form onSubmit={registerPatient} className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input 
              className="bg-white/10 p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[#b15df6]"
              placeholder="Full Name" required
              value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})}
            />
            <input 
              className="bg-white/10 p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[#b15df6]"
              placeholder="Age" type="number" required
              value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})}
            />
          </div>
          <textarea 
            className="bg-white/10 p-4 rounded-xl border border-white/10 h-32"
            placeholder="Previous Medical History"
            value={patient.history} onChange={e => setPatient({...patient, history: e.target.value})}
          />
          <button className="bg-[#b15df6] py-4 rounded-xl font-bold hover:brightness-110 transition-all">
            Assign Token & Save
          </button>
        </form>
      </div>
    </div>
  );
}
