import React from 'react';
import { X, Printer, Pill, FileText, CheckCircle2 } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function PrescriptionModal({ prescription, onClose }) {
  const { data } = useHospital();

  if (!prescription) return null;

  const patient = data?.patients?.find(p => p.id === prescription.patientId);
  const doctor = data?.doctors?.find(d => d.id === prescription.doctorId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content print-only-sheet" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '780px', background: 'var(--bg-surface)' }}
      >
        {/* Modal Toolbar (hidden in print) */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Digital Medical Prescription</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print Rx</span>
            </button>
            <button type="button" className="icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="modal-body" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            borderBottom: '2px solid var(--primary)', 
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem' 
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 800 }}>
                PulseCare Super-Speciality Hospital
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Plot 42, Health City Avenue, Medical Enclave • Ph: +91 (11) 4890-7000
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Emergency: 1066 / 102 • NABH & JCI Accredited Hospital
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'serif', color: 'var(--primary)', lineHeight: 1 }}>
                ℞
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Rx ID: {prescription.id}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Date: {prescription.date}
              </div>
            </div>
          </div>

          {/* Doctor & Patient Info Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1.5rem', 
            background: 'var(--bg-surface-elevated)', 
            padding: '1.2rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Attending Physician
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {prescription.doctorName}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                {doctor?.qualification || 'Consultant Specialist'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {doctor?.specialty} • {doctor?.room}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Patient Details
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                {prescription.patientName}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Age: {patient?.age || '32'} yrs | Gender: {patient?.gender || 'N/A'} | Blood: {patient?.bloodGroup || 'O+'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Vitals: BP: {patient?.vitals?.bp || '120/80'} | Pulse: {patient?.vitals?.heartRate || '72 bpm'}
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Clinical Diagnosis
            </div>
            <div style={{ 
              padding: '0.75rem 1rem', 
              background: 'var(--primary-light)', 
              borderRadius: 'var(--radius-md)', 
              color: 'var(--primary)', 
              fontWeight: 700,
              fontSize: '0.98rem',
              border: '1px solid rgba(14, 165, 233, 0.25)'
            }}>
              {prescription.diagnosis}
            </div>
          </div>

          {/* Medicines Prescribed */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              color: 'var(--text-muted)', 
              marginBottom: '0.65rem' 
            }}>
              <Pill size={16} />
              <span>Prescribed Medication Schedule</span>
            </div>

            <div className="table-wrapper">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Medicine / Drug</th>
                    <th>Dosage</th>
                    <th>Timing / Frequency</th>
                    <th>Duration</th>
                    <th>Special Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medicines?.map((med, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.timing}</td>
                      <td>{med.days}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{med.instructions || 'As advised'}</td>
                    </tr>
                  ))}
                  {(!prescription.medicines || prescription.medicines.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No medications prescribed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Investigations & Advice */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Required Lab Investigations
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {prescription.labTests?.length > 0 ? (
                  prescription.labTests.map((t, idx) => (
                    <span key={idx} className="badge badge-scheduled" style={{ textTransform: 'none' }}>
                      {t}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>None required</span>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Clinical Advice & Lifestyle
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {prescription.advice || 'Drink plenty of water and maintain restful routine.'}
              </p>
            </div>
          </div>

          {/* Footer Signature & Follow-up */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: '1.5rem',
            marginTop: '1rem' 
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Follow-up Date: <strong style={{ color: 'var(--primary)' }}>{prescription.followUpDate || 'SOS / 14 Days'}</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                * In case of any adverse allergic reaction, report to PulseCare 24x7 Emergency immediately.
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontFamily: 'cursive', 
                fontSize: '1.3rem', 
                color: 'var(--primary)', 
                marginBottom: '0.2rem' 
              }}>
                {prescription.doctorName}
              </div>
              <div style={{ width: '140px', height: '1px', background: 'var(--border-subtle)', margin: '0 auto 0.3rem' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Authorized Signature & Seal
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions (hidden in print) */}
        <div className="modal-footer no-print">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
}
