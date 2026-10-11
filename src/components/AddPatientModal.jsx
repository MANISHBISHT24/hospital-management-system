import React, { useState } from 'react';
import { X, UserPlus, HeartPulse, CheckCircle } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function AddPatientModal({ onClose }) {
  const { registerPatient } = useHospital();

  const [name, setName] = useState('');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Medical Colony, Delhi');
  const [emergencyContact, setEmergencyContact] = useState('Family Member - +91 98765 00001');
  const [allergies, setAllergies] = useState('None');
  const [bp, setBp] = useState('120/80 mmHg');
  const [heartRate, setHeartRate] = useState('72 bpm');
  const [sugar, setSugar] = useState('95 mg/dL');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await registerPatient({
        name,
        age: Number(age),
        gender,
        bloodGroup,
        phone,
        email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
        address,
        emergencyContact,
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        vitals: {
          bp,
          heartRate,
          temp: '98.6 °F',
          sugar,
          weight: '68 kg',
          height: '172 cm'
        }
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Register New Patient</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Patient Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select className="form-control" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Info</label>
              <input
                type="text"
                className="form-control"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>

            {/* Initial Vitals */}
            <div style={{ 
              background: 'var(--bg-surface-elevated)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)' 
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HeartPulse size={16} color="var(--primary)" />
                <span>Initial Triage Vitals</span>
              </div>
              <div className="grid-3">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">BP (mmHg)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Pulse (bpm)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sugar (mg/dL)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle size={16} />
              <span>{submitting ? 'Registering...' : 'Register Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
