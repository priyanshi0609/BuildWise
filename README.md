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
| **Frontend**  | React JS, Vite, JavaScript             | Core UI Framework                |
| **Styling**   | TailwindCSS, Framer Motion             | Responsive UI & Animations       |
| **Backend**   |  Firebase Functions                    | API Services & Logic             |
| **Database**  | Firestore                              | Persistent & Analytical Storage  |
| **AI/ML**     | Gemini API                             | Predictive Cost Modeling         |
| **DevOps**    | GitHub Actions, Docker                 | CI/CD & Deployment               |
| **Monitoring**| Sentry, Prometheus                     | Error Tracking & Performance     |

---



## 🌐 API Reference

| Endpoint            | Method | Description                       |
|---------------------|--------|-----------------------------------|
| `/api/estimate`     | POST   | Calculate project cost using Gemini API |
| `/api/optimize`     | POST   | Get optimization suggestions using Gemini API |
| `/api/report`       | POST   | Generate and download PDF report  |
| `/api/auth/login`   | POST   | User authentication via Firebase API |

---

## 🗂️ Folder Structure


```bash

BuildWise/
├── frontend/
│   ├── public/
│   │   ├── assets/                 # Image assets
│   │   │   ├── arsh.png
│   │   │   ├── BuildWise.svg
│   │   │   ├── person1.png
│   │   │   ├── priyanshi.png
│   │   │   └── vite.svg
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── login-model.jsx     
│   │   │   │   └── signup-model.jsx    
│   │   │   ├── Dashboard/             # Charts, CostSummary
│   │   │   │   ├── CostBreakdownChart.jsx
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   └── RecentActivity.jsx
│   │   │   ├── Forms/
│   │   │   │   ├── MaterialSelector.jsx
│   │   │   │   └── ProjectForm.jsx
│   │   │   ├── Layout/
│   │   │   │   └── Navbar.jsx
│   │   │   └── Report/
│   │   │       └── ReportDocument.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditProjectPage.jsx
│   │   │   ├── Estimate.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── NewProjectPage.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Optimize.jsx          # Suggestions, Comparison
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── auth.js             # Firebase admin SDK setup
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── docs/
├── scripts/
├── .env.example
├── .gitignore
├── LICENSE
└── README.md

```


## 🤝 Contributing
Fork the repo.

Create a new branch (git checkout -b feature/new-feature).

Commit changes (git commit -m "Add new feature").

Push to branch (git push origin feature/new-feature).

Open a Pull Request.




<div align="center"> <h3>🚀 Built with ❤ by Team Synapse 🚀</h3> <p>Contact: <a href="mailto:arshtiwari12345@gmail.com">arshtiwari12345@gmail.com</a></p> </div> 
