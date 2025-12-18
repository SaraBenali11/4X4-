import React from "react";
import "../styles/contact.css";

export default function ContactForm() {
  return (
    <section className="card">
      <h2>Envoyez-nous un message</h2>

      <form className="form">
        <label>Nom complet</label>
        <input type="text" placeholder="Votre nom" />

        <label>Email</label>
        <input type="email" placeholder="votre.email@exemple.com" />

        <label>Téléphone</label>
        <input type="tel" placeholder="+213 XXX XXX XXX" />

        <label>Sujet</label>
        <input type="text" placeholder="Sujet de votre message" />

        <label>Message</label>
        <textarea rows="4" placeholder="Votre message..." />

        <button type="submit" className="btn-primary">
          ✈ Envoyer le message
        </button>
      </form>
    </section>
  );
}
