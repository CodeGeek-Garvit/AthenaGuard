<div align="center">

<img src="https://img.shields.io/badge/AthenaGuard-AI%20Sports%20Media%20Protection-00ff88?style=for-the-badge&logo=shield&logoColor=white" />

# 🛡️ AthenaGuard

### Real-Time AI Detection of Transformed Sports Media Misuse

[![Build with AI](https://img.shields.io/badge/Google-Build%20with%20AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Solution Challenge](https://img.shields.io/badge/Hack2Skill-Solution%20Challenge-EA4335?style=flat-square)](https://hack2skill.com/)
[![Live MVP](https://img.shields.io/badge/MVP-Live%20Demo-00ff88?style=flat-square&logo=googlechrome)](https://athenaguard-314163581128.asia-east1.run.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)

> **AthenaGuard** detects unauthorized sports media — even after cropping, mirroring, meme-editing, or compression. Traditional systems fail on transformed content. AthenaGuard doesn't.

[🚀 Live Demo](https://athenaguard-314163581128.asia-east1.run.app) • [📂 GitHub](https://github.com/CodeGeek-Garvit/AthenaGuard1) • [📖 Docs](https://beautiful-gecko-8c0781.netlify.app/[...]

</div>

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Process Flow](#-process-flow)
- [MVP Screenshots](#-mvp-screenshots)
- [Cost Estimation](#-cost-estimation)
- [Roadmap](#-roadmap)

---

## 🎯 Problem Statement

Sports broadcasters lose billions annually to unauthorized media redistribution. Existing copyright detection tools rely on **exact matching** or **watermarks** — both fail when content is:

- ✂️ Cropped or trimmed
- 🪞 Mirrored or flipped
- 🎭 Meme-edited with overlays
- 📉 Compressed or re-encoded
- 📱 Re-uploaded as short clips

**AthenaGuard solves this** using transformation-aware AI detection.

---

## 💡 Solution Overview

AthenaGuard is an AI-powered sports media protection platform that:

| Capability | Description |
|---|---|
| 🔍 **Transformation-Aware Detection** | Detects misuse even after heavy edits |
| ⚡ **Real-Time Monitoring** | Simulated stream ingestion pipeline |
| 🖐️ **Manual Verification** | Upload-based on-demand analysis |
| ⚖️ **Automated DMCA** | Auto-generate, send, and track notices |
| 📊 **ROI Dashboard** | Estimated revenue saved + platform analytics |
| 🤖 **AI Explainability** | Shows *why* content was flagged |

### How AthenaGuard vs Traditional Systems

| Feature | Traditional | AthenaGuard |
|---|---|---|
| Exact match detection | ✅ | ✅ |
| Watermark-dependent | ✅ | ❌ (not required) |
| Detects transformed content | ❌ | ✅ |
| Real-time monitoring | ❌ | ✅ (simulated) |
| DMCA automation | ❌ | ✅ |
| ROI analytics | ❌ | ✅ |

---

## ✨ Key Features

### 🔬 AI-Based Media Detection
- Generates robust media fingerprints via embeddings + perceptual hashing
- Detects cropped, mirrored, meme-edited, and compressed variants
- OCR-based meme text recognition

### 📡 Real-Time Monitoring (Simulated)
- Queue-based streaming pipeline simulating live ingestion
- Scans across multiple platforms concurrently
- Instant violation flagging via confidence thresholds

### 🔎 Manual Verification Mode
- Upload images or video clips for forensic analysis
- Returns similarity score, detected transformations, and action recommendation

### ⚖️ Automated DMCA Workflow
- One-click DMCA notice generation with evidence
- Status tracking: `Generated → Sent → Under Review → Resolved`
- Simulated email dispatch to platform Trust & Safety teams

### 🧠 AI Explanation Engine
- Explains *why* content was flagged (transparency layer)
- Powered by Google Gemini API
- Builds legal-grade audit trail

### 📊 Dashboard & Analytics
- Violation heatmaps, confidence scores, platform-wise breakdown
- ROI metrics: estimated revenue protected
- Alert system with real-time notifications

### 🔐 Authentication System
- Firebase Authentication — secure login/signup
- Role-based access: **Admin** / **Analyst**

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────[...]
│                        USER LAYER                               │
│   Admin/Analyst → Login/Auth → Dashboard UI → Manual Upload     │
└─────────────────────────────┬──────────────────────────────────[...]
                              │
┌─────────────────────────────▼──────────────────────────────────[...]
│                      INGESTION LAYER                            │
│   Simulation Mode (Simulated Stream) ←→ Queue/Streaming System  │
│                                      ←→ Manual Upload Input     │
└─────────────────────────────┬──────────────────────────────────[...]
                              │
┌─────────────────────────────▼──────────────────────────────────[...]
│                   PROCESSING LAYER (AI CORE)                    │
│                                                                 │
│  Preprocessing → Frame Extraction → Feature Extraction          │
│                                      ├─ Image/Video Embeddings  │
│                                      ├─ Perceptual Hashing      │
│                                      └─ OCR / Text Detection    │
│                                  → Similarity Matching Engine   │
│                                  → Decision Engine              │
│                                      ├─ High (>90%) → AUTO DMCA │
│                                      ├─ Medium (75-90%) → Review│
│                                      └─ Low (<75%) → Ignore     │
└─────────────────────────────┬──────────────────────────────────[...]
                              │
┌─────────────────────────────▼──────────────────────────────────[...]
│                       STORAGE LAYER                             │
│   Media DB │ Vector DB (embeddings) │ Incident DB │ User DB     │
└─────────────────────────────┬──────────────────────────────────[...]
                              │
┌─────────────────────────────▼──────────────────────────────────[...]
│                    OUTPUT / ACTION LAYER                        │
│  Dashboard │ Alerts │ DMCA Generation → Sending → Status Track  │
│  ROI Analytics Panel                                            │
└────────────────────────────────────────────────────────────────[...]
```

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| **React.js / Next.js** | Responsive dashboard UI |
| **Tailwind CSS** | Styling |

### Backend
| Tech | Purpose |
|---|---|
| **Node.js / FastAPI (Python)** | API, processing pipeline, DMCA workflow |

### AI & Machine Learning
| Tech | Purpose |
|---|---|
| **Google Gemini API** | Content understanding & DMCA notice generation |
| **OpenCV** | Image/video processing |
| **Embeddings** | Semantic similarity detection |
| **Perceptual Hashing (pHash)** | Transform-resistant fingerprinting |
| **OCR (Tesseract / Cloud Vision)** | Meme text recognition |

### Cloud & Database
| Tech | Purpose |
|---|---|
| **Google Cloud Platform (GCP)** | Core infrastructure |
| **Firebase / Firestore** | Real-time database & authentication |
| **Cloud Storage** | Media file storage |

### Vector Search
| Tech | Purpose |
|---|---|
| **FAISS / Pinecone** | Fast similarity search for media matching |

### Auth & Streaming
| Tech | Purpose |
|---|---|
| **Firebase Authentication** | Secure login/signup, role-based access |
| **Queue-based pipeline** | Simulated real-time stream ingestion |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Google Gemini API Key** — get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/CodeGeek-Garvit/AthenaGuard1.git
cd AthenaGuard1

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

### Environment Setup

Create `.env.local` in the root directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase (if configuring auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
# Development server
npm run dev

# Production build
npm run build
npm start
```

App runs at `http://localhost:3000`

---

## 🔄 Process Flow

```
User Auth (Login/Signup)
        │
        ▼
   Mode Selection
   ┌────┴────┐
   ▼         ▼
Monitor    Verify
Mode       Mode
   │         │
   ▼         ▼
Simulated  Upload
Stream     Image/Video
   │         │
   └────┬────┘
        ▼
   AI Detection Engine
   ├─ Feature Extraction (embeddings, hashing)
   ├─ OCR for Meme Text
   └─ Similarity Matching
        │
        ▼
   Decision Engine
   ├─ HIGH (>90%)   → AUTO DMCA + Dashboard Alert
   ├─ MEDIUM (75-90%) → Manual Review Queue
   └─ LOW (<75%)    → Ignore
        │
        ▼
   DMCA Enforcement Flow
   Generate Notice → Send (simulated) → Track Status
        │
        ▼
   Output Layer
   Dashboard │ Alerts │ ROI Metrics
```

---

## 📸 MVP Screenshots

| View | Description |
|---|---|
| **Security Overview** | Revenue protection, violation count, confidence, monitored reach |
| **Monitoring Feed** | Live stream of detected violations with transformation tags |
| **Incident Analysis** | Side-by-side original vs detected with AI explanation |
| **DMCA Notice** | Auto-generated legal notice with export & send options |
| **Manual Verification** | Drag-and-drop forensic scanning interface |
| **Media Library** | Protected asset management with violation tracking |
| **System & Compliance** | Stakeholder alignment + integration hooks |

> **Live Demo:** [https://athenaguard-314163581128.asia-east1.run.app](https://athenaguard-314163581128.asia-east1.run.app)

---

## 💰 Cost Estimation

### Development
- Built by student team
- Development cost: **₹0** (self-developed)

### Monthly Cloud & AI (Production)

| Service | Cost/Month |
|---|---|
| Google Cloud (Compute + Storage) | ₹3,000 – ₹6,000 |
| Firebase (DB + Auth) | ₹1,000 – ₹2,000 |
| Gemini API (AI usage) | ₹2,000 – ₹5,000 |
| **Total** | **₹6,000 – ₹13,000/month** |

### Scalability Design
- Cloud-native, pay-as-you-go
- Parallel stream processing
- Embedding-based vector search optimization
- Modular microservice architecture
- Distributed storage via GCP

---

## 🗺️ Roadmap

```
[NOW]  MVP Prototype
       ✅ Simulated real-time monitoring
       ✅ Manual verification
       ✅ DMCA generation

[NEXT] Platform Integration
       🔲 YouTube Data API v3 integration
       🔲 Instagram Graph API
       🔲 Real-time takedown workflows

[v3]   Advanced AI
       🔲 Full video-level tracking (not just frames)
       🔲 Live stream detection
       🔲 Improved short-clip analysis

[v4]   Automation
       🔲 Direct legal service integration
       🔲 Faster DMCA execution at scale

[v5]   Global Expansion
       🔲 OTT platform support
       🔲 Blockchain-based ownership verification
       🔲 Tamper-proof media authenticity tracking
```

---

## 🤝 Ecosystem Stakeholders

| Stakeholder | Role | Value |
|---|---|---|
| **BCCI** | Primary Content Owner | IPL digital rights protection |
| **Star Sports** | Official Broadcaster | Exclusive broadcast slot verification |
| **JioCinema** | Streaming Partner | Piracy-led churn reduction |
| **Trust & Safety Teams** | Platform Moderators | Pre-verified flags, 40% faster review |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Google Solution Challenge**

[![Star this repo](https://img.shields.io/github/stars/CodeGeek-Garvit/AthenaGuard1?style=social)](https://github.com/CodeGeek-Garvit/AthenaGuard1)

</div>
