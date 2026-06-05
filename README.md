# Tactical AI Resume Match & Job Placement Platform

An advanced, feature-rich web application designed to optimize engineer profile positioning and interview preparedness. Powered by the **Gemini AI Engine**, the platform extracts credentials from PDF resumes, performs semantic diagnostics against target job descriptions, recommends metrics-driven bullet revisions, suggests system architecture portfolio upgrades, and compiles tailored corporate interview blueprints.

---

## 🚀 Key Features

* **Secure User Authentication**: Complete sign-up, login, and user profile management secured via JWT (JSON Web Tokens) and Bcrypt password hashing.
* **Semantic Matching Engine**: Compares candidate credentials against target job descriptions using structured Gemini AI schemas.
* **Extraction Service**: Direct binary stream parsing of PDF documents to extract text clean of encoding anomalies.
* **Bespoke Visual Analytics**: Custom SVG-based radial progress gauges and interactive skill category coverage indicators.
* **Missing Tech Gaps Alert**: Automatically lists critical tools, methodologies, and technologies highlighted in the JD but missing in your resume.
* **Resume Revision Lab**: Suggests metric-driven alternatives for resume bullet points using the **STAR / XYZ framework** (Action -> Scale -> Impact).
* **System Architecture Enhancements**: Recommends advanced portfolio improvements to make your projects sound robust for elite engineering teams.
* **Corporate Interview Blueprint**: Lists high-probability CS topics, target company core technical values, and tailored project talking points.
* **🗺️ Dynamic Skill Gap Learning Roadmap**: For every identified missing technology, the AI generates an interactive learning roadmap with official documentation links, reference GitHub repositories, and 3 sequential actionable milestones. Users can tick off completed steps and watch their real-time prep progress bar update dynamically.
* **Evaluation History Log**: Persists and displays previous evaluations, allowing you to load details or remove entries.

---

## 🛠️ Technology Stack

### Backend API
* **FastAPI**: Asynchronous Python web framework for API endpoints.
* **Google GenAI SDK**: Integrates the Gemini model to parse resumes and generate strict, structured JSON outputs.
* **SQLAlchemy ORM**: Relational database mapping.
* **SQLite**: Lightweight database storage for user profiles and matching history.
* **Bcrypt & Passlib**: Password hashing.
* **PyJWT**: Secure token issuance.
* **PyPDF**: Extracts text layers from PDF uploads.

### Frontend Client
* **React (Vite)**: Hot-reloading development environment.
* **Tailwind CSS**: Contemporary dark-themed dashboard aesthetics.
* **Axios**: Promised-based HTTP client for API communication.
* **Lucide React**: Premium iconography system.

---

## 📂 Project Directory Structure

```
├── backend
│   ├── .env                       # Local secrets (API keys, JWT config)
│   ├── requirements.txt           # Python dependency manifest
│   └── app
│       ├── main.py                # Server boot & routing configuration
│       ├── database.py            # SQLite connection provider
│       ├── config.py              # Schema environment loader
│       ├── models
│       │   ├── db_models.py       # User & ResumeAnalysis database tables
│       │   └── schemas.py         # Complete Pydantic output validation contracts
│       ├── routes
│       │   ├── auth.py            # JWT authentication router (/signup, /login, /me)
│       │   └── analyzer.py        # Core /analyze and /history routes
│       └── services
│           ├── auth_service.py    # Password hashing and token creators
│           ├── matcher.py         # Gemini prompt pipeline
│           └── parser.py          # PDF binary reader
└── frontend
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── src
        ├── App.jsx                # Global router and authentication state manager
        ├── main.jsx
        ├── components
        │   ├── FileUpload.jsx     # Drag and drop PDF loader
        │   ├── MetricCharts.jsx   # SVG circular dials and category charts
        │   └── SkillBadge.jsx     # Technical badge classification pills
        ├── pages
        │   ├── LoginView.jsx      # Auth pages (Sign-in / Sign-up)
        │   ├── InputFormView.jsx  # Configuration inputs & past logs panel
        │   └── ResultsDashboard.jsx# Multi-tab diagnostics result layout
        ├── services
        │   └── api.js             # Client-side API request client
        └── styles
            └── index.css          # Core styles
```

---

## ⚙️ Configuration & Environment Variables

Create a file named `.env` in the `backend/` directory with the following variables:

```env
# Gemini AI API Key (required for matching operations)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret Configuration
JWT_SECRET_KEY=generate_a_secure_random_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database URL (Defaults to SQLite in the backend root)
DATABASE_URL=sqlite:///./resume_matcher.db
```

---

## 🚀 Getting Started

### 1. Backend Setup & Run

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend Uvicorn server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

*The API documentation is accessible at [http://localhost:8000/docs](http://localhost:8000/docs).*

### 2. Frontend Setup & Run

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```

*The frontend application will boot up at [http://localhost:3000](http://localhost:3000).*

---

## 🔒 Security & Best Practices
* **API Key Safety**: The `.env` file containing local credentials is listing inside the `.gitignore` file to ensure it is never committed to GitHub.
* **Authentication Integrity**: Password parameters are never saved in plain text; they are encrypted using Bcrypt with a work factor salt before being written to the database.

---

## 📄 License
This project is licensed under the MIT License.
