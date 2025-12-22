import React, { useEffect } from 'react';
import { X, Linkedin, Mail, GraduationCap, Briefcase, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_URL } from '../config';

export default function TeamModal({ member, isOpen, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !member) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="modal-header">
            <h3>Profil de {member.nom}</h3>
          </div>

          <div className="modal-body">
            <div className="profile-header">
              <div className="profile-image-container">

                {/* ... */}
                <img
                  src={member.image && member.image.startsWith('/uploads')
                    ? `${BACKEND_URL}${member.image}`
                    : (member.image || "/images/Mini_logo_JMC_AM_blanc.png")
                  }
                  alt={member.nom || member.name}
                  className="profile-modal-image"
                  onError={(e) => { e.target.src = "/images/Mini_logo_JMC_AM_blanc.png" }}
                />
              </div>
              <div className="profile-main-info">
                <h2>{member.name || member.nom}</h2>
                <p className="profile-role">{member.role || member.poste}</p>
                <div className="profile-bio-text">
                  {member.bio || "Membre actif de la Junior-Entreprise."}
                </div>

                <div className="profile-actions">
                  {member.linkedin_url_theorique && (
                    <a href={member.linkedin_url_theorique} target="_blank" rel="noopener noreferrer" className="btn-modal-action">
                      <Linkedin size={18} /> LinkedIn
                    </a>
                  )}
                  <a href={`mailto:contact@jmc-aixmarseille.fr`} className="btn-modal-action">
                    <Mail size={18} /> Email
                  </a>
                </div>
              </div>
            </div>

            <div className="profile-details-grid">

              <div className="detail-section">
                <h4>Compétences</h4>
                <div className="skills-container">
                  {member.competences && member.competences.length > 0 ? (
                    member.competences.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))
                  ) : (
                    <span className="text-muted text-sm">Non renseigné</span>
                  )}
                </div>
              </div>

              {member.experience && (
                <div className="detail-section">
                  <h4><Briefcase size={18} className="icon-inline" /> Expérience</h4>
                  <p>{member.experience}</p>
                </div>
              )}

              {member.formation && (
                <div className="detail-section">
                  <h4><GraduationCap size={18} className="icon-inline" /> Formation</h4>
                  <p>{member.formation}</p>
                </div>
              )}

              {member.projets && member.projets.length > 0 && (
                <div className="detail-section">
                  <h4><Award size={18} className="icon-inline" /> Projets</h4>
                  <ul className="projects-list">
                    {member.projets.map((projet, idx) => (
                      <li key={idx}>{projet}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .modal-content {
          background: #1e293b; /* Slate 800 */
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          color: #f8fafc;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s;
          z-index: 10;
        }
        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .modal-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #94a3b8;
        }

        .modal-body {
          padding: 2rem;
        }

        /* Profile Header Layout */
        .profile-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
          align-items: center;
        }

        .profile-image-container {
          flex-shrink: 0;
        }
        .profile-modal-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #334155;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        }

        .profile-main-info h2 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          color: white;
        }
        
        .profile-role {
          color: var(--color-primary, #3b82f6);
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .profile-bio-text {
          color: #cbd5e1;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-modal-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.6rem 1.2rem;
          background: white;
          color: #0f172a;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .btn-modal-action:hover {
          transform: translateY(-2px);
          background: #f1f5f9;
        }

        /* Details Grid */
        .profile-details-grid {
          display: grid;
          gap: 1.5rem;
        }

        .detail-section h4 {
          font-size: 1.1rem;
          color: white;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detail-section p {
          color: #cbd5e1;
          margin: 0;
        }

        .icon-inline {
          color: #64748b;
        }

        /* Skills */
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .skill-tag {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .projects-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .projects-list li {
          position: relative;
          padding-left: 1.2rem;
          margin-bottom: 0.5rem;
          color: #cbd5e1;
        }
        .projects-list li:before {
          content: "•";
          color: var(--color-primary, #3b82f6);
          position: absolute;
          left: 0;
          top: 0;
          font-weight: bold;
        }

        @media (max-width: 640px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
          .profile-actions {
            justify-content: center;
          }
          .modal-content {
            margin: 1rem;
            max-height: 85vh;
          }
        }
      `}</style>
    </AnimatePresence >
  );
}
