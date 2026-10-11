import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  User, 
  Activity, 
  AlertCircle, 
  Pill, 
  Eye, 
  HeartPulse 
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import ConsultationModal from './ConsultationModal';
import PrescriptionModal from './PrescriptionModal';

export default function DoctorPortal() {
  const { data, currentUser, updateAppointmentStatus } = useHospital();

  const [filterStatus, setFilterStatus] = useState('All');
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [viewPrescription, setViewPrescription] = useState(null);

  if (!data || !currentUser) return null;

  // Appointments for this doctor
  const doctorAppointments = data.appointments.filter(a => a.doctorId === currentUser.id);

  const filteredAppointments = doctorAppointments.filter(a => {
    if (filterStatus === 'All') return true;
    return a.status === filterStatus;
  });

  const waitingCount = doctorAppointments.filter(a => a.status === 'Scheduled').length;
  const inProgressCount = doctorAppointments.filter(a => a.status === 'In Consultation').length;
  const completedCount = doctorAppointments.filter(a => a.status === 'Completed').length;

  // Prescriptions issued by this doctor
  const doctorPrescriptions = data.prescriptions.filter(p => p.doctorId === currentUser.id);

  return (
    <div>
      {/* Doctor Header Banner */}
      <div className="portal-header-banner">
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ 
              width: '90px', 
              height: '90px', 
              borderRadius: 'var(--radius-lg)', 
              objectFit: 'cover', 
              border: '3px solid var(--primary)',
              boxShadow: 'var(--shadow-glow)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2>{currentUser.name}</h2>
              <span className="badge badge-scheduled" style={{ fontSize: '0.78rem' }}>
                {currentUser.department}
              </span>
            </div>
            <p style={{ margin: '0.2rem 0', fontWeight: 600, color: 'var(--primary)' }}>
              {currentUser.specialty} • {currentUser.qualification}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {currentUser.room} • OPD Hours: {currentUser.timing} • Experience: {currentUser.experience}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', textAlign: 'right' }}>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {waitingCount}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Waiting in Queue
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)' }}>
              {completedCount}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Consulted Today
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
              ★ {currentUser.rating}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Doctor Rating
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue on Left, Prescriptions on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem' }}>
        {/* Left: Patient Queue */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Consultation OPD Queue</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage waiting patients, review symptoms, and issue digital prescriptions.
              </p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['All', 'Scheduled', 'In Consultation', 'Completed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilterStatus(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredAppointments.map((apt) => {
              const pat = data.patients.find(p => p.id === apt.patientId);

              return (
                <div
                  key={apt.id}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      lineHeight: 1.1
                    }}>
                      <span>TOKEN</span>
                      <span style={{ fontSize: '0.9rem' }}>{apt.tokenNumber.split('-')[1]}</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{apt.patientName}</h4>
                        <span className={`badge ${
                          apt.status === 'Completed' ? 'badge-completed' :
                          apt.status === 'In Consultation' ? 'badge-consultation' : 'badge-scheduled'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {pat ? `${pat.age}y / ${pat.gender} • Blood: ${pat.bloodGroup}` : 'Outpatient'} • Slot: <strong>{apt.timeSlot}</strong> ({apt.date})
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '0.35rem', background: 'var(--bg-surface)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
                        <strong>Reason:</strong> {apt.reason}
                      </div>

                      {pat?.vitals && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.3rem', display: 'flex', gap: '0.8rem' }}>
                          <span>BP: {pat.vitals.bp}</span>
                          <span>Pulse: {pat.vitals.heartRate}</span>
                          <span>Sugar: {pat.vitals.sugar}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                    {apt.status !== 'Completed' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveConsultation(apt)}
                      >
                        <Stethoscope size={15} />
                        <span>Start Consultation</span>
                      </button>
                    )}

                    {apt.status === 'Completed' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const rx = data.prescriptions.find(r => r.appointmentId === apt.id);
                          if (rx) setViewPrescription(rx);
                        }}
                      >
                        <FileText size={15} />
                        <span>View Rx Slip</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredAppointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No appointments in this category right now.
              </div>
            )}
          </div>
        </div>

        {/* Right: Issued Prescriptions History */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>My Clinical Prescriptions</h3>
            <span className="badge badge-completed">{doctorPrescriptions.length} Issued</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {doctorPrescriptions.map((rx) => (
              <div
                key={rx.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {rx.patientName}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Date: {rx.date} • Rx #{rx.id}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setViewPrescription(rx)}
                  >
                    <Eye size={13} />
                    <span>View / Print</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Diagnosis: {rx.diagnosis}
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Medications ({rx.medicines?.length || 0}): {rx.medicines?.map(m => m.name).join(', ')}
                </div>
              </div>
            ))}

            {doctorPrescriptions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                No prescriptions issued yet today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {activeConsultation && (
        <ConsultationModal
          appointment={activeConsultation}
          onClose={() => setActiveConsultation(null)}
          onPrescriptionCreated={(newRx) => setViewPrescription(newRx)}
        />
      )}

      {/* Prescription Preview Modal */}
      {viewPrescription && (
        <PrescriptionModal
          prescription={viewPrescription}
          onClose={() => setViewPrescription(null)}
        />
      )}
    </div>
  );
}
