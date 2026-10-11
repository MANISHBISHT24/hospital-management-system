import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const HospitalContext = createContext(null);

export function HospitalProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin' | 'doctor' | 'patient'
  const [currentUserId, setCurrentUserId] = useState('doc-1');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pulsecare_theme') || 'dark';
  });
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
    } catch (err) {
      console.error('Error loading HMS data:', err);
      addToast('Error loading records', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pulsecare_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Determine current user object based on role & id
  const getCurrentUser = () => {
    if (!data) return null;
    if (currentRole === 'admin') {
      return { id: 'admin-1', name: 'Dr. Arvind Mehra', roleTitle: 'Hospital Administrator', email: 'admin@pulsecare.org' };
    }
    if (currentRole === 'doctor') {
      return data.doctors.find(d => d.id === currentUserId) || data.doctors[0];
    }
    if (currentRole === 'patient') {
      return data.patients.find(p => p.id === currentUserId) || data.patients[0];
    }
    return null;
  };

  // Switch role with proper default currentUserId
  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'doctor' && data?.doctors?.length) {
      setCurrentUserId(data.doctors[0].id);
    } else if (role === 'patient' && data?.patients?.length) {
      setCurrentUserId(data.patients[0].id);
    }
  };

  // Action: Book Appointment
  const bookAppointment = async (appointmentData) => {
    try {
      const newApt = await api.bookAppointment(appointmentData);
      setData(prev => {
        if (!prev) return prev;
        const exists = prev.appointments.some(a => a.id === newApt.id);
        const updatedApts = exists ? prev.appointments : [newApt, ...prev.appointments];
        return {
          ...prev,
          appointments: updatedApts,
          activities: [
            {
              id: `act-${Date.now()}`,
              time: 'Just now',
              title: 'New Appointment Booked',
              desc: `${newApt.patientName} scheduled with ${newApt.doctorName}. Token: ${newApt.tokenNumber}`,
              type: 'appointment'
            },
            ...prev.activities
          ]
        };
      });
      addToast(`Appointment scheduled! Token: ${newApt.tokenNumber}`, 'success');
      return newApt;
    } catch (err) {
      console.error(err);
      addToast('Failed to book appointment', 'error');
      throw err;
    }
  };

  // Action: Update Appointment Status
  const updateAppointmentStatus = async (id, status) => {
    try {
      const updated = await api.updateAppointmentStatus(id, status);
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
        };
      });
      addToast(`Appointment marked as ${status}`, 'success');
      return updated;
    } catch (err) {
      console.error(err);
      addToast('Failed to update appointment', 'error');
      throw err;
    }
  };

  // Action: Save Prescription
  const savePrescription = async (prescriptionData) => {
    try {
      const newRx = await api.savePrescription(prescriptionData);
      setData(prev => {
        if (!prev) return prev;
        const updatedApts = prescriptionData.appointmentId
          ? prev.appointments.map(a => a.id === prescriptionData.appointmentId ? { ...a, status: 'Completed' } : a)
          : prev.appointments;
        return {
          ...prev,
          prescriptions: [newRx, ...prev.prescriptions],
          appointments: updatedApts,
          activities: [
            {
              id: `act-${Date.now()}`,
              time: 'Just now',
              title: 'Prescription Issued',
              desc: `${newRx.doctorName} generated Rx for ${newRx.patientName}.`,
              type: 'prescription'
            },
            ...prev.activities
          ]
        };
      });
      addToast(`Prescription saved and sent to patient records!`, 'success');
      return newRx;
    } catch (err) {
      console.error(err);
      addToast('Failed to save prescription', 'error');
      throw err;
    }
  };

  // Action: Add Doctor
  const addDoctor = async (doctorData) => {
    try {
      const newDoc = await api.addDoctor(doctorData);
      setData(prev => ({
        ...prev,
        doctors: [...prev.doctors, newDoc]
      }));
      addToast(`Dr. ${doctorData.name} successfully registered`, 'success');
      return newDoc;
    } catch (err) {
      console.error(err);
      addToast('Failed to add doctor', 'error');
      throw err;
    }
  };

  // Action: Register Patient
  const registerPatient = async (patientData) => {
    try {
      const newPat = await api.registerPatient(patientData);
      setData(prev => ({
        ...prev,
        patients: [newPat, ...prev.patients]
      }));
      addToast(`Patient ${patientData.name} registered successfully!`, 'success');
      return newPat;
    } catch (err) {
      console.error(err);
      addToast('Failed to register patient', 'error');
      throw err;
    }
  };

  // Action: Update Bed Status
  const updateBedStatus = async (bedId, params) => {
    try {
      const updatedBed = await api.updateBedStatus(bedId, params);
      setData(prev => {
        if (!prev) return prev;
        const newBeds = prev.beds.map(b => b.id === bedId ? updatedBed : b);
        let newPatients = [...prev.patients];
        if (params.status === 'Occupied' && params.patientId) {
          newPatients = newPatients.map(p => p.id === params.patientId ? { ...p, admitted: true, admittedWard: updatedBed.bedNumber } : p);
        } else if (params.status === 'Available') {
          newPatients = newPatients.map(p => p.admittedWard === updatedBed.bedNumber ? { ...p, admitted: false, admittedWard: null } : p);
        }
        return {
          ...prev,
          beds: newBeds,
          patients: newPatients
        };
      });
      addToast(`Bed ${updatedBed.bedNumber} updated to ${params.status}`, 'success');
      return updatedBed;
    } catch (err) {
      console.error(err);
      addToast('Failed to update bed status', 'error');
      throw err;
    }
  };

  // Action: Pay Bill
  const payBill = async (billId, paymentMethod) => {
    try {
      const updatedBill = await api.payBill(billId, paymentMethod);
      setData(prev => ({
        ...prev,
        bills: prev.bills.map(b => b.id === billId ? updatedBill : b)
      }));
      addToast(`Payment received for invoice ${updatedBill.invoiceNo}!`, 'success');
      return updatedBill;
    } catch (err) {
      console.error(err);
      addToast('Failed to process payment', 'error');
      throw err;
    }
  };

  // Action: Reset Data
  const resetData = async () => {
    try {
      const freshData = await api.resetData();
      setData(freshData);
      addToast('All demo records reset to default hospital state', 'info');
    } catch (err) {
      console.error(err);
      addToast('Failed to reset data', 'error');
    }
  };

  const currentUser = getCurrentUser();

  const value = {
    data,
    loading,
    currentRole,
    switchRole,
    currentUser,
    currentUserId,
    setCurrentUserId,
    theme,
    toggleTheme,
    toasts,
    addToast,
    removeToast,
    bookAppointment,
    updateAppointmentStatus,
    savePrescription,
    addDoctor,
    registerPatient,
    updateBedStatus,
    payBill,
    resetData,
    refreshData: loadData
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
