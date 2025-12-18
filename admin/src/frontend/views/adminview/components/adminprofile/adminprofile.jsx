import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../../../context/AdminAuthContext";
import styles from "./adminprofile.module.css";

export default function AdminProfile() {
  const { admin, updateProfile, refreshProfile } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        phone: admin.phone || "",
        address: admin.address || "",
      });
    }
  }, [admin]);

  useEffect(() => {
    // Refresh profile on mount
    refreshProfile();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Basic phone validation - adjust as needed
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return !phone || phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.email) {
      newErrors.email = "Email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccessMessage("Profil mis à jour avec succès!");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ general: result.error || "Erreur lors de la mise à jour" });
      }
    } catch (error) {
      setErrors({ general: "Erreur lors de la mise à jour du profil" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original admin data
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        phone: admin.phone || "",
        address: admin.address || "",
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!admin) {
    return (
      <div className={styles.card}>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>👤</div>
        <div>
          <h3>{admin.name || "Admin Sutraty"}</h3>
          <p>Administrateur Principal</p>
        </div>
        {!isEditing && (
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            ✏️ Modifier
          </button>
        )}
      </div>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      {errors.general && (
        <div className={styles.errorMessage}>{errors.general}</div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
            />
            {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+213 XXX XXX XXX"
            />
            {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Adresse</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Votre adresse complète"
              rows="3"
            />
            {errors.address && <span className={styles.fieldError}>{errors.address}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Nouveau mot de passe"
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.grid}>
          <Info label="Email" value={admin.email || "N/A"} />
          <Info label="Téléphone" value={admin.phone || "N/A"} />
          <Info label="Adresse" value={admin.address || "N/A"} />
          <Info
            label="Membre depuis"
            value={formatDate(admin.created_at)}
          />
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className={styles.info}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
