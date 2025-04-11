# BuildWise

## BuildWise is a web-based construction cost estimator that helps civil engineers, contractors, and architects accurately predict project costs and optimize budgets using AI-driven insights.

✅ Real-time cost calculations

✅ Material & labor optimization

✅ Interactive dashboards & reports

Live Demo: https://buildwise.app (placeholder link)


## ✨ Features

1. Smart Cost Estimation
Input project dimensions, materials, and labor hours.

Automatic cost breakdown (materials, labor, overheads).

2. AI-Powered Optimization
Suggests alternative materials (e.g., "Use bamboo instead of oak").

Compares original vs. optimized costs.

3. Interactive Dashboard
Charts & graphs for cost visualization.

Real-time updates on budget changes.

4. Report Generation
Download PDF reports with cost breakdowns.

Save project history (for registered users).

5. Dynamic Pricing
Fetches real-time material costs from APIs.






## Folder Structure:

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

