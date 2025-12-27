import styles from "./statuscard.module.css";
import { User } from "lucide-react";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";

export default function StatusCard() {
  const { admin } = useAdminAuth();

  if (!admin) {
    return null;
  }

  // Extract name parts (assuming name might contain first and last name)
  const nameParts = admin.name ? admin.name.split(" ") : [];
  const firstName = nameParts[0] || "Admin";
  const lastName = nameParts.slice(1).join(" ") || "";
  const username = admin.email ? admin.email.split("@")[0] : "admin";

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
    </div>
  );
}
