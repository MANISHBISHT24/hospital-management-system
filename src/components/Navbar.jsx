import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Stethoscope, 
  User, 
  Sun, 
  Moon, 
  RotateCcw, 
  Bed, 
  ChevronDown 
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function Navbar() {
  const { 
    currentRole, 
    switchRole, 
    currentUser, 
    currentUserId, 
    setCurrentUserId, 
    data, 
    theme, 
    toggleTheme, 
    resetData 
  } = useHospital();

  const availableBeds = data?.beds?.filter(b => b.status === 'Available').length || 0;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="brand-section" onClick={() => switchRole('admin')}>
          <div className="brand-logo-icon">
            <Activity size={24} strokeWidth={2.6} />
          </div>
          <div className="brand-text">
            <h1>PulseCare HMS</h1>
            <p>Smart Hospital Portal</p>
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className="role-switcher-container">
          <button
            type="button"
            className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`}
            onClick={() => switchRole('admin')}
          >
            <ShieldCheck size={16} />
            <span>Admin Portal</span>
          </button>

          <button
            type="button"
            className={`role-btn ${currentRole === 'doctor' ? 'active' : ''}`}
            onClick={() => switchRole('doctor')}
          >
            <Stethoscope size={16} />
            <span>Doctor Portal</span>
          </button>

          <button
            type="button"
            className={`role-btn ${currentRole === 'patient' ? 'active' : ''}`}
            onClick={() => switchRole('patient')}
          >
            <User size={16} />
            <span>Patient Portal</span>
          </button>
        </div>

        {/* Right Actions & Active Persona Switcher */}
        <div className="nav-actions">
          {/* Persona selector when Doctor or Patient */}
          {currentRole === 'doctor' && data?.doctors && (
            <div style={{ position: 'relative' }}>
              <select
                className="form-control"
                style={{
                  padding: '0.4rem 2rem 0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  appearance: 'none',
                  cursor: 'pointer'
                }}
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
              >
                {data.doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.department})
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={14} 
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} 
              />
            </div>
          )}

          {currentRole === 'patient' && data?.patients && (
            <div style={{ position: 'relative' }}>
              <select
                className="form-control"
                style={{
                  padding: '0.4rem 2rem 0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  appearance: 'none',
                  cursor: 'pointer'
                }}
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
              >
                {data.patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.gender}, {p.age}y - {p.bloodGroup})
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={14} 
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} 
              />
            </div>
          )}

          {/* Quick Bed Availability Indicator */}
          <div 
            title="Live Bed Availability"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: availableBeds > 0 ? 'var(--accent-green)' : 'var(--accent-rose)'
            }}
          >
            <Bed size={14} />
            <span>{availableBeds} Beds Vacant</span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Reset Demo Data button */}
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              if (window.confirm('Reset all demo hospital records (doctors, appointments, patients) to initial state?')) {
                resetData();
              }
            }}
            title="Reset Sample Hospital Data"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
