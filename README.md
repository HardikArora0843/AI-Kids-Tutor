# 🚀 AI Kids Tutor - Gamified Kids Learning Platform

<div align="center">

![AI Kids Tutor Logo](https://img.shields.io/badge/AI%20Kids%20Tutor-Learning%20Platform-indigo?style=for-the-badge&logo=graduation-cap&logoColor=white)

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0.9-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2.4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

*A fun, gamified learning adventure for kids with a dedicated parent portal, adaptive recommendations, and parental controls*

[🌟 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [🚀 Quick Start](#-quick-start) • [📚 API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔧 Environment Setup](#-environment-setup)
- [📚 API Documentation](#-api-documentation)
- [🎨 UI Components](#-ui-components)
- [🌍 Learning Worlds](#-learning-worlds)
- [🤖 Learning Engine](#-learning-engine)
- [👨‍👩‍👧 Parent Portal](#-parent-portal)
- [🔒 Authentication & Security](#-authentication--security)
- [🌐 Internationalization](#-internationalization)
- [📱 Responsive Design](#-responsive-design)
- [☁️ Deployment](#️-deployment)

---

## 🌟 Features

### 🎯 Core Features

#### 🏠 **Landing & Authentication**
- **Landing Page** - Kid-friendly introduction to the platform
- **Dual Portal System** - Separate child and parent applications
- **JWT Authentication** - Secure login/signup with role-based access
- **Parent–Child Linking** - Children register using their parent's account ID
- **Portal Switch Links** - Glowing cross-portal buttons open the other app in a new tab for side-by-side demos

#### 🎮 **Child Learning Portal**
- **Interactive Dashboard** - World picker with stars, progress, and AI recommendations
- **6 Learning Worlds** - Alphabet, Numbers, Colors & Shapes, Stories, Quiz, and Drawing
- **Gamified Experience** - Stars, confetti, lives, timers, and reward popups
- **AI Mentor** - Animated character with speech bubbles and text-to-speech feedback
- **Voice Practice** - Web Speech API for pronunciation activities
- **Custom Tests** - Parent-assigned quizzes appear on the child dashboard
- **Screen Time Awareness** - Daily usage tracking with lock overlay when limit is reached

#### 👨‍👩‍👧 **Parent Portal**
- **Multi-Section Dashboard** - Overview, Controls, Tests, Insights, and History
- **Child Management** - View and switch between linked children
- **Progress Analytics** - Topic-wise accuracy, session history, and Recharts visualizations
- **Screen Time Controls** - Set daily limits, monitor usage, and manual lock/unlock
- **Custom Test Builder** - Create quizzes by topic, difficulty, and question count
- **Weak-Focus Mode** - Auto-generate tests targeting the child's struggling topics
- **AI Insights** - Performance analysis and next-learning recommendations

### 🎮 **User Experience**

#### 📈 **Progress Tracking**
- **Per-Session Records** - Score, accuracy, time spent, and difficulty level
- **Topic Stats** - Aggregated performance across all learning areas
- **Star System** - Visual rewards for completed activities
- **Activity Timeline** - Historical learning sessions for parents

#### 🧠 **Adaptive Learning**
- **Difficulty Scaling** - Easy → Medium → Hard based on recent accuracy
- **Smart Recommendations** - 70/30 mix of weak-topic practice and revision
- **Performance Classification** - Strong, moderate, and weak topic grouping
- **Unattempted Topic Discovery** - Suggests new worlds the child hasn't tried

#### 🛡️ **Parental Controls**
- **Daily Screen Time Limits** - Configurable minutes per day
- **Automatic Daily Reset** - Usage resets at midnight
- **Manual Lock** - Parents can lock the child portal instantly
- **Usage Monitoring** - Real-time percentage and status indicators

### 🔧 **Advanced Features**

#### 🤖 **Learning Engine**
- **Performance Analysis** - MongoDB aggregation across all topics
- **Weighted Topic Selection** - Weaker topics get higher recommendation priority
- **Test Generation** - Static question bank with difficulty tiers and weak-focus bias
- **Trend Detection** - Improving, declining, or steady attempt patterns

#### 🗣️ **Mentor System**
- **Multiple Characters** - Robot, Panda, Fairy, and Astro
- **Event-Driven Feedback** - Reactions for correct/wrong answers, hints, and completions
- **Bilingual Speech** - TTS aligned with selected UI language
- **Character Selection** - Persistent mentor choice per child

#### 🔊 **Accessibility & Language**
- **English & Hindi** - Full UI translation support
- **Sound Effects** - Toggleable game audio via SoundProvider
- **Kid-Friendly Typography** - Fredoka & Nunito fonts on child portal

---

## 🛠️ Tech Stack

### 🎨 **Frontend (Child Portal)**
```
React 19.2.5           - Modern UI library
Vite 8.0.9             - Fast build tool
Tailwind CSS 4.2.4     - Utility-first CSS framework
React Router 7.14.2    - Client-side routing
Axios 1.15.2           - HTTP client
Recharts 3.8.1         - Charts (shared dependency)
Web Speech API         - Voice input & TTS
```

### 🎨 **Frontend (Parent Portal)**
```
React 19.2.5           - Dashboard UI
Vite 8.0.9             - Build tool (port 5174)
Tailwind CSS 4.2.4     - Styling
Recharts 3.8.1         - Analytics charts
Plus Jakarta Sans      - Professional dashboard typography
```

### ⚙️ **Backend**
```
Node.js + Express 5.2.1  - REST API server
MongoDB + Mongoose 9.5.0 - Database & ODM
JWT 9.0.3                - Authentication tokens
bcrypt 6.0.0             - Password hashing (salt rounds: 12)
CORS 2.8.6               - Cross-origin allowlist
dotenv 17.4.2            - Environment configuration
Nodemon 3.1.14           - Development hot reload
```

### 🧪 **Development & Tooling**
```
ESLint 9.39.4            - Code linting
Vite Preview             - Production preview servers
Vercel                   - Frontend deployment (SPA rewrites)
```

---

## 🏗️ Project Structure

```
AI-Kids-Tutor/
├── 📁 backend/                    # Node.js REST API
│   ├── 📁 config/
│   │   └── db.js                  # MongoDB connection
│   ├── 📁 controllers/
│   │   ├── authController.js      # Register, login, children
│   │   ├── progressController.js  # Save & analytics
│   │   ├── screenTimeController.js# Parental time controls
│   │   ├── aiController.js        # Analysis & recommendations
│   │   └── testController.js      # Custom test CRUD
│   ├── 📁 middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── 📁 models/
│   │   ├── User.js                # Parent & child accounts
│   │   ├── Progress.js            # Learning session records
│   │   ├── ScreenTime.js          # Daily usage limits
│   │   └── Test.js                # Parent-created quizzes
│   ├── 📁 routes/
│   │   ├── authRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── screenTimeRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── testRoutes.js
│   │   └── healthRoutes.js
│   ├── 📁 services/
│   │   ├── learningEngine.js      # Adaptive recommendation logic
│   │   └── testGenerator.js       # Question bank & test builder
│   ├── 📄 app.js                  # Express entry point
│   └── 📄 package.json
│
├── 📁 frontend/                   # Child Portal (port 5173)
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 game/           # Shared game UI (quiz, story, color, number)
│   │   │   ├── 📁 mentor/         # AI mentor character system
│   │   │   └── 📁 voice/          # Speech recognition components
│   │   ├── 📁 pages/
│   │   │   ├── 📁 worlds/         # 6 learning world pages
│   │   │   ├── ChildDashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TestAttempt.jsx
│   │   ├── 📁 context/            # Language provider
│   │   ├── 📁 hooks/              # useScreenTime
│   │   ├── 📁 i18n/               # en.js, hi.js translations
│   │   ├── 📁 services/           # Axios API client
│   │   └── 📁 sounds/             # SoundProvider
│   ├── 📄 vercel.json
│   └── 📄 package.json
│
├── 📁 parent/                     # Parent Portal (port 5174)
│   ├── 📁 src/
│   │   ├── 📁 components/         # StatCard, TopicCard, CreateTestPanel, etc.
│   │   ├── 📁 pages/
│   │   │   ├── ParentDashboard.jsx
│   │   │   ├── ParentLogin.jsx
│   │   │   └── ParentRegister.jsx
│   │   ├── 📁 constants/          # Topic labels
│   │   └── 📁 services/           # API client (parentToken)
│   ├── 📄 vercel.json
│   └── 📄 package.json
│
└── 📄 README.md
```

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local instance or MongoDB Atlas)
- **npm**

### ⚡ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/AI-Kids-Tutor.git
cd AI-Kids-Tutor
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Child Portal Dependencies**
```bash
cd ../frontend
npm install
```

4. **Install Parent Portal Dependencies**
```bash
cd ../parent
npm install
```

5. **Set up Environment Variables** (See [Environment Setup](#-environment-setup))

6. **Start the Development Servers**

Open **three terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Child Portal:**
```bash
cd frontend
npm run dev
```

**Terminal 3 — Parent Portal:**
```bash
cd parent
npm run dev
```

7. **Access the Applications**

| App | URL | Description |
|-----|-----|-------------|
| Child Portal | `http://localhost:5173` | Kids sign in & play learning games |
| Parent Portal | `http://localhost:5174` | Parents manage progress & controls |
| Backend API | `http://localhost:5000/api` | REST API |

### 👤 Demo Workflow (for Recruiters)

1. Open **Parent Portal** → Register a parent account
2. Copy the **Parent ID** shown on the dashboard
3. Click the glowing **"Go to Child Portal"** link (opens in a new tab)
4. Register a child account using the Parent ID
5. Play a learning world in the child tab → watch progress update live in the parent tab

---

## 🔧 Environment Setup

### 🔐 Backend Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/ai-kids-tutor

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# CORS (comma-separated frontend URLs)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 🎨 Child Portal Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PARENT_URL=http://localhost:5174
```

### 👨‍👩‍👧 Parent Portal Environment Variables

Create `parent/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CHILD_URL=http://localhost:5173
```

> **Note:** If `VITE_API_URL` is not set, both frontends fall back to `http://localhost:5000/api`.

---

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

### 🏥 Health Routes
```
GET    /health/                  # Server health check
```

### 🔐 Authentication Routes
```
POST   /auth/register            # Register parent or child
POST   /auth/login               # Login (returns JWT + user)
GET    /auth/children            # List children (parent only)
```

**Register Body (Parent):**
```json
{
  "name": "Jane Doe",
  "email": "parent@example.com",
  "password": "SecurePass1!",
  "role": "parent"
}
```

**Register Body (Child):**
```json
{
  "name": "Alex",
  "email": "child@example.com",
  "password": "SecurePass1!",
  "role": "child",
  "parentId": "<parent_mongodb_id>"
}
```

### 📊 Progress Routes
```
POST   /progress/save            # Save a learning session (child)
GET    /progress/:childId        # All progress records
GET    /progress/stats/:childId  # Aggregated topic stats
GET    /progress/analytics/:childId  # Full analytics (parent only)
```

### ⏱️ Screen Time Routes
```
POST   /screentime/set-limit     # Set daily limit (parent)
GET    /screentime/status/:childId   # Current usage status
POST   /screentime/update-usage  # Sync usage seconds (child)
POST   /screentime/toggle-lock   # Lock/unlock portal (parent)
```

### 🤖 AI / Learning Engine Routes
```
GET    /ai/analysis/:childId     # Full performance analysis
GET    /ai/recommendation/:childId  # Next topic recommendation
```

### 📝 Test Routes
```
POST   /test/create              # Create custom test (parent)
GET    /test/:childId            # List tests for child
POST   /test/submit              # Submit test answers (child)
```

---

## 🎨 UI Components

### 🧩 Child Portal Components

#### **GameCard**
World selection cards on the child dashboard with emoji, gradient backgrounds, and progress stars.

#### **Mentor**
Animated AI companion with bubble dialogue, character selection, and Web Speech TTS.

```jsx
const mentor = useMentor("robot");
mentor.onCorrect();   // Celebrates correct answer
mentor.onWrong();     // Encourages retry
mentor.greet();       // Welcome message on dashboard
```

#### **RewardPopup & ConfettiEffect**
Celebration overlays triggered on level completion and high scores.

#### **LockOverlay**
Full-screen overlay when daily screen time limit is reached.

#### **Portal Switch Link**
Radiant glowing button to open the other portal in a new browser tab.

```jsx
<a
  href={parentUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="portal-switch-link"
>
  Parent? Open the Parent Portal
</a>
```

### 🧩 Parent Portal Components

#### **StatCard**
Summary metric cards for accuracy, sessions, and screen time usage.

#### **TopicCard**
Per-topic performance with color-coded accuracy bars.

#### **CreateTestPanel**
Form to build custom quizzes with topic, difficulty, question count, and weak-focus toggle.

#### **TimelineItem**
Activity history entries with formatted dates and topic labels.

---

## 🌍 Learning Worlds

| World | Route | Topics Covered |
|-------|-------|----------------|
| 🔤 Alphabet World | `/child/alphabet` | Letter recognition, phonics, sequencing |
| 🔢 Number World | `/child/numbers` | Counting, addition, subtraction |
| 🎨 Color & Shape Lab | `/child/colors` | Color sorting, matching, naming |
| 📖 Story Zone | `/child/stories` | Reading comprehension, vocabulary |
| 🏆 Quiz Arena | `/child/quiz` | Timed mixed-topic challenges |
| ✏️ Drawing Zone | `/child/drawing` | Shape identification and creative drawing |

Each world:
- Saves progress to the backend on completion
- Integrates the mentor for real-time feedback
- Supports English and Hindi UI strings
- Respects screen time lock state

---

## 🤖 Learning Engine

The adaptive learning engine (`backend/services/learningEngine.js`) analyzes MongoDB progress data to personalize the experience.

### 📊 Performance Analysis

```javascript
// Topic classification thresholds
Strong:   averageAccuracy > 75%
Moderate: averageAccuracy 50–75%
Weak:     averageAccuracy < 50%
```

### 🎯 Recommendation Algorithm

```
Priority 1: New user → suggest first unattempted topic (alphabet)
Priority 2: 70% chance → practice weakest topic (weighted selection)
            30% chance → revision of strong/moderate topics
Priority 3: Introduce unattempted topics
Fallback:   Default to alphabet world
```

### 📈 Difficulty Adaptation

| Recent Avg Accuracy | Action |
|---------------------|--------|
| > 80% | Step up difficulty (easy → medium → hard) |
| < 50% | Step down difficulty |
| 50–80% | Maintain current level |

### 📝 Test Generator

- Static question bank across alphabet, numbers, colors, and shapes
- Three difficulty tiers: easy, medium, hard
- **Weak-focus mode** — biases questions toward topics with lowest accuracy
- Question types: MCQ, match, identify

---

## 👨‍👩‍👧 Parent Portal

### 📊 Dashboard Sections

| Section | Features |
|---------|----------|
| **Overview** | Child selector, summary stats, AI recommendation card |
| **Controls** | Screen time limit slider, lock toggle, usage bar |
| **Tests** | Create & manage custom quizzes for children |
| **Insights** | Recharts bar charts, topic breakdown, level labels |
| **History** | Chronological activity timeline |

### 🔗 Parent–Child Linking Flow

```
1. Parent registers  →  receives MongoDB _id as Parent ID
2. Child registers  →  enters Parent ID in registration form
3. Backend validates parent exists with role "parent"
4. Child account linked via parentId field on User model
```

### ⏱️ Screen Time System

- Default daily limit: **60 minutes**
- Child app ticks every second, syncs to backend every **30 seconds**
- Daily reset at midnight (based on `lastUpdated` date)
- Parents can override with manual lock at any time

---

## 🔒 Authentication & Security

### 🛡️ Security Measures

#### **Authentication**
- **JWT Tokens** — 7-day expiry, signed with `JWT_SECRET`
- **Role-based Access** — `parent` and `child` roles enforced on routes
- **Password Hashing** — bcrypt with 12 salt rounds
- **Password Policy** — Min 8 chars, uppercase, lowercase, number, special character

#### **Session Management**
- Child portal stores: `token`, `user`, `sessionExpiresAt`
- Parent portal stores: `parentToken`, `parentUser`, `parentSessionExpiresAt`
- Separate storage keys allow both portals open simultaneously

#### **API Protection**
- **Auth Middleware** — Bearer token verification on all protected routes
- **CORS Allowlist** — Configurable via `ALLOWED_ORIGINS` env variable
- **Parent–Child Authorization** — Screen time and test routes verify `parentId` ownership

#### **Data Validation**
- Mongoose schema validation on all models
- Server-side accuracy calculation on progress save
- ObjectId format validation for parentId during child registration

---

## 🌐 Internationalization

### Supported Languages

| Code | Language |
|------|----------|
| `en` | English |
| `hi` | Hindi (हिंदी) |

- Language preference persisted in `localStorage` (`appLanguage`)
- Mentor TTS language syncs with UI language selection
- Translation files: `frontend/src/i18n/en.js`, `frontend/src/i18n/hi.js`

---

## 📱 Responsive Design

### 🎨 Design System

#### **Color Palette (Child Portal)**
```css
Primary:    Indigo (#6366f1)
Secondary:  Amber (#f59e0b)
Kid Pink:   #f472b6
Kid Purple: #a78bfa
Kid Teal:   #2dd4bf
Kid Orange: #fb923c
Success:    #22c55e
Error:      #ef4444
```

#### **Typography**
- **Child Portal** — Fredoka (headings) & Nunito (body)
- **Parent Portal** — Plus Jakarta Sans

#### **Animations**
- Float, bounce, confetti, pulse-glow, slide-up
- Portal switch radiant glow animation
- Mentor roam, balloon drift, conveyor belt effects

### 📐 Layout

| Portal | Approach |
|--------|----------|
| Child | Mobile-first, large touch targets, playful gradients |
| Parent | Sidebar navigation (desktop), stacked layout (mobile) |

---

## ☁️ Deployment

Both frontends include `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Production Checklist

1. Deploy backend to a Node.js host (Railway, Render, etc.)
2. Set production env vars (`MONGO_URI`, `JWT_SECRET`, `ALLOWED_ORIGINS`)
3. Deploy `frontend/` and `parent/` to Vercel (separate projects)
4. Set `VITE_API_URL`, `VITE_PARENT_URL`, and `VITE_CHILD_URL` to production URLs
5. Add both Vercel URLs to backend `ALLOWED_ORIGINS`

---

## 🙏 Acknowledgments

- **React** — UI framework
- **Express** — Backend API
- **MongoDB** — Database
- **Vite** — Build tooling
- **Tailwind CSS** — Styling
- **Recharts** — Analytics visualizations
- **Web Speech API** — Voice & TTS features

---

<div align="center">

**Made with ❤️ for AI Kids Tutor**

*Helping kids learn through play, and giving parents the tools to guide the journey.*

</div>
