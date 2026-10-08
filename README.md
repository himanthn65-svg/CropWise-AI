# 🌾 CropWise AI

### Grow Smarter. Choose Better.

CropWise AI is an AI-powered crop recommendation system that helps farmers make better crop-selection decisions using soil and environmental conditions.

The system analyzes **Nitrogen, Phosphorus, Potassium, temperature, humidity, pH, and rainfall** using a trained Machine Learning model and recommends the most suitable crop.

---

## 🚀 Features

* 🌱 AI-based crop recommendation
* 🧠 Machine Learning powered predictions
* 📊 Prediction confidence score
* 🌾 Alternative crop recommendations
* 🔐 Secure user authentication
* 🔑 JWT-based authorization
* 🔒 Password hashing
* 👤 Farmer profile management
* 📋 Prediction history
* 🗄️ PostgreSQL database
* ⚡ FastAPI REST API
* 📱 Responsive web interface
* 🌙 Dark liquid-glass inspired UI
* 🔄 Real-time frontend and backend integration

---

## 🧠 Machine Learning

CropWise AI uses a **Random Forest Classifier** for crop recommendation.

### Input Features

| Feature     | Description                |
| ----------- | -------------------------- |
| N           | Nitrogen content in soil   |
| P           | Phosphorus content in soil |
| K           | Potassium content in soil  |
| Temperature | Environmental temperature  |
| Humidity    | Environmental humidity     |
| pH          | Soil pH value              |
| Rainfall    | Rainfall level             |

### Model Performance

The final Random Forest model achieved approximately:

* **Test Accuracy:** 99.32%
* **5-Fold Cross-Validation Mean:** 99.49%

The model was trained on a balanced dataset containing **2,200 samples across 22 crop classes**.

---

## 🌾 Supported Crops

The dataset contains 22 crop categories:

`apple`, `banana`, `blackgram`, `chickpea`, `coconut`, `coffee`, `cotton`, `grapes`, `jute`, `kidneybeans`, `lentil`, `maize`, `mango`, `mothbeans`, `mungbean`, `muskmelon`, `orange`, `papaya`, `pigeonpeas`, `pomegranate`, `rice`, `watermelon`

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User / Farmer   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   HTML / CSS / JS    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    └──────┬─────────┬─────┘
                           │         │
                ┌──────────▼───┐ ┌──▼──────────────┐
                │ ML Predictor │ │ Authentication  │
                │ RandomForest │ │ JWT + Hashing   │
                └──────┬───────┘ └────────┬────────┘
                       │                  │
                       └────────┬─────────┘
                                ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │       Database       │
                    └──────────────────────┘
```

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* pandas
* NumPy
* scikit-learn
* joblib

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Password Hashing
* Uvicorn

### Database

* PostgreSQL

### Frontend

* HTML5
* CSS3
* JavaScript
* REST API

### Development Tools

* Git
* GitHub
* VS Code
* Jupyter Notebook

---

## 📁 Project Structure

```text
CropWise-AI/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── ml/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── main.py
│   │
│   ├── migrations/
│   ├── trained_models/
│   ├── create_tables.py
│   └── requirements.txt
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── recommend.html
│   ├── result.html
│   ├── history.html
│   └── profile.html
│
├── ml/
│   ├── dataset/
│   ├── analysis/
│   ├── preprocessing/
│   ├── training/
│   ├── evaluation/
│   └── README.md
│
├── docs/
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔐 Authentication

CropWise AI provides secure user authentication using:

* User registration
* Email-based login
* Password hashing
* JWT access tokens
* Protected API endpoints
* User-specific prediction history

Sensitive environment variables such as database credentials and JWT secrets are **not included in the repository**.

---

## 🗄️ Database

PostgreSQL is used to store application data.

The system includes data for:

* Users
* Farmer profiles
* Crop recommendations
* Prediction history

Each user's recommendation history is associated with their authenticated account.

---

## 🔌 API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Profile

```text
GET  /profile
POST /profile
PUT  /profile
```

### Crop Prediction

```text
POST /predict
```

### Prediction History

```text
GET /history
```

Interactive API documentation is available through FastAPI's Swagger UI during local development:

```text
http://127.0.0.1:8000/docs
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/himanthn65-svg/CropWise-AI.git
cd CropWise-AI
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the environment

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 5. Configure environment variables

Create:

```text
backend/.env
```

Use `backend/.env.example` as the template.

Configure your PostgreSQL connection and JWT secret.

### 6. Create database tables

```powershell
python backend\create_tables.py
```

### 7. Start the FastAPI server

From the project root:

```powershell
uvicorn app.main:app --reload --app-dir backend
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### 8. Open the frontend

Open:

```text
frontend/index.html
```

in a browser or serve the frontend through a local development server.

---

## 🔮 Future Improvements

Planned improvements for future versions include:

* 🌦️ Real-time weather integration
* 📍 Location-based recommendations
* 🌾 Crop comparison
* 📈 Agricultural trend analysis
* 🗣️ English and Telugu language support
* 🎙️ Voice-based input
* 💰 Crop profitability estimation
* 💧 Water-efficiency recommendations
* 🤖 Advanced AI assistance for farmers

---

## 📸 Screenshots

Screenshots of the application will be added here after the production deployment.

Planned screenshots:

* Landing page
* Login
* Registration
* Dashboard
* Crop recommendation
* Prediction result
* Prediction history
* Farmer profile

---

## 🎯 Project Goal

The goal of CropWise AI is to combine **Machine Learning, modern web technologies, and agricultural data** to create a practical decision-support system for smarter crop selection.

This project demonstrates the complete development workflow from:

```text
Dataset
   ↓
Data Analysis
   ↓
Preprocessing
   ↓
Model Training
   ↓
Model Evaluation
   ↓
ML Pipeline
   ↓
FastAPI Backend
   ↓
PostgreSQL
   ↓
Authentication
   ↓
Frontend
   ↓
Cloud Deployment
```

---

## 👨‍💻 Author

**N Himanth**

AI/ML Engineer | LLM Engineer

Interested in building practical AI/ML applications and intelligent software systems.

---

## 📄 License

This project is created for educational, portfolio, and demonstration purposes.
