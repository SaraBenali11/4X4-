// src/pages/Contact.jsx
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
import FollowUs from "../components/FollowUs";
import "../styles/contact.css";

export default function Contact() {
  return (
    <main className="contact-page">
      <h1 className="contact-title">Contactez-nous</h1>
      <p className="contact-subtitle">
        Notre équipe est là pour répondre à toutes vos questions. N'hésitez pas
        à nous contacter.
      </p>

      <div className="contact-grid">
        <ContactForm />
        <div className="right-column">
          <ContactInfo />
          <FollowUs />
        </div>
      </div>
    </main>
  );
}
