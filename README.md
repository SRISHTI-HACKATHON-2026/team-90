# 🌱 Eco-Ledger

### Sovereign Resilience · Human-as-Sensor Intelligence System

Eco-Ledger is a **community intelligence platform** designed for low-resource environments.
Instead of relying on IoT sensors, it uses **people as sensors** to collect, analyze, and act on real-world data.

---

## 🚀 Core Idea

> “We don’t just collect data — we ensure data continues to exist.”

Eco-Ledger captures both:

* ✅ **Structured data** (water, waste, energy via SMS/IVR)
* 👁️ **Observational data** (leaks, garbage, blockages via voice/input)

---

## 🧠 Key Features

### 📊 1. Command Dashboard (Admin Hub)

* Global CIU (Community Intelligence Unit)
* Resource distribution (Water, Waste, Energy)
* Real-time status indicators
* Glassmorphism UI (dark, resilient design)

---

### 🧾 2. Audit Log

* Tracks all incoming data (SMS, IVR, WhatsApp)
* Status tagging (verified, flagged, rejected)
* Real-time monitoring

---

### 📡 3. Broadcast Control

* Send alerts and instructions to communities
* Supports SMS / IVR-based outreach

---

### 🏘️ 4. Localities & Households

* Cluster-based structure (A–H)
* Each locality contains households
* Tracks:

  * Active reporters (last 24h)
  * Inactive households
* Visual grid of participation

---

### 🤖 5. Agentic AI “Captain”

An autonomous system that:

```text
Observe → Reason → Decide → Act
```

* Detects **low participation (silence)**
* Classifies severity
* Triggers:

  * IVR calls
  * Reminders
  * Alerts

#### Example Logic:

| Participation | Action               |
| ------------- | -------------------- |
| <10%          | EMERGENCY_CALL_BLAST |
| <25%          | TARGETED_IVR         |
| <50%          | SEND_REMINDER        |
| ≥50%          | NO_ACTION            |

---

### 🔊 6. Voice Feedback System

* Browser-based speech output
* Hindi + English support
* Improves accessibility for low-literacy users

---

### 📞 7. IVR System

* Input via phone calls
* Supports:

  * Water / Waste / Energy reporting
  * Observation reporting (leaks, garbage, etc.)

---

### 📩 8. SMS Input

* Accepts structured inputs:

  ```
  water 50
  waste 20
  energy 10
  ```
* Also supports observational keywords:

  ```
  leak near tap
  garbage piling
  drain blocked
  ```

---

## ⚠️ Problem We Solve

Traditional systems:

* Depend on IoT sensors ❌
* Miss real-world issues ❌

Eco-Ledger:

* Uses **human observation** ✅
* Detects **absence of data (silence)** ✅
* Works in **low-internet environments** ✅

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* Lucide Icons

### Backend

* FastAPI (Python)
* SQLAlchemy
* Twilio (IVR & Calls)

### Communication

* SMS (Twilio / Simulator)
* IVR (Voice flows)
* WhatsApp (optional)

---

## 🔄 System Workflow

```text
User Input (SMS / IVR / WhatsApp)
        ↓
Backend Processing (FastAPI)
        ↓
Database Logging
        ↓
AI Agent Analysis
        ↓
Decision (Alert / Call / No Action)
        ↓
Dashboard Update
```

---

## 📂 Project Structure

```
eco-ledger/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── eco-ledger/
│   │   ├── components/
│   │   ├── lib/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── db/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/eco-ledger.git
cd eco-ledger
```

---

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Environment Variables

Create `.env`:

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
TWILIO_IVR_URL=...
```

---

## 🧪 Demo Flow

1. Open dashboard
2. Send SMS or use IVR
3. Check Audit Log
4. Run AI Captain
5. Watch system react

---

## 🏆 Innovation Highlights

* Human-as-Sensor Model
* Silence Detection (absence of data)
* Agentic AI intervention
* Offline-first design
* Multilingual voice interaction

---

## 📈 Future Enhancements

* Real locality mapping
* CIU based on real data (not mock)
* Heatmaps & anomaly detection
* Offline kiosk (Raspberry Pi)
* Captain-led interventions

---



> “Eco-Ledger doesn’t just measure communities — it empowers them.”
