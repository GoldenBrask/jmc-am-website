import React from 'react';
import { Linkedin, Facebook, Youtube, Instagram, Twitter, MapPin, Mail } from 'lucide-react';
import content from '../data/content.json';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { association } = content;

  return (
    <footer className="footer">
      <div className="container footer-content-wrapper">

        {/* TOP: Description */}
        <div className="footer-description-section">
          <p className="footer-text">
            Créée en 2013, Junior MIAGE Concept Aix-Marseille est composée chaque année d'une dizaine de membres
            qui ont pour objectifs d'encadrer vos projets, de développer et pérenniser notre structure.
            Les membres de la Junior peuvent compter sur le savoir-faire dispensé dans leur formation et par les plus
            grandes entreprises du numérique (Capgemini, Alten, SopraSteria, CGI).
          </p>
        </div>

        {/* MIDDLE: Info Columns */}
        <div className="footer-info-row">
          <div className="info-col">
            <div className="icon-circle"><MapPin size={24} /></div>
            <p>
              15 Allée Claude Forbin 13100<br />
              Aix-En-Provence
            </p>
          </div>

          <div className="info-col brand-col-center">
            <img
              src="/images/Logo_JMC_AM_blanc.png"
              alt="JMC Logo"
              style={{ width: '150px', marginBottom: '1.5rem' }}
            />
            <a href="mailto:contact@jmc-aixmarseille.fr" className="btn-footer-contact">
              Nous Contacter
            </a>
          </div>

          <div className="info-col">
            <div className="icon-circle"><Mail size={24} /></div>
            <p>contact@jmc-aixmarseille.fr</p>
          </div>
        </div>

        {/* BOTTOM: Socials */}
        <div className="footer-socials-row">
          <div className="social-icons">
            <a href={association.reseaux_sociaux.facebook} target="_blank" rel="noreferrer"><Facebook size={18} /></a>
            <a href="#" target="_blank" rel="noreferrer"><Twitter size={18} /></a>
            <a href={association.reseaux_sociaux.linkedin_entreprise} target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
            <a href="#" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
            <a href={association.reseaux_sociaux.youtube} target="_blank" rel="noreferrer"><Youtube size={18} /></a>
          </div>
        </div>

      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--color-border);
          padding: 2rem 0; /* Reduced padding */
          background: var(--color-bg); /* Reverted to Dark Theme */
          color: var(--color-text-muted);
          text-align: center;
        }

        .footer-content-wrapper {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          align-items: center;
        }

        .footer-text {
          max-width: 900px;
          margin: 0 auto;
          line-height: 1.6;
          font-size: 1rem;
          font-weight: 400;
          color: var(--color-text-muted);
        }

        .footer-info-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 1000px;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          min-width: 250px;
        }

        .icon-circle {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: white; /* Keep icons white/bright */
        }

        .brand-col-center {
           display: flex;
           justify-content: center;
           align-items: center;
           padding-top: 1rem; 
           flex-direction: column; /* Ensure logo sits above button */
        }

        .btn-footer-contact {
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          padding: 10px 24px;
          border-radius: 6px;
          text-transform: uppercase;
          font-weight: 600;
          transition: all 0.3s;
          background: transparent;
          font-size: 0.9rem;
        }
        .btn-footer-contact:hover {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 0 15px var(--color-primary-glow);
        }

        .social-icons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .social-icons a {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.05);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .social-icons a:hover {
          transform: translateY(-3px);
          background: var(--color-primary);
          color: white;
        }

        @media (max-width: 768px) {
          .footer-info-row {
            flex-direction: column;
            align-items: center;
          }
          .brand-col-center {
            order: 3;
          }
        }
      `}</style>
    </footer>
  );
}
