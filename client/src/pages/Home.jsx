import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code, Database, Smartphone, Check, Users, Trophy, Target, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import content from '../data/content.json';
import TeamModal from '../components/TeamModal';
import api from '../services/api';
import { BACKEND_URL } from '../config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Variants
const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

export default function Home() {
  const { accueil } = content.contenu_pages;
  const [selectedMember, setSelectedMember] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        // Filter published articles and sort by date descending
        const published = res.data
          .filter(a => a.published)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestArticles(published);
      } catch (err) {
        console.error("Failed to fetch articles for home", err);
      }
    };

    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        // Filter for current mandate (2025)
        const currentYear = new Date().getFullYear().toString();
        // Or hardcode 2025 if that's the "current" mandate for the site despite calendar year
        const activeTeam = res.data.filter(m => m.mandateYear === currentYear || m.mandateYear === '2025');
        setTeamMembers(activeTeam);
      } catch (err) {
        console.error("Failed to fetch team", err);
      }
    }

    fetchArticles();
    fetchTeam();
  }, []);

  return (
    <div className="home-page">
      <TeamModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      {/* GLOWING HERO */}
      <section className="hero-section">
        {/* Animated Background Elements */}
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>

        <div className="container relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="hero-content">

            <motion.h1 variants={fadeInUp} className="hero-title">
              Concrétisez vos ambitions <br />
              <span className="text-gradient">Digitales</span>
            </motion.h1>
            <motion.div variants={fadeInUp} className="hero-badge" style={{ marginBottom: '1.5rem' }}>
              <span className="pulse-dot"></span> Certifié par la CNJE
            </motion.div>
            <motion.p variants={fadeInUp} className="hero-subtitle">
              Nous transformons vos idées en solutions web et mobiles performantes,
              portées par l'excellence académique de la MIAGE.
            </motion.p>
            <motion.div variants={fadeInUp} className="hero-cta">
              <a href="#contact" className="btn btn-primary">
                Démarrer un projet <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </a>
              <a href="/docs/jmc-brochure.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Notre brochure
              </a>
              <Link to="/hall-of-fame" className="btn btn-outline">
                Découvrir l'équipe
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="container stats-flex">
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Années d'existence</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Projets livrés</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">30+</span>
            <span className="stat-label">Membres</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
        </div>
      </div>

      {/* BENTO GRID SERVICES */}
      <section className="section section-services" id="services">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-header">
            <h2 className="text-gradient">Notre Expertise</h2>
            <p>Une approche 360° pour vos besoins numériques</p>
          </motion.div>

          <div className="bento-grid">
            <div className="bento-card large">
              <div className="card-icon"><Code size={32} /></div>
              <h3>Développement Web</h3>
              <p>Sites vitrines, e-commerce, et applications web complexes sur-mesure.</p>
              <div className="tech-stack">
                <span>React</span><span>Node</span><span>Next.js</span>
              </div>
            </div>
            <div className="bento-card">
              <div className="card-icon"><Smartphone size={32} /></div>
              <h3>Mobile Apps</h3>
              <p>Applications natives et cross-platform.</p>
            </div>
            <div className="bento-card">
              <div className="card-icon"><Database size={32} /></div>
              <h3>Data & IA</h3>
              <p>Analyse de données et intégration intelligente.</p>
            </div>
            <div className="bento-card wide">
              <div className="card-content-side">
                <div className="card-icon"><Target size={32} /></div>
                <div>
                  <h3>Transformation Digitale</h3>
                  <p>Conseil et audit pour moderniser vos processus métier.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY SECTION */}
      <section className="section section-methodology">
        <div className="container">
          <div className="section-header">
            <h2>Notre Méthodologie</h2>
            <p>{content.contenu_pages.accueil.section_methodologie.intro}</p>
          </div>
          <div className="steps-container">
            {content.contenu_pages.accueil.section_methodologie.etapes.map((step, i) => (
              <div key={i} className="step-card-modern">
                <div className="step-circle">{step.etape}</div>
                <h4>{step.nom}</h4>
                <p>{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT & VALUES SECTION */}
      <section className="section section-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>L'esprit <span className="text-gradient">JMC</span></h2>
              <h3 className="slogan-text">"L'envie d'apprendre et d'entreprendre"</h3>
              <p>
                Junior MIAGE Concept Aix-Marseille est une association étudiante ayant pour vocation de valoriser
                à travers des projets à plus-value pédagogique les compétences des étudiants d’Aix-Marseille Université.
              </p>
              <p>
                Cette initiative rassemble des étudiants motivés, dynamiques et prêts à appliquer sur le terrain
                des compétences reconnues professionnellement en répondant aux besoins de clients divers
                (entreprises, collectivités locales, associations, créateurs d’entreprise, etc.).
              </p>
            </div>
            <div className="values-grid">
              {['Cohésion', 'Ambition', 'Partage', 'Persévérance'].map((val, i) => (
                <div key={i} className="value-card">
                  <Trophy size={24} className="value-icon" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM CAROUSEL SWIPER */}
      <section className="section section-team" id="equipe">
        <div className="container" style={{ overflow: 'visible' }}> {/* Allow overflow for peeking */}
          <div className="section-header">
            <h2>Notre Équipe</h2>
            <p>Des étudiants passionnés et compétents</p>
            <div className="mt-6">
              <Link to="/hall-of-fame" className="btn btn-outline">
                Découvrir toute l'équipe
              </Link>
            </div>
          </div>

          <div className="team-swiper-container">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              centeredSlides={true}
              loop={true}
              speed={800}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={false}
              breakpoints={{
                640: {
                  slidesPerView: 1.5, // Peek on mobile
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3.5, // Peak on desktop
                  spaceBetween: 40,
                },
              }}
              className="mySwiper"
            >
              {teamMembers.map((member, idx) => (
                <SwiperSlide key={member.id || idx} style={{ height: 'auto' }}>
                  <div className="team-card-home h-full">
                    <div className="avatar-wrapper">
                      <div className="member-avatar-large">
                        {/* ... (in render) */}
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
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION - INFINITE SCROLL */}
      <section className="section section-partners" style={{ overflow: 'hidden' }}>
        <div className="section-header">
          <h2>Ils nous font confiance</h2>
        </div>

        {/* Marquee Container */}
        <div className="marquee-container">
          {/* Track - Duplicated content for seamless loop */}
          <div className="marquee-track">
            {/* Set 1 */}
            {[
              { name: 'EY', src: '/images/logo-partenaire/ey.png' },
              { name: 'Engie', src: '/images/logo-partenaire/engie.png' },
              { name: 'Alten', src: '/images/logo-partenaire/alten.png' },
              { name: 'BNP Paribas', src: '/images/logo-partenaire/bnpp.png' },
              { name: 'CNJE', src: '/images/logo-partenaire/cnje.png' },
              { name: 'JEM', src: '/images/logo-partenaire/JEM.png' },
              { name: 'MIAGE CONNECTION', src: '/images/logo-partenaire/miageconnection.png' },
              { name: 'AMU', src: '/images/logo-partenaire/amu.png' },
              { name: 'PEAKS', src: '/images/logo-partenaire/peaks.png' }
            ].map((p, i) => (
              <div key={`s1-${i}`} className="partner-logo-wrapper">
                <img src={p.src} alt={p.name} className="partner-logo-img" />
              </div>
            ))}

            {/* Set 2 (Duplicate) */}
            {[
              { name: 'EY', src: '/images/logo-partenaire/ey.png' },
              { name: 'Engie', src: '/images/logo-partenaire/engie.png' },
              { name: 'Alten', src: '/images/logo-partenaire/alten.png' },
              { name: 'BNP Paribas', src: '/images/logo-partenaire/bnpp.png' },
              { name: 'CNJE', src: '/images/logo-partenaire/cnje.png' },
              { name: 'JEM', src: '/images/logo-partenaire/JEM.png' },
              { name: 'MIAGE CONNECTION', src: '/images/logo-partenaire/miageconnection.png' },
              { name: 'AMU', src: '/images/logo-partenaire/amu.png' },
              { name: 'PEAKS', src: '/images/logo-partenaire/peaks.png' }
            ].map((p, i) => (
              <div key={`s2-${i}`} className="partner-logo-wrapper">
                <img src={p.src} alt={p.name} className="partner-logo-img" />
              </div>
            ))}

            {/* Set 3 (Duplicate for extra smoothness on wide screens) */}
            {[
              { name: 'EY', src: '/images/logo-partenaire/ey.png' },
              { name: 'Engie', src: '/images/logo-partenaire/engie.png' },
              { name: 'Alten', src: '/images/logo-partenaire/alten.png' },
              { name: 'BNP Paribas', src: '/images/logo-partenaire/bnpp.png' },
              { name: 'CNJE', src: '/images/logo-partenaire/cnje.png' },
              { name: 'JEM', src: '/images/logo-partenaire/JEM.png' },
              { name: 'MIAGE CONNECTION', src: '/images/logo-partenaire/miageconnection.png' },
              { name: 'AMU', src: '/images/logo-partenaire/amu.png' },
              { name: 'PEAKS', src: '/images/logo-partenaire/peaks.png' }
            ].map((p, i) => (
              <div key={`s3-${i}`} className="partner-logo-wrapper">
                <img src={p.src} alt={p.name} className="partner-logo-img" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}
      {latestArticles.length > 0 && (
        <section className="section section-blog">
          <div className="container">
            <div className="section-header">
              <h2 className="text-gradient">Dernières Actualités</h2>
              <p>Restez informés sur nos projets et la vie de la structure</p>
            </div>

            <div className="articles-grid-home">
              {latestArticles.slice(0, 3).map((article) => (
                <div key={article.id} className="article-card-home">
                  <div className="card-image-wrapper">
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="card-img" />
                    ) : (
                      <div className="card-img-placeholder"></div>
                    )}
                    <span className="card-category">{article.category}</span>
                  </div>
                  <div className="card-body">
                    <span className="card-date">
                      {new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <Link to={`/blog/${article.slug || article.id}`} className="read-more">
                      Lire la suite <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/blog" className="btn btn-primary">
                Voir tous les articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CNJE VISUAL SECTION (SCREENSHOT MATCH) */}
      <section className="section section-cnje-visual">
        <div className="container">
          <div className="cnje-visual-grid">
            <div className="cnje-logo-side">
              <img src="/images/logo-partenaire/cnje.png" alt="Logo CNJE" className="cnje-main-logo" />
            </div>
            <div className="cnje-text-side">
              <h3>{content.contenu_pages.accueil.explication_cnje.titre}</h3>
              <p>{content.contenu_pages.accueil.explication_cnje.texte}</p>
              <a href="https://cnje.org/" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* HERO */
        .hero-section {
          min-height: 80vh; /* Reduced height so stats are visible sooner */
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding-top: 80px;
          padding-bottom: 2rem; /* Add padding at bottom to separate from stats slightly if needed, or keeping it flush */
        }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          z-index: 0;
        }
        .orb-1 {
          width: 400px;
          height: 400px;
          background: var(--color-primary);
          top: -100px;
          left: -100px;
          animation: float 10s infinite alternate;
        }
        .orb-2 {
          width: 500px;
          height: 500px;
          background: var(--color-accent);
          bottom: -100px;
          right: -100px;
          animation: float 12s infinite alternate-reverse;
        }
        /* PARTNERS MARQUEE */
        .section-partners {
           background: var(--color-bg);
           padding: 4rem 0;
           width: 100%;
        }
        .marquee-container {
           width: 100%;
           overflow: hidden;
           white-space: nowrap;
           position: relative;
        }
        .marquee-track {
           display: flex;
           gap: 4rem; /* Spacing between logos */
           align-items: center;
           width: max-content;
           animation: marquee-scroll 30s linear infinite;
        }
        .marquee-track:hover {
           animation-play-state: paused; /* Optional: Pause on hover */
        }

        .partner-logo-wrapper {
           width: 160px;
           height: 90px;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: all 0.3s;
           flex-shrink: 0; /* Prevent squishing */
        }
        .partner-logo-wrapper:hover {
           transform: scale(1.1);
        }
        .partner-logo-img {
           max-width: 100%;
           max-height: 100%;
           object-fit: contain;
        }
        
        @keyframes marquee-scroll {
           0% { transform: translateX(0); }
           100% { transform: translateX(-33.33%); } /* Loop perfectly with 3 sets */
        }
        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 99px;
          color: var(--color-accent);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--color-accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--color-accent);
        }
        .hero-title {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        /* BENTO GRID */
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .section-header p {
          color: var(--color-text-muted);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, minmax(250px, auto));
          gap: 1.5rem;
        }
        .bento-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }
        .bento-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-5px);
          box-shadow: var(--shadow-glow);
        }
        .bento-card.large {
          grid-column: span 1;
          grid-row: span 2;
          background: linear-gradient(to bottom right, var(--color-bg-card), #1e3a8a);
        }
        .bento-card.wide {
          grid-column: span 2;
        }
        
        .card-icon {
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-primary);
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        .bento-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .bento-card p {
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .tech-stack {
          margin-top: auto;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .tech-stack span {
          background: rgba(0,0,0,0.2);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .card-content-side {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        /* STATS STRIP */
        .stats-strip {
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: 2rem 0; /* Reduced padding */
          background: rgba(15, 23, 42, 0.6); /* Slightly darker/transparent */
          backdrop-filter: blur(10px);
          margin-top: -1px; /* Remove gap */
          margin-bottom: 4rem;
        }
        .stats-flex {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .stat-item {
          text-align: center;
        }
        .stat-number {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: white;
        }
        .stat-label {
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }
        .stat-divider {
          width: 1px;
          height: 50px;
          background: var(--color-border);
        }

        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }
          .bento-card.large, .bento-card.wide {
            grid-column: span 1;
            grid-row: span 1;
          }
          .hero-title {
            font-size: 2.5rem;
          }
           .stats-flex {
             flex-direction: column;
             gap: 2rem;
           }
           .stat-divider { display: none; }
        }

        /* SWIPER CUSTOM STYLES */
        .team-swiper-container {
          padding: 2rem 0 4rem 0; /* Space for pagination */
        }
        
        .swiper {
          width: 100%;
          padding-bottom: 50px !important; /* Space for bullets */
          overflow: visible !important; /* Allow hints of side cards */
        }
        
        /* Removed scaling styles */
        
        .swiper-pagination-bullet {
          background: var(--color-text-muted);
        }
        .swiper-pagination-bullet-active {
          background: var(--color-primary);
        }
        
        /* CARD STYLES (Keep from before) */
        .team-card-home {
          background: var(--color-bg-card); 
          border: 1px solid var(--color-border);
          border-radius: 12px; /* Reduced from lg */
          padding: 2rem 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%; /* For uniform height */
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        /* Active style without scaling */
        .swiper-slide-active .team-card-home {
          /* No specific focus style as requested */
        }

        .avatar-wrapper {
          position: relative;
          margin-bottom: 1.25rem;
        }
        .member-avatar-large {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid var(--color-bg-card);
          overflow: hidden; /* Ensure image stays in circle */
        }
        .initials {
           font-size: 2rem;
           font-weight: 700;
           color: #94a3b8;
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
           font-size: 1.2rem;
           margin-bottom: 0.25rem;
           font-weight: 700;
        }
        .member-role {
           font-weight: 600;
           color: var(--color-text);
           font-size: 0.85rem;
           margin-bottom: 0.75rem;
        }
        
        .btn-profile {
          margin-top: auto;
          display: inline-block;
          padding: 0.6rem 1.5rem;
          background: transparent;
          border: 1px solid var(--color-primary);
          border-radius: 99px; /* Pill shape for tech look */
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

         /* NEW SECTIONS STYLES */
         .section-methodology,
         .section-team,
         .section-cnje-visual {
            background: rgba(255,255,255,0.02);
         }
         
         /* ... existing Methodology styles ... */

         /* CNJE VISUAL SECTION */
         .section-cnje-visual {
            padding: 5rem 0;
         }
         .cnje-visual-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 4rem;
            align-items: center;
         }
         .cnje-logo-side {
            display: flex;
            justify-content: center;
            align-items: center;
         }
         .cnje-main-logo {
            max-width: 100%;
            height: auto;
            max-height: 200px;
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.1));
         }
         .cnje-text-side h3 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: var(--color-text);
         }
         .cnje-text-side p {
            color: var(--color-text-muted);
            line-height: 1.8;
            font-size: 1.1rem;
         }

         @media (max-width: 768px) {
            .cnje-visual-grid {
               grid-template-columns: 1fr;
               text-align: center;
               gap: 2rem;
            }
         }
         
         .steps-container {
            display: flex;
            justify-content: space-between;
            gap: 1.5rem;
            margin-top: 4rem;
            flex-wrap: wrap;
         }
         .step-card-modern {
            flex: 1;
            min-width: 200px;
            background: var(--color-bg-card);
            border-top: 4px solid var(--color-primary); /* The colored border */
            padding: 2.5rem 1.5rem 1.5rem;
            position: relative;
            text-align: center;
            border-radius: 4px; /* Slight rounding for card body */
            box-shadow: var(--shadow-card);
            transition: transform 0.3s;
         }
         .step-card-modern:hover {
            transform: translateY(-5px);
         }
         .step-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--color-bg); 
            border: 2px solid var(--color-primary);
            color: var(--color-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.25rem;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%); /* Center on the top border */
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 10;
         }
         .step-card-modern h4 {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
            color: white;
            margin-top: 1rem;
         }
         .step-card-modern p {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            line-height: 1.5;
         }

        /* ABOUT & VALUES */
        .about-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 4rem;
           align-items: center;
        }
        .slogan-text {
           font-size: 1.5rem;
           font-style: italic;
           color: var(--color-accent);
           margin: 1rem 0;
           font-weight: 300;
        }
        .about-text p {
           color: var(--color-text-muted);
           margin-bottom: 1rem;
           line-height: 1.7;
        }
        .values-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 1.5rem;
        }
        .value-card {
           background: var(--color-bg-card);
           padding: 1.5rem;
           border-radius: var(--radius-md);
           border: 1px solid var(--color-border);
           text-align: center;
           transition: transform 0.2s;
        }
        .value-card:hover {
           transform: translateY(-5px);
           border-color: var(--color-primary);
         }
         /* ECOSYSTEM REMOVED - Replaced by CNJE Visual */
        .cnje-badge-large {
           display: inline-block;
           margin-top: 1.5rem;
           padding: 0.5rem 1.5rem;
           background: var(--color-primary);
           color: white;
           border-radius: 99px;
           font-weight: 700;
           font-size: 0.9rem;
        }
        .partners-block {
           flex: 1;
        }
        .partners-list {
           display: flex;
           flex-wrap: wrap;
           gap: 1rem;
           margin-top: 1.5rem;
        }
        .partner-pill {
           padding: 0.5rem 1.25rem;
           background: var(--color-bg-card);
           border: 1px solid var(--color-border);
           border-radius: 99px;
           color: var(--color-text-muted);
           font-size: 0.85rem;
           white-space: nowrap;
        }

        @media (max-width: 768px) {
           .steps-container { flex-direction: column; gap: 3rem; }
           .about-grid { grid-template-columns: 1fr; gap: 2rem; }
           .ecosystem-flex { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
