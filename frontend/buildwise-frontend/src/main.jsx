import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Authcontext"; // Assuming this is correct path
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
