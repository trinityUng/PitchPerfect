import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Profile from "./pages/Profile.jsx";
import Present from "./pages/Present.jsx";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/present" element={<Present />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
