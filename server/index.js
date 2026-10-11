import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'initialData.json');

// Helper to read data
function getData() {
  if (!fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DATA_FILE, raw, 'utf-8');
    return JSON.parse(raw);
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const raw = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DATA_FILE, raw, 'utf-8');
    return JSON.parse(raw);
  }
}

// Helper to save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper to prepend an activity log
function addActivity(data, title, desc, type = 'general') {
  if (!data.activities) data.activities = [];
  data.activities.unshift({
    id: `act-${Date.now()}`,
    time: 'Just now',
    title,
    desc,
    type
  });
  // Keep last 25 activities
  if (data.activities.length > 25) {
    data.activities = data.activities.slice(0, 25);
  }
}

// 1. Get all data
app.get('/api/data', (req, res) => {
  const data = getData();
  res.json({ success: true, data });
});

// 2. Book appointment
app.post('/api/appointments', (req, res) => {
  const data = getData();
  const { patientId, patientName, doctorId, doctorName, department, date, timeSlot, reason, fee } = req.body;

  if (!patientName || !doctorId || !date || !timeSlot) {
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  }

  const prefix = (department || 'GEN').substring(0, 3).toUpperCase();
  const tokenNumber = `${prefix}-${Math.floor(10 + Math.random() * 90)}`;
  const newAppointment = {
    id: `apt-${Date.now()}`,
    patientId: patientId || `pat-${Date.now()}`,
    patientName,
    doctorId,
    doctorName,
    department: department || 'General Medicine',
    date,
    timeSlot,
    status: 'Scheduled',
    reason: reason || 'General Consultation',
    tokenNumber,
    fee: Number(fee) || 1000,
    createdAt: new Date().toISOString()
  };

  data.appointments.unshift(newAppointment);
  addActivity(data, 'New Appointment Booked', `${patientName} scheduled with ${doctorName} on ${date} (${timeSlot}).`, 'appointment');
  saveData(data);

  res.status(201).json({ success: true, appointment: newAppointment });
});

// 3. Update appointment status
app.patch('/api/appointments/:id', (req, res) => {
  const data = getData();
  const { id } = req.params;
  const { status } = req.body;

  const aptIndex = data.appointments.findIndex(a => a.id === id);
  if (aptIndex === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  data.appointments[aptIndex].status = status;
  addActivity(
    data,
    'Appointment Status Updated',
    `${data.appointments[aptIndex].patientName}'s appointment marked as ${status}.`,
    'appointment'
  );
  saveData(data);

  res.json({ success: true, appointment: data.appointments[aptIndex] });
});

// 4. Create prescription
app.post('/api/prescriptions', (req, res) => {
  const data = getData();
  const { appointmentId, patientId, patientName, doctorId, doctorName, diagnosis, medicines, labTests, advice, followUpDate } = req.body;

  const newPrescription = {
    id: `rx-${Date.now()}`,
    appointmentId: appointmentId || null,
    patientId: patientId || 'pat-general',
    patientName: patientName || 'Patient',
    doctorId: doctorId || 'doc-1',
    doctorName: doctorName || 'Attending Physician',
    date: new Date().toISOString().split('T')[0],
    diagnosis: diagnosis || 'General Health Consultation',
    medicines: medicines || [],
    labTests: labTests || [],
    advice: advice || 'Take adequate rest and follow hydration.',
    followUpDate: followUpDate || ''
  };

  if (!data.prescriptions) data.prescriptions = [];
  data.prescriptions.unshift(newPrescription);

  // If tied to an appointment, mark it completed
  if (appointmentId) {
    const apt = data.appointments.find(a => a.id === appointmentId);
    if (apt) {
      apt.status = 'Completed';
    }
  }

  addActivity(
    data,
    'Prescription Generated',
    `${doctorName} created prescription for ${patientName} (${diagnosis}).`,
    'prescription'
  );
  saveData(data);

  res.status(201).json({ success: true, prescription: newPrescription });
});

// 5. Add doctor
app.post('/api/doctors', (req, res) => {
  const data = getData();
  const newDoctor = {
    id: `doc-${Date.now()}`,
    ...req.body,
    rating: 5.0,
    patientsTreated: 0,
    status: 'Available'
  };

  data.doctors.push(newDoctor);
  addActivity(data, 'New Doctor Added', `${newDoctor.name} joined ${newDoctor.department} department.`, 'doctor');
  saveData(data);

  res.status(201).json({ success: true, doctor: newDoctor });
});

// 6. Register patient
app.post('/api/patients', (req, res) => {
  const data = getData();
  const newPatient = {
    id: `pat-${Date.now()}`,
    ...req.body,
    admitted: false,
    admittedWard: null,
    totalVisits: 1,
    vitals: req.body.vitals || {
      bp: '120/80 mmHg',
      heartRate: '72 bpm',
      temp: '98.6 °F',
      sugar: '95 mg/dL',
      weight: '65 kg',
      height: '170 cm'
    }
  };

  data.patients.unshift(newPatient);
  addActivity(data, 'New Patient Registered', `${newPatient.name} added to hospital records.`, 'patient');
  saveData(data);

  res.status(201).json({ success: true, patient: newPatient });
});

// 7. Update Bed status (admit / discharge / maintenance)
app.patch('/api/beds/:id', (req, res) => {
  const data = getData();
  const { id } = req.params;
  const { status, patientId, patientName } = req.body;

  const bed = data.beds.find(b => b.id === id);
  if (!bed) {
    return res.status(404).json({ success: false, message: 'Bed not found' });
  }

  bed.status = status;
  if (status === 'Occupied') {
    bed.patientId = patientId;
    bed.patientName = patientName;
    bed.admittedDate = new Date().toISOString().split('T')[0];

    // also update patient admitted status if patient exists
    const pat = data.patients.find(p => p.id === patientId);
    if (pat) {
      pat.admitted = true;
      pat.admittedWard = bed.bedNumber;
    }
    addActivity(data, 'Bed Allocated', `${bed.bedNumber} allocated to ${patientName}.`, 'bed');
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
    addActivity(data, 'Bed Status Changed', `${bed.bedNumber} is now ${status}.`, 'bed');
  }

  saveData(data);
  res.json({ success: true, bed });
});

// 8. Mark Bill Paid
app.patch('/api/bills/:id/pay', (req, res) => {
  const data = getData();
  const { id } = req.params;
  const { paymentMethod } = req.body;

  const bill = data.bills.find(b => b.id === id);
  if (!bill) {
    return res.status(404).json({ success: false, message: 'Bill not found' });
  }

  bill.status = 'Paid';
  bill.paymentMethod = paymentMethod || 'Online Transfer';
  bill.paidAt = new Date().toISOString();

  addActivity(data, 'Bill Settled', `Invoice ${bill.invoiceNo} (₹${bill.total}) marked as Paid.`, 'billing');
  saveData(data);

  res.json({ success: true, bill });
});

// 9. Reset to initial data
app.post('/api/reset', (req, res) => {
  const raw = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
  fs.writeFileSync(DATA_FILE, raw, 'utf-8');
  const data = JSON.parse(raw);
  res.json({ success: true, data, message: 'Database reset to initial sample records' });
});

app.listen(PORT, () => {
  console.log(`🏥 PulseCare HMS Server running at http://localhost:${PORT}`);
});
