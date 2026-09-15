# 🌱 Habit Rescue — Don't Punish the Miss. Rescue the Habit.

> An empathetic, AI-powered habit companion that turns missed routines into 4-day progressive micro-recovery plans — with zero streak guilt.

---

## 🎯 Track Submissions

* **Main Track**: 🌿 **Wellness Track**  
  *Habit Rescue directly supports mental and behavioral wellness by eliminating the anxiety, guilt, and burnout associated with rigid, punitive habit trackers. It treats habit building as an act of self-care and resilience rather than a test of perfection.*

* **Bonus Track**: 🤖 **Best Use of AI**  
  *Rather than just being a generic chatbot, the AI in Habit Rescue serves as an embedded behavioral psychologist. It dynamically analyzes the context of your missed habits (fatigue, unexpected schedule changes, low motivation) and generates adaptive, stepped micro-recovery plans with tailored pacing and actionable friction reduction.*

---

## 💡 What Does It Do?

Most habit trackers share the same unforgiving mechanic: you build a 20-day streak, miss one day because you were sick or worked late, and your counter resets to zero. That single moment of failure often leads to frustration, streak guilt, and abandoning the habit entirely.

**Habit Rescue replaces punishment with recovery:**

1. **Daily Check-In & Live Overview**: Track your habits daily on a clean dashboard showing live metrics — current streak, today's completion ratio, and overall consistency rate.
2. **Empathetic Miss Logging**: When you miss a habit, instead of deducting points or breaking your streak, Habit Rescue asks one thoughtful question: *"What got in the way today?"*
3. **4-Day Progressive AI Micro-Recovery Plans**: Powered by **Groq API (Llama 3.3 70B Versatile)** and **Google Gemini**, the app generates a personalized 4-day ramp-up plan in milliseconds. Day 1 starts with an ultra-low-friction micro-step (e.g., just 5 minutes or a light walk) to protect the neurological habit loop, gently ramping back to 100% by Day 4.
4. **Rescue Center with Daily Pacing**: Recovery steps unlock one day at a time to prevent bingeing and burnout. Users can accept, regenerate alternative variations, or dismiss plans as they please.
5. **Seamless Auto-Resolution**: The moment you mark your habit as completed normally, the recovery plan automatically resolves and returns to regular flow.
6. **Obstacle Pattern Detection & Root-Cause Analytics**: Uncovers recurring friction points (like missing workouts specifically on Thursdays due to fatigue) and suggests proactive friction adjustments before burnout occurs.
7. **Non-Punitive Calendar**: A monthly visual journal celebrating both successful check-ins and resilient AI rescue events.

---

## ✨ What Inspired It?

We’ve all been there: you’re excited about a new routine — whether it's meditating, reading, drinking water, or exercising. You build momentum for two weeks, but then life happens. You catch a cold, a deadline runs late, or you're simply exhausted. 

Traditional habit apps punish you for being human. Seeing a streak reset to zero creates an *"all-or-nothing"* mindset: *"I already ruined my streak, so why bother trying today?"*

We were inspired by modern cognitive behavioral psychology and James Clear's *Atomic Habits*: **"Missing once is an accident. Missing twice is the start of a new habit."**

We wanted to create a tool built on the philosophy that **a missed habit is not a failure — it is valuable information.** By understanding *why* you missed, an app should adapt to support you, removing friction so you can get back on track effortlessly.

---

## 🛠️ Technologies Used

### Frontend & UI
* **React 18**: Component-driven architecture with custom hooks and context providers.
* **Vite**: Ultra-fast build tool and local development server.
* **Tailwind CSS & Custom Design System**: Warm Zen Botanical aesthetic with custom color palettes (Sage Emerald, Terracotta Orange, Sand Gold, and Dark Obsidian).
* **Lucide React**: Clean, modern iconography across all screens.
* **Recharts**: Interactive and accessible data visualization for analytics and pattern recognition.
* **Date-fns**: Robust date manipulation, calendar generation, and streak tracking.

### Backend & Cloud Services
* **Firebase Authentication**: Secure user login, registration, password resets, and instant one-click demo sessions.
* **Cloud Firestore**: Real-time cloud database syncing habits, daily logs, and active recovery plans across devices.

### 🧠 Artificial Intelligence Engine
* **Primary AI Engine**: **Groq API — Llama 3.3 70B Versatile** (`llama-3.3-70b-versatile` via Groq LPU™ Inference Engine).
* **Fallback AI Models**: **Llama 3.1 8B Instant** (`llama-3.1-8b-instant`), **Google Gemini** (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`), and offline deterministic Heuristic Engine.
* **Speed & Reliability**: Sub-second (~300ms) ultra-fast inference with zero user waiting time, powered by Groq's specialized LPUs.
* **AI Implementation Details**:
  * Prompts the AI with structured JSON schemas acting as a supportive behavioral habit coach.
  * Inputs include the habit name, category, standard target amount, measurement unit, failure obstacle (*e.g., "Too tired", "Schedule changed"*), and optional user notes.
  * The model dynamically calculates progressive percentages, crafts empathetic explanations, and writes custom daily micro-goal instructions.
  * Includes multi-tiered fallback architecture (Groq ➡️ Gemini ➡️ Heuristic Engine) ensuring 100% uptime under any network condition.

### 🌓 Theme System
* Dual **Light & Dark Mode** with high-contrast typography, custom backdrop grid meshes, and persistent `localStorage` theme state.

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kiran-F/Habit-Rescue.git
   cd HabitRescue
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Built with Care

Built for anyone striving to build sustainable, lifelong habits without the pressure of perfection. 🌱
