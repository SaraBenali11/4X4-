import React from "react";
import "../styles/contact.css";

export default function ContactInfo() {
  return (
    <section className="card">
      <h2>Informations générales</h2>

      <div className="info-item">
        📧{" "}
        <div>
          <strong>Email</strong>
          <p>contact@sutraty.dz</p>
        </div>
      </div>
      <div className="info-item">
        📞{" "}
        <div>
          <strong>Téléphone</strong>
          <p>+213 XXX XXX XXX</p>
        </div>
      </div>
      <div className="info-item">
        ⏰{" "}
        <div>
          <strong>Horaires d'ouverture</strong>
          <p>Dimanche - Jeudi : 9h - 18h</p>
          <p>Vendredi : 14h - 18h</p>
          <p>Samedi : 10h - 17h</p>
        </div>
      </div>
    </section>
  );
}
