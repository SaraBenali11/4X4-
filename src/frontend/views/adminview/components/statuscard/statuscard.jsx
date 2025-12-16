import styles from "./statuscard.module.css";

export default function StatusCard() {
  return (
    <div className={styles.card}>
      <h4>Statut du compte</h4>
      <div className={styles.status}>
        <span className={styles.dot} />
        Actif
      </div>
    </div>
  );
}
