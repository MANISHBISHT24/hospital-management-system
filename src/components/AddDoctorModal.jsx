import React, { useState } from 'react';
import { X, UserPlus, Stethoscope, CheckCircle } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function AddDoctorModal({ onClose }) {
  const { addDoctor } = useHospital();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Cardiology');
  const [specialty, setSpecialty] = useState('');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [experience, setExperience] = useState('8 Years');
  const [fee, setFee] = useState(1000);
  const [room, setRoom] = useState('OPD Room 204');
  const [phone, setPhone] = useState('+91 98111 22334');
  const [email, setEmail] = useState('');
  const [timing, setTiming] = useState('09:00 AM - 02:00 PM');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await addDoctor({
        name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
        department,
        specialty: specialty || `${department} Specialist`,
        qualification,
        experience,
        fee: Number(fee),
        room,
        phone,
        email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@pulsecare.org`,
        timing,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        avatar: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400`
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
            <h3 style={{ margin: 0 }}>Register New Doctor</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Doctor Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Alok Nath"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medical Department</label>
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Specialty / Sub-specialty</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Senior Cardiac Surgeon"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. MBBS, MS, MCh"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 10 Years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD Room</label>
                <input
                  type="text"
                  className="form-control"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD Timings</label>
                <input
                  type="text"
                  className="form-control"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle size={16} />
              <span>{submitting ? 'Registering...' : 'Add Doctor to Roster'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
