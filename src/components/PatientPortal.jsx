import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Pill, 
  CreditCard, 
  HeartPulse, 
  Activity, 
  FileText, 
  Plus, 
  Eye, 
  Printer, 
  ShieldAlert, 
  PhoneCall, 
  Clock 
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import BookAppointmentModal from './BookAppointmentModal';
import PrescriptionModal from './PrescriptionModal';
import InvoiceModal from './InvoiceModal';

export default function PatientPortal() {
  const { data, currentUser } = useHospital();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'prescriptions' | 'bills'
  const [showBookModal, setShowBookModal] = useState(false);
  const [viewPrescription, setViewPrescription] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);

  if (!data || !currentUser) return null;

  // Filter appointments for this patient
  const myAppointments = data.appointments.filter(a => a.patientId === currentUser.id);

  // Filter prescriptions for this patient
  const myPrescriptions = data.prescriptions.filter(p => p.patientId === currentUser.id);

  // Filter bills for this patient
  const myBills = data.bills.filter(b => b.patientId === currentUser.id);

  return (
    <div>
      {/* Patient Digital Health Card Banner */}
      <div className="portal-header-banner">
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)'
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2>{currentUser.name}</h2>
              <span className="badge badge-occupied" style={{ fontSize: '0.78rem' }}>
                Blood: {currentUser.bloodGroup}
              </span>
              {currentUser.admitted && (
                <span className="badge badge-consultation">
                  Admitted: {currentUser.admittedWard}
                </span>
              )}
            </div>
            <p style={{ margin: '0.2rem 0', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Patient ID: <strong>{currentUser.id}</strong> • Age: {currentUser.age} yrs • Gender: {currentUser.gender}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Phone: {currentUser.phone} • Emergency Contact: {currentUser.emergencyContact}
            </p>
          </div>
        </div>

        <div>
          <button type="button" className="btn btn-primary" onClick={() => setShowBookModal(true)}>
            <Plus size={16} />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Patient Vitals Tracker Cards */}
      {currentUser.vitals && (
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--accent-rose-light)', color: 'var(--accent-rose)' }}>
              <HeartPulse size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{currentUser.vitals.bp}</span>
              <span className="stat-title">Blood Pressure</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Activity size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{currentUser.vitals.heartRate}</span>
              <span className="stat-title">Pulse / Heart Rate</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--accent-amber-light)', color: 'var(--accent-amber)' }}>
              <Activity size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{currentUser.vitals.sugar}</span>
              <span className="stat-title">Blood Sugar (Fasting)</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--accent-teal-light)', color: 'var(--accent-teal)' }}>
              <ShieldAlert size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value" style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>
                {currentUser.allergies?.join(', ') || 'None'}
              </span>
              <span className="stat-title">Known Allergies</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={16} />
          <span>My Appointments ({myAppointments.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          <Pill size={16} />
          <span>Digital Prescriptions ({myPrescriptions.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveTab('bills')}
        >
          <CreditCard size={16} />
          <span>Hospital Invoices & Payments ({myBills.length})</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>My Scheduled & Past Consultations</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowBookModal(true)}>
              <Plus size={14} />
              <span>Book Appointment</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myAppointments.map(apt => (
              <div
                key={apt.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
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
                    fontSize: '0.78rem'
                  }}>
                    <span>TOKEN</span>
                    <span style={{ fontSize: '0.9rem' }}>{apt.tokenNumber.split('-')[1]}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{apt.doctorName}</h4>
                      <span className="badge badge-scheduled">{apt.department}</span>
                      <span className={`badge ${
                        apt.status === 'Completed' ? 'badge-completed' :
                        apt.status === 'In Consultation' ? 'badge-consultation' : 'badge-scheduled'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Consultation Date: <strong>{apt.date}</strong> at <strong>{apt.timeSlot}</strong> • OPD Fee: ₹{apt.fee}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.3rem' }}>
                      <strong>Symptoms:</strong> {apt.reason}
                    </div>
                  </div>
                </div>

                <div>
                  {apt.status === 'Completed' ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        const rx = data.prescriptions.find(r => r.appointmentId === apt.id);
                        if (rx) setViewPrescription(rx);
                      }}
                    >
                      <FileText size={14} />
                      <span>View & Print Rx</span>
                    </button>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                      Waiting for Doctor Call
                    </div>
                  )}
                </div>
              </div>
            ))}

            {myAppointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                You have no appointments currently. Click "Book New Appointment" to schedule one!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>My Prescriptions & Medication Plans</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {myPrescriptions.map(rx => (
              <div
                key={rx.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{rx.doctorName}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Date: {rx.date} • Rx #{rx.id}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setViewPrescription(rx)}
                  >
                    <Eye size={13} />
                    <span>View Slip</span>
                  </button>
                </div>

                <div style={{ 
                  background: 'var(--primary-light)', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '0.85rem',
                  color: 'var(--primary)',
                  fontWeight: 700 
                }}>
                  Diagnosis: {rx.diagnosis}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    Medicines ({rx.medicines?.length || 0})
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-main)', margin: 0 }}>
                    {rx.medicines?.map((m, idx) => (
                      <li key={idx}>
                        <strong>{m.name}</strong> — {m.dosage} ({m.timing})
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <strong>Doctor Advice:</strong> {rx.advice}
                </div>
              </div>
            ))}

            {myPrescriptions.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No digital prescriptions found in your account yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BILLS */}
      {activeTab === 'bills' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>My Medical Bills & Payments</h3>
          </div>

          <div className="table-wrapper">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Invoice No & Date</th>
                  <th>Healthcare Particulars</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myBills.map(bill => (
                  <tr key={bill.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{bill.invoiceNo}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{bill.date}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        {bill.items?.map((item, idx) => (
                          <div key={idx}>• {item.name}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{bill.total.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${bill.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewInvoice(bill)}
                      >
                        <Eye size={13} />
                        <span>{bill.status === 'Paid' ? 'Receipt' : 'Pay Online'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {myBills.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No bills generated for your account yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showBookModal && <BookAppointmentModal onClose={() => setShowBookModal(false)} />}
      {viewPrescription && <PrescriptionModal prescription={viewPrescription} onClose={() => setViewPrescription(null)} />}
      {viewInvoice && <InvoiceModal bill={viewInvoice} onClose={() => setViewInvoice(null)} />}
    </div>
  );
}
