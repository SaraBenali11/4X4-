import styles from "./permissionscard.module.css";

const permissions = [
  "Gestion des produits",
  "Gestion des commandes",
  "Approbation des tenues",
  "Gestion des utilisateurs",
  "Accès aux statistiques",
];

export default function PermissionsCard() {
  return (
    <div className={styles.card}>
      <h4>Permissions</h4>
      <ul>
        {permissions.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
