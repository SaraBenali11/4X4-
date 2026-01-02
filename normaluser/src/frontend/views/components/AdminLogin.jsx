import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";
import LoginInput from "./LoginInput";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email est requis";
    } else if (!validateEmail(email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!password) {
      newErrors.password = "Mot de passe est requis";
    }

    if (Object.keys(newErrors).length === 0) {
      // Login logic here
      // For demo purposes
      if (email === "admin@boubaaya.dz" && password === "admin123") {
        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        alert("Email ou mot de passe incorrect");
      }
    }

    setErrors(newErrors);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <LoginInput
            label="Email"
            type="email"
            placeholder="admin@boubaaya.dz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <LoginInput
            label="Mot de passe"
            type="password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>

        <div className="demo-info">
          <p>Demo: admin@boubaaya.dz / admin123</p>
        </div>
      </div>
    </div>
  );
}

