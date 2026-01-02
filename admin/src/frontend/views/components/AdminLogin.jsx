import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";
import LoginInput from "./LoginInput";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: contextLogin } = useAdminAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("Attempting login...");
      const result = await contextLogin(email, password);
      console.log("Login result:", result);

      if (result.success) {
        console.log("Login successful, redirecting...");
        // Redirect to homepage after login (admin can navigate anywhere)
        navigate("/", { replace: true });
      } else {
        console.error("Login failed:", result.error);
        setErrors({
          general: result.error || "Email ou mot de passe incorrect",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Erreur de connexion. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div
              className="error-message"
              style={{
                color: "red",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {errors.general}
            </div>
          )}

          <LoginInput
            label="Email"
            type="email"
            placeholder="admin.sutraty@gmail.com"
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
