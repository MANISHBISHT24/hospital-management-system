import React, { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function BookAppointmentModal({ onClose }) {
  const { data, bookAppointment, currentRole, currentUser } = useHospital();

  const [department, setDepartment] = useState(data?.doctors?.[0]?.department || 'Cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState(data?.doctors?.[0]?.id || '');
  const [patientId, setPatientId] = useState(
    currentRole === 'patient' && currentUser ? currentUser.id : (data?.patients?.[0]?.id || '')
  );
  const [customPatientName, setCustomPatientName] = useState(
    currentRole === 'patient' && currentUser ? currentUser.name : ''
  );
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter doctors by selected department
  const filteredDoctors = data?.doctors?.filter(d => !department || d.department === department) || [];
  const selectedDoctor = data?.doctors?.find(d => d.id === selectedDoctorId) || filteredDoctors[0];

  const handleDepartmentChange = (dept) => {
    setDepartment(dept);
    const docs = data?.doctors?.filter(d => d.department === dept);
    if (docs?.length) {
      setSelectedDoctorId(docs[0].id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    let patientName = '';
    if (currentRole === 'patient' && currentUser) {
      patientName = currentUser.name;
    } else {
      const selectedPat = data?.patients?.find(p => p.id === patientId);
      patientName = customPatientName.trim() || selectedPat?.name || 'Walk-in Patient';
    }

    setSubmitting(true);
    try {
      await bookAppointment({
        patientId,
        patientName,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.department,
        date,
        timeSlot,
        reason: reason || 'General Consultation',
        fee: selectedDoctor.fee
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:30 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:30 PM'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Book Medical Consultation</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Patient Selection (for Admin or if custom) */}
            {currentRole !== 'patient' ? (
              <div className="form-group">
                <label className="form-label">Select Patient</label>
                <select
                  className="form-control"
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    const p = data?.patients?.find(pat => pat.id === e.target.value);
                    if (p) setCustomPatientName(p.name);
                  }}
                >
                  {data?.patients?.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.gender}, {p.age}y - Blood: {p.bloodGroup})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ 
                background: 'var(--primary-light)', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.25rem',
                border: '1px solid rgba(14, 165, 233, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <User size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Booking for: {currentUser?.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Patient ID: {currentUser?.id} • Blood Group: {currentUser?.bloodGroup}
                  </div>
                </div>
              </div>
            )}

            {/* Department & Doctor Grid */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Medical Department</label>
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Consulting Specialist</label>
                <select
                  className="form-control"
                  value={selectedDoctorId || selectedDoctor?.id}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                >
                  {filteredDoctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — ₹{d.fee}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor Info card */}
            {selectedDoctor && (
              <div style={{ 
                background: 'var(--bg-surface-elevated)', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img 
                    src={selectedDoctor.avatar} 
                    alt={selectedDoctor.name} 
                    style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }} 
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{selectedDoctor.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {selectedDoctor.specialty} • {selectedDoctor.experience} Exp
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>OPD Fee</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                    ₹{selectedDoctor.fee}
                  </div>
                </div>
              </div>
            )}

            {/* Date & Time slots */}
            <div className="form-group">
              <label className="form-label">Appointment Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Time Slots</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`btn btn-sm ${timeSlot === slot ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTimeSlot(slot)}
                  >
                    <Clock size={12} />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reason for consultation */}
            <div className="form-group">
              <label className="form-label">Primary Symptoms / Reason for Visit</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe your health symptoms, discomfort or consultation reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle size={16} />
              <span>{submitting ? 'Confirming...' : 'Confirm Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
