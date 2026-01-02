import { useState } from "react";
import styles from "./statuscard.module.css";
import { User } from "lucide-react";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";

export default function StatusCard() {
  const { admin, updateProfile } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!admin) {
    return null;
  }

  // Extract name parts (assuming name might contain first and last name)
  const nameParts = admin.name ? admin.name.split(" ") : [];
  const firstName = nameParts[0] || "Admin";
  const lastName = nameParts.slice(1).join(" ") || "";
  const username = admin.email ? admin.email.split("@")[0] : "admin";

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Veuillez saisir et confirmer le mot de passe.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      setLoading(true);
      const result = await updateProfile({ password });
      if (result?.success) {
        setMessage("Mot de passe mis à jour.");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(result?.error || "Échec de la mise à jour.");
      }
    } catch (err) {
      setError("Échec de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={32} />
        </div>
        <div className={styles.headerInfo}>
          <h3>{admin.name || "Admin Sutraty"}</h3>
          <p className={styles.role}>Administrateur Principal</p>
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Prénom</span>
          <strong className={styles.value}>{firstName}</strong>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Nom de famille</span>
          <strong className={styles.value}>{lastName || "N/A"}</strong>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Nom d'utilisateur</span>
          <strong className={styles.value}>{username}</strong>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Email</span>
          <strong className={styles.value}>{admin.email || "N/A"}</strong>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Téléphone</span>
          <strong className={styles.value}>{admin.phone || "N/A"}</strong>
        </div>
      </div>

      <div className={styles.statusSection}>
        <span className={styles.statusLabel}>Statut du compte</span>
        <div className={styles.status}>
          <span className={styles.dot} />
          Actif
        </div>
      </div>

      <div className={styles.passwordSection}>
        <div className={styles.passwordHeader}>
          <h4>Changer le mot de passe</h4>
          <p>Mettez à jour vos informations de connexion.</p>
        </div>

        {message && <div className={styles.passwordSuccess}>{message}</div>}
        {error && <div className={styles.passwordError}>{error}</div>}

        <form className={styles.passwordForm} onSubmit={handleChangePassword}>
          <label className={styles.passwordLabel} htmlFor="newPassword">
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className={styles.passwordInput}
          />

          <label className={styles.passwordLabel} htmlFor="confirmPassword">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            className={styles.passwordInput}
          />

          <button
            type="submit"
            className={styles.passwordButton}
            disabled={loading}
          >
            {loading ? "Mise à jour..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
