import React, { useState } from 'react';
import { X, Stethoscope, Plus, Trash2, HeartPulse, Pill, CheckCircle, FileCheck } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function ConsultationModal({ appointment, onClose, onPrescriptionCreated }) {
  const { data, savePrescription } = useHospital();

  const patient = data?.patients?.find(p => p.id === appointment?.patientId);
  const doctor = data?.doctors?.find(d => d.id === appointment?.doctorId);

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 Tab Daily', timing: 'After Meals', days: '7 Days', instructions: 'Take with warm water' }
  ]);
  const [labTests, setLabTests] = useState('');
  const [advice, setAdvice] = useState('Maintain proper hydration and take adequate bed rest.');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddMedicine = () => {
    setMedicines(prev => [
      ...prev,
      { name: '', dosage: '1 Tab Daily', timing: 'After Meals', days: '5 Days', instructions: '' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    setMedicines(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      alert('Please enter a clinical diagnosis');
      return;
    }

    const validMedicines = medicines.filter(m => m.name.trim() !== '');
    const labTestsArray = labTests
      ? labTests.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    setSubmitting(true);
    try {
      const newRx = await savePrescription({
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorId: appointment.doctorId,
        doctorName: appointment.doctorName,
        diagnosis,
        medicines: validMedicines,
        labTests: labTestsArray,
        advice,
        followUpDate
      });

      onClose();
      if (onPrescriptionCreated) {
        onPrescriptionCreated(newRx);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Doctor Consultation & Rx Prescription</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Patient Overview & Vitals Bar */}
            <div style={{ 
              background: 'var(--bg-surface-elevated)', 
              padding: '1.25rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{appointment.patientName}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Token #{appointment.tokenNumber} • Reason: <em>"{appointment.reason}"</em>
                  </div>
                </div>
                <span className="badge badge-consultation">Active Consultation</span>
              </div>

              {/* Vitals */}
              {patient?.vitals && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
                  gap: '0.65rem', 
                  background: 'var(--bg-surface)', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>BP</div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>{patient.vitals.bp}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Heart Rate</div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>{patient.vitals.heartRate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Blood Sugar</div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>{patient.vitals.sugar}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Blood Group</div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--accent-rose)' }}>{patient.bloodGroup}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Allergies</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-amber)' }}>
                      {patient.allergies?.join(', ') || 'None'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnosis Input */}
            <div className="form-group">
              <label className="form-label">Clinical Diagnosis *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Stage 1 Hypertension with episodic tachycardia / Acute Bronchitis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>

            {/* Medicines List */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  <Pill size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Prescribed Medications
                </label>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddMedicine}>
                  <Plus size={14} />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {medicines.map((med, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '2fr 1.2fr 1.5fr 1fr 1.8fr auto', 
                      gap: '0.5rem', 
                      alignItems: 'center',
                      background: 'var(--bg-surface-elevated)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Medicine / Drug name"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Dosage (e.g. 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Timing (e.g. After Meals)"
                      value={med.timing}
                      onChange={(e) => handleMedicineChange(idx, 'timing', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Days (e.g. 7 Days)"
                      value={med.days}
                      onChange={(e) => handleMedicineChange(idx, 'days', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Instructions (e.g. SOS / Before sleep)"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                    />
                    <button
                      type="button"
                      className="icon-btn"
                      style={{ color: 'var(--accent-rose)' }}
                      onClick={() => handleRemoveMedicine(idx)}
                      disabled={medicines.length === 1}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Investigations & Follow up */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Lab Tests Recommended (Comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Complete Blood Count (CBC), Lipid Profile, ECG"
                  value={labTests}
                  onChange={(e) => setLabTests(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Follow-up Consultation Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
            </div>

            {/* Advice */}
            <div className="form-group">
              <label className="form-label">Clinical Advice & Instructions</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Lifestyle guidance, dietary restrictions, warning signs..."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <FileCheck size={16} />
              <span>{submitting ? 'Generating Rx...' : 'Complete & Issue Prescription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
