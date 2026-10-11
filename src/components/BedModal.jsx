import React, { useState } from 'react';
import { X, Bed, CheckCircle, UserX, AlertCircle } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function BedModal({ bed, onClose }) {
  const { data, updateBedStatus } = useHospital();

  const [status, setStatus] = useState(bed?.status || 'Available');
  const [patientId, setPatientId] = useState(bed?.patientId || data?.patients?.[0]?.id || '');
  const [submitting, setSubmitting] = useState(false);

  if (!bed) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let patientName = null;
      if (status === 'Occupied') {
        const pat = data?.patients?.find(p => p.id === patientId);
        patientName = pat ? pat.name : 'Admitted Patient';
      }

      await updateBedStatus(bed.id, {
        status,
        patientId: status === 'Occupied' ? patientId : null,
        patientName: status === 'Occupied' ? patientName : null
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bed size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Manage Bed: {bed.bedNumber}</h3>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ 
              background: 'var(--bg-surface-elevated)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1.25rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{bed.ward} ({bed.floor})</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Type: {bed.type} • Daily Tariff: ₹{bed.dailyRate.toLocaleString()}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bed Status</label>
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Available">Available (Vacant & Ready)</option>
                <option value="Occupied">Occupied (Admit Patient)</option>
                <option value="Maintenance">Maintenance / Sanitization</option>
              </select>
            </div>

            {status === 'Occupied' && (
              <div className="form-group">
                <label className="form-label">Assign Patient</label>
                <select
                  className="form-control"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                >
                  {data?.patients?.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y - Blood: {p.bloodGroup})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {bed.status === 'Occupied' && status === 'Available' && (
              <div style={{ 
                background: 'rgba(244, 63, 94, 0.1)', 
                padding: '0.85rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid rgba(244, 63, 94, 0.25)',
                display: 'flex',
                gap: '0.5rem',
                fontSize: '0.82rem',
                color: 'var(--accent-rose)'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>Marking this bed available will formally discharge <strong>{bed.patientName}</strong> from this ward.</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle size={16} />
              <span>{submitting ? 'Updating...' : 'Update Bed Allocation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
