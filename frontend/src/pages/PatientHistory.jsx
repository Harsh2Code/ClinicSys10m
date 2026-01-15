import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export const PatientHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    const q = query(collection(db, "patients"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    setHistory(querySnapshot.docs.map(doc => doc.data()));
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-montserrat font-bold mb-4">Patient Records</h3>
      <div className="overflow-x-auto glass-panel rounded-2xl">
        <table className="table w-full">
          <thead className="text-white/50 border-b border-white/10">
            <tr>
              <th>Name</th>
              <th>Token</th>
              <th>Prescription</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i} className="hover:bg-white/5">
                <td className="font-semibold">{item.name}</td>
                <td><span className="badge badge-ghost border-brand/50">#{item.token}</span></td>
                <td className="text-sm opacity-70 truncate max-w-xs">{item.prescription || 'N/A'}</td>
                <td>
                  <div className={`badge ${item.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {item.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};