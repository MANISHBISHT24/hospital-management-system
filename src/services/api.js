import initialData from '../../server/initialData.json';

const STORAGE_KEY = 'pulsecare_hms_data_v1';

// Initialize localStorage fallback if empty
function getLocalFallback() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return JSON.parse(JSON.stringify(initialData));
}

function saveLocalFallback(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// API Service with seamless backend + localStorage offline fallback
export const api = {
  // 1. Fetch all data
  async getData() {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        saveLocalFallback(json.data);
        return json.data;
      }
    } catch {
      // Backend not running, use fallback
    }
    return getLocalFallback();
  },

  // 2. Book appointment
  async bookAppointment(appointmentData) {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.appointment;
      }
    } catch {
      // Backend offline fallback
    }

    const data = getLocalFallback();
    const prefix = (appointmentData.department || 'GEN').substring(0, 3).toUpperCase();
    const tokenNumber = `${prefix}-${Math.floor(10 + Math.random() * 90)}`;
    const newAppointment = {
      id: `apt-${Date.now()}`,
      patientId: appointmentData.patientId || `pat-${Date.now()}`,
      patientName: appointmentData.patientName,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      department: appointmentData.department || 'General Medicine',
      date: appointmentData.date,
      timeSlot: appointmentData.timeSlot,
      status: 'Scheduled',
      reason: appointmentData.reason || 'General Consultation',
      tokenNumber,
      fee: Number(appointmentData.fee) || 1000,
      createdAt: new Date().toISOString()
    };

    data.appointments.unshift(newAppointment);
    data.activities.unshift({
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: 'New Appointment Booked',
      desc: `${newAppointment.patientName} scheduled with ${newAppointment.doctorName}.`,
      type: 'appointment'
    });
    saveLocalFallback(data);
    return newAppointment;
  },

  // 3. Update appointment status
  async updateAppointmentStatus(id, status) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.appointment;
      }
    } catch {
      // Backend offline fallback
    }

    const data = getLocalFallback();
    const apt = data.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      data.activities.unshift({
        id: `act-${Date.now()}`,
        time: 'Just now',
        title: 'Appointment Status Updated',
        desc: `${apt.patientName}'s appointment marked as ${status}.`,
        type: 'appointment'
      });
      saveLocalFallback(data);
      return apt;
    }
    throw new Error('Appointment not found');
  },

  // 4. Save prescription
  async savePrescription(prescriptionData) {
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.prescription;
      }
    } catch {
      // Backend offline fallback
    }

    const data = getLocalFallback();
    const newPrescription = {
      id: `rx-${Date.now()}`,
      appointmentId: prescriptionData.appointmentId || null,
      patientId: prescriptionData.patientId || 'pat-general',
      patientName: prescriptionData.patientName || 'Patient',
      doctorId: prescriptionData.doctorId || 'doc-1',
      doctorName: prescriptionData.doctorName || 'Attending Physician',
      date: new Date().toISOString().split('T')[0],
      diagnosis: prescriptionData.diagnosis || 'General Health Consultation',
      medicines: prescriptionData.medicines || [],
      labTests: prescriptionData.labTests || [],
      advice: prescriptionData.advice || 'Adequate rest and hydration.',
      followUpDate: prescriptionData.followUpDate || ''
    };

    if (!data.prescriptions) data.prescriptions = [];
    data.prescriptions.unshift(newPrescription);

    if (prescriptionData.appointmentId) {
      const apt = data.appointments.find(a => a.id === prescriptionData.appointmentId);
      if (apt) {
        apt.status = 'Completed';
      }
    }

    data.activities.unshift({
      id: `act-${Date.now()}`,
      time: 'Just now',
      title: 'Prescription Generated',
      desc: `${newPrescription.doctorName} prescribed for ${newPrescription.patientName}.`,
      type: 'prescription'
    });

    saveLocalFallback(data);
    return newPrescription;
  },

  // 5. Add doctor
  async addDoctor(doctorData) {
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.doctor;
      }
    } catch {
      // Fallback
    }

    const data = getLocalFallback();
    const newDoctor = {
      id: `doc-${Date.now()}`,
      ...doctorData,
      rating: 5.0,
      patientsTreated: 0,
      status: 'Available'
    };
    data.doctors.push(newDoctor);
    saveLocalFallback(data);
    return newDoctor;
  },

  // 6. Register patient
  async registerPatient(patientData) {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.patient;
      }
    } catch {
      // Fallback
    }

    const data = getLocalFallback();
    const newPatient = {
      id: `pat-${Date.now()}`,
      ...patientData,
      admitted: false,
      admittedWard: null,
      totalVisits: 1,
      vitals: patientData.vitals || {
        bp: '120/80 mmHg',
        heartRate: '72 bpm',
        temp: '98.6 °F',
        sugar: '95 mg/dL',
        weight: '65 kg',
        height: '170 cm'
      }
    };
    data.patients.unshift(newPatient);
    saveLocalFallback(data);
    return newPatient;
  },

  // 7. Update bed status
  async updateBedStatus(bedId, { status, patientId, patientName }) {
    try {
      const res = await fetch(`/api/beds/${bedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, patientId, patientName }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.bed;
      }
    } catch {
      // Fallback
    }

    const data = getLocalFallback();
    const bed = data.beds.find(b => b.id === bedId);
    if (bed) {
      bed.status = status;
      if (status === 'Occupied') {
        bed.patientId = patientId;
        bed.patientName = patientName;
        bed.admittedDate = new Date().toISOString().split('T')[0];
        const pat = data.patients.find(p => p.id === patientId);
        if (pat) {
          pat.admitted = true;
          pat.admittedWard = bed.bedNumber;
        }
      } else {
        if (bed.patientId) {
          const pat = data.patients.find(p => p.id === bed.patientId);
          if (pat) {
            pat.admitted = false;
            pat.admittedWard = null;
          }
        }
        bed.patientId = null;
        bed.patientName = null;
        bed.admittedDate = null;
      }
      saveLocalFallback(data);
      return bed;
    }
    throw new Error('Bed not found');
  },

  // 8. Pay bill
  async payBill(billId, paymentMethod = 'UPI / Online') {
    try {
      const res = await fetch(`/api/bills/${billId}/pay`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.bill;
      }
    } catch {
      // Fallback
    }

    const data = getLocalFallback();
    const bill = data.bills.find(b => b.id === billId);
    if (bill) {
      bill.status = 'Paid';
      bill.paymentMethod = paymentMethod;
      bill.paidAt = new Date().toISOString();
      saveLocalFallback(data);
      return bill;
    }
    throw new Error('Bill not found');
  },

  // 9. Reset data
  async resetData() {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        saveLocalFallback(json.data);
        return json.data;
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return JSON.parse(JSON.stringify(initialData));
  }
};
