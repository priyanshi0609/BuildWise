# 🏗️ BuildWise – Smart Construction Cost Estimator

**BuildWise** is an AI-powered web-based construction cost estimator tailored for civil engineers, contractors, and architects. It helps you **accurately predict project costs**, **optimize budgets**, and **make data-driven decisions** with ease.

🔗 **Live Demo**: [[Click Here](https://build-wise-five.vercel.app/)]

---

## ✨ Key Features

✅ **Real-time Cost Calculations**  
✅ **Material & Labor Optimization**  
✅ **Interactive Dashboards & Reports**  

---

## 🚀 Feature Breakdown

### 1. 🧮 Smart Cost Estimation
- Input project dimensions, material types, and labor hours.
- Automatic breakdown of material, labor, and overhead costs.

### 2. 🤖 AI-Powered Optimization
- Get alternative material suggestions (e.g., *“Use bamboo instead of oak”*).
- Compare original vs. optimized estimates to save more.

### 3. 📊 Interactive Dashboard
- Visualize costs with live-updating graphs and charts.
- Track changes as budgets evolve.

### 4. 📝 Report Generation
- Generate downloadable PDF reports with cost insights.
- Save and revisit project history (for registered users).

### 5. 💰 Dynamic Pricing
- Fetch real-time material prices using external APIs.
- Always get the most accurate and updated estimates.

---

## 🧠 AI Models

### Gemini API has been used in Buildwise for cost optimization

---

## 💡 Innovation Highlights

🔥 **Dynamic Pricing** – Up-to-date cost data via real-time APIs  
📊 **Smart Material Suggestions** – Not just cheaper, but better alternatives  
📉 **Predictive Budgeting** – Detect and prevent potential cost overruns

---

## 🛠️ Tech Stack

| Layer         | Technology                            | Purpose                          |
|---------------|----------------------------------------|----------------------------------|
| **Frontend**  | React 18, Vite, JavaScript             | Core UI Framework                |
| **Styling**   | TailwindCSS, Framer Motion             | Responsive UI & Animations       |
| **Backend**   | Node.js, Express, Firebase Functions   | API Services & Logic             |
| **Database**  | Firestore, MongoDB Atlas               | Persistent & Analytical Storage  |
| **AI/ML**     | Python, scikit-learn, TensorFlow.js    | Predictive Cost Modeling         |
| **DevOps**    | GitHub Actions, Docker                 | CI/CD & Deployment               |
| **Monitoring**| Sentry, Prometheus                     | Error Tracking & Performance     |

---

## 🌐 API Reference

| Endpoint            | Method | Description                       |
|---------------------|--------|-----------------------------------|
| `/api/estimate`     | POST   | Calculate project cost            |
| `/api/optimize`     | POST   | Get optimization suggestions      |
| `/api/report`       | POST   | Generate and download PDF report  |
| `/api/auth/login`   | POST   | User authentication               |

---

## 🗂️ Folder Structure


```bash

BuildWise/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/                  # Logos, images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/               # Login/Signup
│   │   │   ├── Dashboard/          # Charts, CostSummary
│   │   │   ├── Forms/              # ProjectInput, MaterialSelector
│   │   │   ├── Optimization/       # Suggestions, Comparison
│   │   │   └── Report/             # PDFGenerator
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Estimate.jsx        # Cost estimation form
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   └── Optimize.jsx        # AI suggestions
│   │   ├── services/
│   │   │   ├── api.js              # Axios calls
│   │   │   └── auth.js             # Firebase auth
│   │   ├── utils/
│   │   │   ├── calculations.js     # Cost formulas
│   │   │   └── formatters.js       # Currency/units
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── firebaseConfig.js       # Firebase keys
│   └── package.json
├── backend/
│   ├── config/
│   │   ├── firebaseConfig.js       # Firebase admin SDK
│   │   └── rates.json             # Default material rates
│   ├── controllers/
│   │   ├── authController.js       # User auth
│   │   ├── costController.js       # Cost calculations
│   │   └── optimizeController.js   # AI suggestions
│   ├── models/
│   │   ├── Project.js              # Mongoose/Firestore schema
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── costRoutes.js
│   │   └── optimizeRoutes.js
│   ├── services/
│   │   ├── costService.js          # Core cost logic
│   │   ├── optimization.js         # AI rule engine
│   │   └── reportService.js        # PDF generation
│   ├── app.js
│   ├── server.js
│   └── package.json
├── ai-models/                      # Python-based AI
│   ├── cost_prediction/
│   │   ├── train_model.py          # scikit-learn/TensorFlow
│   │   └── model.h5                # Trained weights
│   └── material_optimization/
│       ├── rules.json              # Rule-based alternatives
│       └── optimize.py             # ML suggestions
├── docs/
│   ├── API.md                      # Endpoint documentation
│   └── ARCHITECTURE.md             # Tech decisions
├── scripts/
│   ├── deploy.sh                   # CI/CD automation
│   └── fetch_prices.sh             # API data pipeline
├── .env.example                    # Environment variables
├── .gitignore
├── LICENSE
└── README.md                       # Project overview
```






## 🤝 Contributing
Fork the repo.

Create a new branch (git checkout -b feature/new-feature).

Commit changes (git commit -m "Add new feature").

Push to branch (git push origin feature/new-feature).

Open a Pull Request.




<div align="center"> <h3>🚀 Built with ❤ by Team Synapse 🚀</h3> <p>Contact: <a href="mailto:arshtiwari12345@gmail.com">arshtiwari12345@gmail.com</a></p> </div> 
