import styles from "./adminprofile.module.css";

export default function AdminProfile() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>👤</div>
        <div>
          <h3>Admin Sutrarty</h3>
          <p>Administrateur Principal</p>
        </div>
      </div>

      <div className={styles.grid}>
        <Info label="Email" value="admin@sutrarty.dz" />
        <Info label="Téléphone" value="+213 XXX XXX XXX" />
        <Info label="Membre depuis" value="15 Janvier 2024" />
        <Info label="Dernière connexion" value="10 Décembre 2025, 14:30" />
      </div>
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
