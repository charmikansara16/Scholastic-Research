# ScholarAI — India Scholarship Discovery Platform

ScholarAI is an AI-powered scholarship discovery platform designed to connect Indian students with eligible scholarships in under 60 seconds. Students enter five parameters — Category, Annual Family Income, State, Education Level, and Academic Percentage — and the system matches them against a curated database of Central, State, and private NGO schemes.

---

## 🚀 Key Features

- **No Friction / Zero PII**: No sign-up, no login, and no data tracking.
- **AI Matching Engine**: Dynamic pre-filtering coupled with Claude Sonnet 3.5 (or Google Gemini 2.5) matching to evaluate strict eligibility and output plain English explanations.
- **Robust Redirection**: Matching cards direct students directly to the stable registration/detail portals of the respective scholarships.
- **Interactive Checklists**: Collapse and check off required documents dynamically as you compile your application files.
- **Premium Dark Aesthetics**: Styled with high-end glassmorphism, responsive mobile-first layouts, and smooth animations.

---

## 📂 Project Structure

```text
ScholarAI/
├── backend/
│   ├── main.py                 # FastAPI application routes
│   ├── database.py             # SQLAlchemy SQLite engine setup
│   ├── models.py               # SQLAlchemy database schema definition
│   ├── schemas.py              # Pydantic v2 schemas for request/response validation
│   ├── matching.py             # Pre-filtering & AI matching pipeline (Claude / Gemini)
│   ├── seed.py                 # SQLite database seeding logic
│   ├── scholarships_seed.json  # 52 pre-populated active scholarship schemes
│   └── requirements.txt        # Python backend dependencies
└── frontend/
    ├── package.json            # NPM dependencies
    ├── vite.config.js          # Vite config
    ├── tailwind.config.js      # Tailwind CSS v3 configuration
    └── src/
        ├── main.jsx            # Entry point
        ├── App.jsx             # State controller & routing
        ├── index.css           # Tailwind overrides + custom glassmorphic utility CSS
        └── components/         # Header, Footer, Hero, ProfileForm, ResultsList, etc.
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js (v18+) & NPM

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template to `.env` (it is ignored by git):
   ```bash
   cp .env.example .env
   ```
5. Set your Anthropic or Google API keys:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   GOOGLE_API_KEY=your_key_here
   ```
6. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *(On startup, the SQLite database is automatically created and seeded with 52 scholarships).*

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install NPM packages:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Run the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173/` in your browser.

---

## 🛡️ License & Disclaimer

ScholarAI is an independent, non-governmental discovery platform created for educational and hackathon demonstration purposes. It is not affiliated with the Government of India, the National Scholarship Portal (NSP), or any state scholarship boards.
