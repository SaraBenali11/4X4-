import styles from "./activitylog.module.css";

const activities = [
  {
    title: "Produit ajouté",
    desc: 'Ajout de "Abaya Élégante Noire"',
    time: "10 Déc 2025, 14:15",
  },
  {
    title: "Commande approuvée",
    desc: "Commande #12345 approuvée",
    time: "10 Déc 2025, 13:45",
  },
  {
    title: "Commande rejetée",
    desc: "Stock insuffisant",
    time: "09 Déc 2025, 16:30",
  },
];

export default function ActivityLog() {
  return (
    <div className={styles.card}>
      <h4>Activité Récente</h4>

      <div className={styles.timeline}>
        {activities.map((a, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.dot} />
            <div>
              <strong>{a.title}</strong>
              <p>{a.desc}</p>
            </div>
            <span className={styles.time}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
