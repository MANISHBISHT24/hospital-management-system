import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import Navbar from './components/Navbar';
import AdminPortal from './components/AdminPortal';
import DoctorPortal from './components/DoctorPortal';
import PatientPortal from './components/PatientPortal';
import ToastContainer from './components/ToastContainer';
import { Activity, Heart, Shield, PhoneCall } from 'lucide-react';

function HospitalDashboard() {
  const { currentRole, loading, data } = useHospital();

  if (loading || !data) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse-glow 1.5s infinite ease-in-out'
        }}>
          <Activity size={32} />
        </div>
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Hospital Management Records...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {currentRole === 'admin' && <AdminPortal />}
        {currentRole === 'doctor' && <DoctorPortal />}
        {currentRole === 'patient' && <PatientPortal />}
      </main>

      {/* College Project Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
        padding: '1.5rem',
        marginTop: 'auto',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} color="var(--primary)" />
            <strong style={{ color: 'var(--text-main)' }}>PulseCare HMS</strong>
            <span>• Super-Speciality Hospital Management System</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Emergency 24x7: <strong style={{ color: 'var(--accent-rose)' }}>1066 / +91 (11) 4890-7000</strong></span>
            <span>Accredited: <strong style={{ color: 'var(--accent-green)' }}>NABH & JCI Certified</strong></span>
          </div>

          <div>
            College Academic Project Prototype • React 19 + Express.js + Vite
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <HospitalProvider>
      <HospitalDashboard />
    </HospitalProvider>
  );
}
