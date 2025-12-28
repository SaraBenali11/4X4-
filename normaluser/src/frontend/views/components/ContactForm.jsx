import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../styles/contact.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError(true);
      return;
    }

    emailjs
      .send(
        "service_qvou8fu",
        "template_930wrjx",
        formData,
        "TKvxcyNi9ZkOUPm03"
      )
      .then(
        () => {
          setSubmitted(true);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
          setTimeout(() => setSubmitted(false), 3000);
        },
        (err) => {
          console.error(err);
          setError(true);
        }
      );
  };

  return (
    <section className="contact-form-card">
      <div className="form-header">
        <h2>Envoyez-nous un message</h2>
        <p>Donnez nous votre avis, posez vos questions, suggestion..etc </p>
      </div>

      {submitted && (
        <div className="success-message">✓ Message envoyé avec succès !</div>
      )}

      {error && (
        <div className="error-message">
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom complet *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Sujet</label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Sujet de votre message"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            placeholder="Votre message"
            required
          />
        </div>

        <button type="submit" className="btn-submit">
          Envoyer le message
        </button>
      </form>
    </section>
  );
}
