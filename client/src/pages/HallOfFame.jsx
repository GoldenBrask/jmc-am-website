import React, { useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import api from '../services/api';
import TeamModal from '../components/TeamModal';
import { BACKEND_URL } from '../config';

const previousMandates = [
  {
    year: "2023",
    members: [
      { nom: "Thomas DUPONT", poste: "Président" },
      { nom: "Marie MARTIN", poste: "Secrétaire Général" },
      { nom: "Lucas BERNARD", poste: "Trésorier" }
    ]
  },
  {
    year: "2022",
    members: [
      { nom: "Sarah PETIT", poste: "Présidente" },
      { nom: "Hugo RICHARD", poste: "Vice-Président" },
      { nom: "Emma ROBERT", poste: "Responsable Commercial" }
    ]
  }
];

export default function HallOfFame() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamByMandate, setTeamByMandate] = useState({});
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        // Group by mandateYear
        const grouped = res.data.reduce((acc, member) => {
          const year = member.mandateYear || '2025';
          if (!acc[year]) acc[year] = [];
          acc[year].push(member);
          return acc;
        }, {});

        setTeamByMandate(grouped);
        // Sort years descending
        setYears(Object.keys(grouped).sort((a, b) => b.localeCompare(a)));
      } catch (err) {
        console.error("Failed to fetch team", err);
      }
    };
    fetchTeam();
  }, []);

  // Helper to render a member card
  const renderMemberCard = (member, idx) => (
    <div key={member.id || idx} className="team-card-premium">
      <div className="avatar-wrapper">
        <div className="member-avatar-large">
          <img
            src={member.image && member.image.startsWith('/uploads')
              ? `${BACKEND_URL}${member.image}`
              : (member.image || "/images/Mini_logo_JMC_AM_blanc.png")
            }
            alt={member.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => { e.target.src = "/images/Mini_logo_JMC_AM_blanc.png" }}
          />
        </div>
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-float" title="LinkedIn">
            <Linkedin size={16} />
          </a>
        )}
      </div>

      <div className="member-info">
        <h4>{member.name}</h4>
        <p className="member-role">{member.role}</p>
      </div>

      <div className="card-footer">
        <button
          className="btn-profile"
          onClick={() => setSelectedMember(member)}
        >
          Voir le profil
        </button>
      </div>
    </div >
  );

  return (
    <div className="page-container">
      <TeamModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      {/* HERO */}
      <div className="hall-hero">
        <div className="container">
          <span className="section-label">HÉRITAGE & AVENIR</span>
          <h1>Notre Équipe</h1>
          <p>Découvrez ceux qui font vivre la Junior, aujourd'hui et hier.</p>
        </div>
      </div>

      <div className="container section">

        {years.length === 0 && <p className="text-center text-slate-400">Chargement de l'équipe...</p>}

        {years.map((year, index) => {
          const isCurrent = index === 0; // Assumption: Most recent year is current
          const members = teamByMandate[year];

          return (
            <div key={year}>
              <div className={`mandate-block ${isCurrent ? 'current' : 'previous'}`}>
                <div className="mandate-header-simple">
                  <h2 className="text-gradient">Mandat {year}</h2>
                  {isCurrent && <span className="badge-live">En cours</span>}
                </div>
                <div className="members-grid-premium">
                  {members.map((member, idx) => renderMemberCard(member, idx))}
                </div>
              </div>
              {/* Add separator except after the last item */}
              {index < years.length - 1 && <div className="timeline-separator"></div>}
            </div>
          );
        })}

      </div>

      <style>{`
        .hall-hero {
          padding: 8rem 0 4rem;
          text-align: center;
          background: radial-gradient(circle at bottom, rgba(59, 130, 246, 0.1), transparent 70%);
        }
        .section-label {
          color: var(--color-accent);
          font-weight: 700;
          letter-spacing: 0.1em;
          font-size: 0.875rem;
          text-transform: uppercase;
        }
        .hall-hero h1 {
          font-size: 3.5rem;
          margin: 1rem 0;
        }
        .hall-hero p {
          color: var(--color-text-muted);
          font-size: 1.2rem;
        }

        .mandate-block {
           margin-bottom: 6rem;
        }
        .mandate-header-simple {
           text-align: center;
           margin-bottom: 3rem;
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 1rem;
        }
        .mandate-header-simple h2 {
           font-size: 2.5rem;
        }
        .badge-live {
           background: var(--color-primary);
           color: white;
           padding: 6px 16px;
           border-radius: 99px;
           font-size: 0.85rem;
           font-weight: 700;
           box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
           animation: pulse 2s infinite;
        }

        .timeline-separator {
           height: 1px;
           background: linear-gradient(to right, transparent, var(--color-border), transparent);
           margin: 4rem auto;
           max-width: 600px;
        }

        /* PREMIUM GRID */
        .members-grid-premium {
           display: grid;
           grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Adaptive width */
           gap: 2rem;
           justify-content: center;
        }

        /* CARD STYLES (Copied & Adapted from Home) */
        .team-card-premium {
          background: var(--color-bg-card); 
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .team-card-premium:hover {
           transform: translateY(-5px);
           border-color: var(--color-primary);
           box-shadow: var(--shadow-glow);
        }

        .avatar-wrapper {
          position: relative;
          margin-bottom: 1.25rem;
        }
        .member-avatar-large {
          width: 100px; /* Slightly larger for main page */
          height: 100px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid var(--color-bg-card);
          overflow: hidden;
        }
        
        .linkedin-float {
          position: absolute;
          bottom: 0;
          right: 0;
          background: white;
          color: #0077b5;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
         .linkedin-float:hover {
          transform: scale(1.1);
        }

        .member-info h4 {
           color: var(--color-primary);
           font-size: 1.25rem;
           margin-bottom: 0.25rem;
           font-weight: 700;
        }
        .member-role {
           font-weight: 600;
           color: var(--color-text);
           font-size: 0.9rem;
           margin-bottom: 1rem;
        }
        
        .btn-profile {
          margin-top: auto;
          display: inline-block;
          padding: 0.6rem 1.5rem;
          background: transparent;
          border: 1px solid var(--color-primary);
          border-radius: 99px;
          color: var(--color-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.1);
        }
        .btn-profile:hover {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        @keyframes pulse {
           0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
           70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
           100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
    </div>
  );
}
