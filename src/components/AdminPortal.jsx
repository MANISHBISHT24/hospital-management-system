import React, { useState } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Bed, 
  CreditCard, 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  UserCheck 
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import AddDoctorModal from './AddDoctorModal';
import AddPatientModal from './AddPatientModal';
import BedModal from './BedModal';
import BookAppointmentModal from './BookAppointmentModal';
import PrescriptionModal from './PrescriptionModal';
import InvoiceModal from './InvoiceModal';

export default function AdminPortal() {
  const { data, updateAppointmentStatus } = useHospital();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'doctors' | 'patients' | 'beds' | 'billing'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showBookApt, setShowBookApt] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [viewPrescription, setViewPrescription] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);

  if (!data) return null;

  // Key KPI metrics calculations
  const totalPatients = data.patients.length;
  const admittedPatients = data.patients.filter(p => p.admitted).length;
  const totalDoctors = data.doctors.length;
  const totalAppointments = data.appointments.length;
  const totalBeds = data.beds.length;
  const occupiedBeds = data.beds.filter(b => b.status === 'Occupied').length;
  const bedOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const totalRevenue = data.bills
    .filter(b => b.status === 'Paid')
    .reduce((sum, b) => sum + b.total, 0);

  const pendingRevenue = data.bills
    .filter(b => b.status === 'Pending')
    .reduce((sum, b) => sum + b.total, 0);

  // Filtered lists
  const filteredPatients = data.patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  const filteredDoctors = data.doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Banner */}
      <div className="portal-header-banner">
        <div className="banner-left">
          <h2>Hospital Operations Central Command</h2>
          <p>
            Real-time administrative governance, doctor rosters, patient records, bed allocation and financial audit.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={() => setShowBookApt(true)}>
            <Calendar size={16} />
            <span>Book Appointment</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowAddDoctor(true)}>
            <Plus size={16} />
            <span>New Doctor</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowAddPatient(true)}>
            <Plus size={16} />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalPatients}</span>
            <span className="stat-title">Patients ({admittedPatients} Admitted)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--accent-teal-light)', color: 'var(--accent-teal)' }}>
            <Stethoscope size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalDoctors}</span>
            <span className="stat-title">Consultant Doctors</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--accent-amber-light)', color: 'var(--accent-amber)' }}>
            <Calendar size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalAppointments}</span>
            <span className="stat-title">Total Consultations</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--accent-rose-light)', color: 'var(--accent-rose)' }}>
            <Bed size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{bedOccupancyRate}%</span>
            <span className="stat-title">Bed Occupancy ({occupiedBeds}/{totalBeds})</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--accent-green-light)', color: 'var(--accent-green)' }}>
            <CreditCard size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
            <span className="stat-title">Revenue (Pending: ₹{pendingRevenue.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={16} />
          <span>Overview & Live Feed</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          <Stethoscope size={16} />
          <span>Doctors Roster ({data.doctors.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          <Users size={16} />
          <span>Patient Registry ({data.patients.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'beds' ? 'active' : ''}`}
          onClick={() => setActiveTab('beds')}
        >
          <Bed size={16} />
          <span>Wards & Bed Matrix ({data.beds.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <CreditCard size={16} />
          <span>Billing & Accounts ({data.bills.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem' }}>
          {/* Recent Appointments queue */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Recent OPD Appointments Queue</h3>
              <span className="badge badge-scheduled">{data.appointments.length} Total</span>
            </div>

            <div className="table-wrapper">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Token / Patient</th>
                    <th>Specialist Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.appointments.slice(0, 7).map(apt => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{apt.patientName}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600 }}>Token: {apt.tokenNumber}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{apt.doctorName}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{apt.department}</div>
                      </td>
                      <td>
                        <div>{apt.date}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{apt.timeSlot}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          apt.status === 'Completed' ? 'badge-completed' :
                          apt.status === 'In Consultation' ? 'badge-consultation' : 'badge-scheduled'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        {apt.status === 'Scheduled' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                          >
                            Call Patient
                          </button>
                        )}
                        {apt.status === 'Completed' && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              const rx = data.prescriptions.find(r => r.appointmentId === apt.id);
                              if (rx) setViewPrescription(rx);
                            }}
                          >
                            <FileText size={13} />
                            <span>View Rx</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Activity Log */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Hospital Event Log</h3>
              <span className="badge badge-scheduled">Live Stream</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.activities.slice(0, 7).map(act => (
                <div 
                  key={act.id} 
                  style={{ 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{act.title}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{act.time}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                    {act.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTORS */}
      {activeTab === 'doctors' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search doctors by name or dept..."
                style={{ paddingLeft: '2.4rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setShowAddDoctor(true)}>
              <Plus size={16} />
              <span>Register Doctor</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredDoctors.map(doc => (
              <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{doc.name}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>{doc.department}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{doc.specialty}</div>
                  </div>
                </div>

                <div style={{ 
                  background: 'var(--bg-surface-elevated)', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Qualification:</span>
                    <div style={{ fontWeight: 600 }}>{doc.qualification}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Experience:</span>
                    <div style={{ fontWeight: 600 }}>{doc.experience}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>OPD Fee:</span>
                    <div style={{ fontWeight: 700, color: 'var(--accent-green)' }}>₹{doc.fee}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Room:</span>
                    <div style={{ fontWeight: 600 }}>{doc.room}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Timings: {doc.timing}</span>
                  <span className="badge badge-available">★ {doc.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PATIENTS */}
      {activeTab === 'patients' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search patient by name, blood, phone..."
                style={{ paddingLeft: '2.4rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setShowAddPatient(true)}>
              <Plus size={16} />
              <span>Register Patient</span>
            </button>
          </div>

          <div className="table-wrapper">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Patient Name & ID</th>
                  <th>Age / Gender</th>
                  <th>Blood Group</th>
                  <th>Vitals (BP / Pulse / Sugar)</th>
                  <th>Allergies</th>
                  <th>Admission Status</th>
                  <th>Emergency Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(pat => (
                  <tr key={pat.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{pat.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>ID: {pat.id} • {pat.phone}</div>
                    </td>
                    <td>{pat.age} yrs / {pat.gender}</td>
                    <td>
                      <span className="badge badge-occupied" style={{ fontSize: '0.78rem' }}>
                        {pat.bloodGroup}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        BP: <strong>{pat.vitals?.bp}</strong> | Pulse: <strong>{pat.vitals?.heartRate}</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        Sugar: {pat.vitals?.sugar}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)' }}>
                        {pat.allergies?.join(', ') || 'None'}
                      </div>
                    </td>
                    <td>
                      {pat.admitted ? (
                        <span className="badge badge-occupied">Admitted: {pat.admittedWard}</span>
                      ) : (
                        <span className="badge badge-available">Outpatient (OPD)</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {pat.emergencyContact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: WARDS & BEDS */}
      {activeTab === 'beds' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Real-time Ward & Bed Matrix</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Click on any bed to admit a patient, discharge, or flag for sanitation/maintenance.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="badge badge-available">Available ({totalBeds - occupiedBeds})</span>
              <span className="badge badge-occupied">Occupied ({occupiedBeds})</span>
            </div>
          </div>

          <div className="bed-grid">
            {data.beds.map(bed => (
              <div 
                key={bed.id} 
                className="bed-card"
                onClick={() => setSelectedBed(bed)}
                style={{ cursor: 'pointer' }}
              >
                <div className="bed-header">
                  <div className="bed-title">{bed.bedNumber}</div>
                  <span className={`badge ${
                    bed.status === 'Available' ? 'badge-available' :
                    bed.status === 'Occupied' ? 'badge-occupied' : 'badge-maintenance'
                  }`}>
                    {bed.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong>{bed.ward}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{bed.floor} • Type: {bed.type}</div>
                </div>

                {bed.status === 'Occupied' ? (
                  <div style={{ 
                    background: 'var(--bg-surface-elevated)', 
                    padding: '0.65rem', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem' 
                  }}>
                    <div style={{ color: 'var(--text-dim)' }}>Patient Admitted:</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{bed.patientName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-rose)' }}>Since: {bed.admittedDate}</div>
                  </div>
                ) : (
                  <div style={{ 
                    background: 'var(--bg-surface-elevated)', 
                    padding: '0.65rem', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    color: 'var(--accent-green)'
                  }}>
                    Ready for Admission • Daily Rate: ₹{bed.dailyRate}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    Manage Bed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BILLING */}
      {activeTab === 'billing' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Hospital Accounts & Billing Ledgers</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Itemized hospital invoices, inpatient stays, pharmacy charges, and payment records.
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Invoice No & Date</th>
                  <th>Patient Name</th>
                  <th>Healthcare Line Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Payment Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.bills.map(bill => (
                  <tr key={bill.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{bill.invoiceNo}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{bill.date}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{bill.patientName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ID: {bill.patientId}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        {bill.items?.map((item, idx) => (
                          <div key={idx}>• {item.name}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{bill.total.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${bill.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {bill.paymentMethod || 'Pending'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewInvoice(bill)}
                      >
                        <Eye size={13} />
                        <span>View / Print Bill</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddDoctor && <AddDoctorModal onClose={() => setShowAddDoctor(false)} />}
      {showAddPatient && <AddPatientModal onClose={() => setShowAddPatient(false)} />}
      {showBookApt && <BookAppointmentModal onClose={() => setShowBookApt(false)} />}
      {selectedBed && <BedModal bed={selectedBed} onClose={() => setSelectedBed(null)} />}
      {viewPrescription && <PrescriptionModal prescription={viewPrescription} onClose={() => setViewPrescription(null)} />}
      {viewInvoice && <InvoiceModal bill={viewInvoice} onClose={() => setViewInvoice(null)} />}
    </div>
  );
}
