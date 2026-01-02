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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("Veuillez remplir les champs requis (nom, email, message).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email invalide.");
      return;
    }

    // Route contact messages through the same EmailJS service used for order emails
    const emailParams = {
      to_name: "Sutraty Team",
      to_email: "sutratyco@gmail.com", // receiving inbox
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      subject: formData.subject || "Contact Sutraty",
      message: formData.message,
      customer_name: formData.name,
      customer_email: formData.email,
      order_date: "",
      delivery_address: "",
      ordered_items: "",
      total_amount: "",
    };

    setLoading(true);

    emailjs
      .send(
        "service_j0tmr7g",
        "template_pywan6o",
        emailParams,
        "dnotdgi_FL1bPL9Nr"
      )
      .then(
        (result) => {
          console.log("Contact email sent", result);
          setSubmitted(true);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
          setTimeout(() => setSubmitted(false), 3000);
          setLoading(false);
        },
        (err) => {
          console.error("Contact email error", err);
          setError(
            err?.text ||
              err?.message ||
              "Une erreur est survenue. Veuillez réessayer."
          );
          setLoading(false);
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

      {error && <div className="error-message">{error}</div>}

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
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Votre email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Votre numéro"
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

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Envoi en cours..." : "Envoyer le message"}
        </button>
      </form>
    </section>
  );
}
