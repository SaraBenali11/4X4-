import React from "react";
import { MdEmail, MdPhone, MdLocationOn, MdSchedule } from "react-icons/md";
import { COMPANY_INFO } from "../../config/constants";
import "../styles/contact.css";

export default function ContactInfo() {
  return (
    <section className="contact-info-card">
      <div className="info-header">
        <h2>Informations générales</h2>
        <p>Nous sommes là pour vous aider</p>
      </div>

      <div className="info-items">
        <div className="info-item">
          <div className="info-icon">
            <MdEmail />
          </div>
          <div className="info-content">
            <h3>Email</h3>
            <a href={`mailto:${COMPANY_INFO.EMAIL}`}>{COMPANY_INFO.EMAIL}</a>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <MdPhone />
          </div>
          <div className="info-content">
            <h3>Téléphone</h3>
            <a href={`tel:${COMPANY_INFO.PHONE}`}>{COMPANY_INFO.PHONE}</a>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <MdLocationOn />
          </div>
          <div className="info-content">
            <h3>Localisation</h3>
            <p>{COMPANY_INFO.LOCATION}</p>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <MdSchedule />
          </div>
          <div className="info-content">
            <h3>Horaires d'ouverture</h3>
            <p>Dimanche - Jeudi : 9h - 18h</p>
            <p>Vendredi : 14h - 18h</p>
            <p>Samedi : 10h - 17h</p>
          </div>
        </div>
      </div>
    </section>
  );
}
