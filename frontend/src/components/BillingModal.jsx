import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import ModernInput from './ModernInput';

const MEDICINE_PRICES = {
  'Paracetamol': 50,
  'Ibuprofen': 75,
  'Aspirin': 40,
  'Amoxicillin': 120,
  'Ciprofloxacin': 150,
  'Metformin': 80,
  'Lisinopril': 90,
  'Atorvastatin': 200,
  'Omeprazole': 100,
  'Simvastatin': 180,
  'Losartan': 85,
  'Amlodipine': 95,
  'Hydrochlorothiazide': 70,
  'Furosemide': 60,
  'Warfarin': 250,
  'Clopidogrel': 300,
  'Prednisone': 110,
  'Dexamethasone': 140,
  'Insulin': 500,
  'Metoprolol': 130
};

export default function BillingModal({ isOpen, onClose, prescription, patient }) {
  const [prices, setPrices] = useState(
    prescription.medications.reduce((acc, med) => {
      acc[med.name] = MEDICINE_PRICES[med.name] || 0;
      return acc;
    }, {})
  );
  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    const sum = prescription.medications.reduce((acc, med) => {
      return acc + (prices[med.name] * med.duration);
    }, 0);
    setTotal(sum);
  };

  const handlePriceChange = (medicineName, price) => {
    setPrices(prev => ({ ...prev, [medicineName]: parseFloat(price) || 0 }));
  };

  const generateReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Medical Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .patient-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Clinic Receipt</h1>
            <p>123 Health Street, Medical City</p>
          </div>
          <div class="patient-info">
            <p><strong>Patient:</strong> ${patient.name}</p>
            <p><strong>Email:</strong> ${patient.email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Time of Day</th>
                <th>Duration (days)</th>
                <th>Price per Day</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.medications.map(med => `
                <tr>
                  <td>${med.name}</td>
                  <td>${Array.isArray(med.timeOfDay) ? med.timeOfDay.join(', ') : med.timeOfDay}</td>
                  <td>${med.duration}</td>
                  <td>$${prices[med.name]}</td>
                  <td>$${(prices[med.name] * med.duration).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total">
                <td colspan="4">Total Amount</td>
                <td>$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <div class="footer">
            <p>Thank you for choosing our clinic!</p>
            <p>Please keep this receipt for your records.</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  React.useEffect(() => {
    calculateTotal();
  }, [prices]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Billing for {patient?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Prescribed Medicines</h3>
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2">Medicine</th>
                  <th className="text-left py-2">Time of Day</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Price per Day</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medications.map((med, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="py-2">{med.name}</td>
                    <td className="py-2">{Array.isArray(med.timeOfDay) ? med.timeOfDay.join(', ') : med.timeOfDay}</td>
                    <td className="py-2">{med.duration} days</td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={prices[med.name]}
                        onChange={(e) => handlePriceChange(med.name, e.target.value)}
                        className="w-20 bg-white/10 p-1 rounded border border-white/10 text-white"
                      />
                    </td>
                    <td className="py-2">${(prices[med.name] * med.duration).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/20">
                  <td colSpan="4" className="py-2 text-right font-bold">Total:</td>
                  <td className="py-2 font-bold">${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex gap-4">
            <button
              onClick={generateReceipt}
              className="flex-1 bg-[#7223b3] py-3 rounded font-bold hover:brightness-110 transition-all text-white"
            >
              Generate Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 py-3 rounded font-bold hover:brightness-110 transition-all text-white"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
