import React, { useState } from 'react';
import { X, Printer, CreditCard, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function InvoiceModal({ bill, onClose }) {
  const { payBill } = useHospital();
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI / QR Code');

  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleProcessPayment = async () => {
    setPaying(true);
    try {
      await payBill(bill.id, selectedMethod);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content print-only-sheet" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '680px' }}
      >
        {/* Header toolbar */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Hospital Tax Invoice</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print Bill</span>
            </button>
            <button type="button" className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="modal-body" style={{ padding: '2rem' }}>
          {/* Hospital Info & Invoice Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800 }}>
                PulseCare Super-Speciality Hospital
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                GSTIN: 07AAACP1294K1Z8 • Reg No: DL/HOSP/2022/9410
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Medical Enclave, New Delhi - 110029
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${bill.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`} style={{ fontSize: '0.9rem', padding: '0.35rem 0.9rem' }}>
                {bill.status === 'Paid' ? '✓ PAID IN FULL' : '⚠ PAYMENT PENDING'}
              </span>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>
                {bill.invoiceNo}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Date: {bill.date}
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Billed To (Patient)
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {bill.patientName}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Patient ID: {bill.patientId} • Discharge / Inpatient Care Account
            </div>
          </div>

          {/* Items breakdown */}
          <div className="table-wrapper" style={{ marginBottom: '1.5rem' }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Particulars / Healthcare Service</th>
                  <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {bill.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--text-main)' }}>{item.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{bill.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span>Hospital Cess & GST (5%):</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{bill.tax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.3rem' }}>
              <span>Total Payable:</span>
              <span>₹{bill.total.toLocaleString()}</span>
            </div>

            {bill.status === 'Paid' && (
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-green)', fontWeight: 700, marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={16} />
                <span>Paid via {bill.paymentMethod}</span>
              </div>
            )}
          </div>

          {/* Payment Section for Pending Bills */}
          {bill.status !== 'Paid' && (
            <div className="no-print" style={{ 
              marginTop: '1.5rem', 
              padding: '1.2rem', 
              background: 'var(--bg-surface-elevated)', 
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-hover)' 
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Settle Bill Online / Counter Simulator</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                {['UPI / QR Code', 'Credit/Debit Card', 'Cash Counter', 'Health Insurance / TPA'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`btn btn-sm ${selectedMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-success"
                style={{ width: '100%' }}
                onClick={handleProcessPayment}
                disabled={paying}
              >
                <CheckCircle2 size={16} />
                <span>{paying ? 'Processing Payment...' : `Complete Payment of ₹${bill.total.toLocaleString()}`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer no-print">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
