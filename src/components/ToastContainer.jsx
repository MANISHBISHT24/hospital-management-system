import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useHospital();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        let className = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          className = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          className = 'toast-error';
        }

        return (
          <div key={toast.id} className={`toast ${className}`}>
            <Icon size={18} strokeWidth={2.4} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
