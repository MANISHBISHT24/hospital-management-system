# 🏥 PulseCare HMS — Smart Hospital Management System

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Academic Project](https://img.shields.io/badge/Type-College%20Major%20Project-blueviolet)]()

> **PulseCare HMS** is a modern, full-stack, role-based healthcare operations and hospital management portal designed for hospital administrators, specialist physicians, and patients. Built with **React 19**, **Express.js**, **Vanilla CSS Design System**, and **Vite**.

---

## 🌟 Key Features & Role-Based Portals

### 1. 🛡️ Hospital Administrator Portal
- **Operational KPI Dashboard:** Live metrics tracking Total Patients, Admitted Cases, Specialist Doctors, Active Consultations, Bed Occupancy %, and Financial Turnover.
- **Doctor Roster Management:** Onboard doctors, assign medical departments (Cardiology, Orthopedics, Pediatrics, Neurology, etc.), schedule OPD hours, and consultation fees.
- **Patient Registry:** Comprehensive patient directory featuring live triage vitals (Blood Pressure, Heart Rate, Fasting Sugar), known allergy flags, and contact details.
- **Real-Time Wards & Bed Matrix:** Interactive bed management across **ICU, Emergency Trauma, General Ward, and Deluxe Suites**. Support for one-click admission, discharge, and maintenance flags.
- **Accounts & Billing Ledger:** Itemized invoices, GST calculation, payment receipt generators, and online payment tracking.
- **Real-Time Event Stream:** Audit logging of every hospital activity (admissions, prescriptions, appointments, payments).

### 2. 🩺 Doctor & Specialist Portal
- **Live OPD Consultation Queue:** Filter waiting patients by Token Number, scheduled slots, and urgency.
- **Digital Consultation Desk:** Inspect patient medical history, allergies, and vitals before consultation.
- **Interactive Prescription (Rx) Generator:** Prescribe medicines dynamically with custom dosage, timing, duration, and instructions.
- **Diagnostic Lab Orders:** Recommend tests (CBC, MRI, ECG, Electrolytes) and clinical lifestyle advice.
- **Official Printable Prescription Slip:** Fully styled medical prescription slip with doctor seal, registration details, and browser print (`Ctrl + P`) support.

### 3. 👤 Patient Health Portal
- **Digital Health Card:** View Blood Group, Patient ID, Emergency Contact, and latest vitals tracker.
- **Appointment Booking:** Select Department, Doctor, available date, and time slot with instant token number generation.
- **My Digital Prescriptions:** Access past prescriptions, medications, and advice anytime.
- **Hospital Invoices & Bill Settlement:** View itemized hospital charges with built-in UPI / Card payment simulation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, JavaScript (ESModules), Vite 8 |
| **Styling & UI** | Pure Vanilla CSS (Variables, Glassmorphism, Responsive Grid, Dark & Light Mode) |
| **Icons** | Lucide React |
| **Backend API** | Node.js, Express.js 5, CORS |
| **Data Persistence** | Dual-Layer JSON Database Engine with LocalStorage offline failover |
| **Fonts** | Plus Jakarta Sans & Outfit (Google Fonts) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/MANISHBISHT24/hospital-management-system.git
cd hospital-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Backend API Server (Port 5000)
```bash
npm run server
```

### 4. Start the Frontend Development Server (Port 5173)
```bash
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173/`**

---

## 📁 Project Architecture & File Structure

```
hospital-management-system/
├── server/
│   ├── index.js             # Express.js REST API server & endpoints
│   ├── initialData.json     # Pre-seeded hospital demo records
│   └── data.json            # Persistent JSON database
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Header with role switcher & theme toggle
│   │   ├── AdminPortal.jsx          # Admin overview, beds, doctors, accounts
│   │   ├── DoctorPortal.jsx         # OPD Queue & consultation desk
│   │   ├── PatientPortal.jsx        # Patient health card & appointments
│   │   ├── ConsultationModal.jsx    # Doctor diagnosis & medicine builder
│   │   ├── PrescriptionModal.jsx    # Official printable Rx slip
│   │   ├── InvoiceModal.jsx         # Official hospital tax invoice & payment
│   │   ├── BookAppointmentModal.jsx # Consultation booking dialog
│   │   ├── AddDoctorModal.jsx       # Doctor registration dialog
│   │   ├── AddPatientModal.jsx      # Patient registration dialog
│   │   ├── BedModal.jsx             # Bed allocation & discharge modal
│   │   └── ToastContainer.jsx       # Interactive notification system
│   ├── context/
│   │   └── HospitalContext.jsx      # Global state & role management
│   ├── services/
│   │   └── api.js                   # API client with offline storage sync
│   ├── App.jsx                      # Main dashboard router
│   ├── index.css                    # Modern medical design system & print styles
│   └── main.jsx                     # Application entry point
├── index.html                       # HTML template with Google Fonts
├── vite.config.js                   # Vite config with backend API proxy
└── package.json                     # Scripts & dependencies
```

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/data` | Fetches complete hospital state |
| `POST` | `/api/appointments` | Creates a new OPD appointment with token |
| `PATCH` | `/api/appointments/:id` | Updates appointment status (`Scheduled`/`Completed`) |
| `POST` | `/api/prescriptions` | Issues medical prescription and completes consultation |
| `POST` | `/api/doctors` | Onboards new doctor into medical staff |
| `POST` | `/api/patients` | Registers new patient with vital statistics |
| `PATCH` | `/api/beds/:id` | Allocates or vacates hospital ward beds |
| `PATCH` | `/api/bills/:id/pay` | Records bill settlement & payment mode |
| `POST` | `/api/reset` | Resets all data to initial demo hospital records |

---

## 🎓 College Viva & Examination Highlights

- **Architecture:** Demonstrates a clean Client-Server Model where React handles state and UI, and Express serves REST endpoints.
- **Fail-Safe Mechanism:** If the backend server is stopped, the application seamlessly switches to LocalStorage without throwing unhandled exceptions.
- **Real-World Medical Standards:** Includes token-based queue management, triage vitals (Blood pressure, pulse, sugar), drug allergy warnings, and formal printable prescriptions with Rx symbols.
- **Design Excellence:** Supports modern glassmorphism, responsive layout for mobile/desktop, and dark/light mode toggle.

---

## 👨‍💻 Author

**Manish Bisht**  
GitHub: [@MANISHBISHT24](https://github.com/MANISHBISHT24)
