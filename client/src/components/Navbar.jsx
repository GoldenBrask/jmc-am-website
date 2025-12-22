import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isGlass, setIsGlass] = useState(false);

  // Use refs to track values inside event listeners without re-binding
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Glass effect logic: Active if scrolled more than 20px OR mobile menu is open
      // (But usually mobile menu has its own solid bg, let's stick to scroll)
      setIsGlass(currentScrollY > 20);

      // Smart Hide/Show Logic
      if (currentScrollY < 50) {
        // Always show at the very top
        setIsVisible(true);
      } else {
        // Show if scrolling UP, Hide if scrolling DOWN
        if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current && !isOpen) {
          // Hide only if menu is closed to avoid confusing UX
          setIsVisible(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    const handleMouseMove = (e) => {
      // If mouse is near top (e.g. within 60px), show navbar
      if (e.clientY < 60) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]); // Only re-bind if menu state changes

  return (
    <>
      <nav
        className={`navbar ${!isVisible ? 'navbar-hidden' : ''} ${isGlass ? 'glass' : ''}`}
        onMouseEnter={() => setIsVisible(true)}
      >
        <div className="container navbar-content">
          <Link to="/" className="navbar-logo">
            <img src="/images/Logo_JMC_AM_blanc.png" alt="JMC Concept" style={{ height: '45px' }} />
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-links desktop-only">
            <Link to="/">Accueil</Link>
            {/* <a href="/#services">Expertise</a> */}
            <Link to="/hall-of-fame">L'Équipe</Link>
            <Link to="/blog">Le Mag</Link>
            <a href="/#contact" className="btn-nav">Nous contacter</a>
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X color="white" /> : <Menu color="white" />}
          </button>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mobile-menu">
              <Link to="/" onClick={() => setIsOpen(false)}>Accueil</Link>
              <a href="/#services" onClick={() => setIsOpen(false)}>Expertise</a>
              <Link to="/hall-of-fame" onClick={() => setIsOpen(false)}>L'Équipe</Link>
              <Link to="/blog" onClick={() => setIsOpen(false)}>Le Mag</Link>
              <a href="/#contact" onClick={() => setIsOpen(false)}>Contact</a>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: transform 0.3s ease, background-color 0.3s ease, padding 0.3s ease, backdrop-filter 0.3s ease;
          background: transparent;
        }
        
        /* Glass Effect - Stronger and more visible */
        .navbar.glass {
          padding: 1rem 0;
          background: rgba(15, 23, 42, 0.70); /* Dark blue with opacity */
          backdrop-filter: blur(12px) saturate(110%);
          -webkit-backdrop-filter: blur(12px) saturate(110%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }

        /* Hide State */
        .navbar-hidden {
          transform: translateY(-100%);
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.75rem;
          color: white;
          letter-spacing: -0.03em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .dot { color: var(--color-primary); }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .navbar-links a {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          position: relative;
          transition: 0.3s;
        }
        .navbar-links a:hover {
          color: white;
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        .btn-nav {
          padding: 0.6rem 1.4rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--radius-md);
          color: white !important;
          backdrop-filter: blur(4px);
        }
        .btn-nav:hover {
          background: var(--color-primary);
          border-color: var(--color-primary);
          box-shadow: 0 0 20px var(--color-primary-glow);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-toggle { display: block; }
          .mobile-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(15px);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid var(--color-border);
          }
          .mobile-menu a {
             color: white;
             font-size: 1.5rem;
             font-weight: 600;
          }
        }
      `}</style>
    </>
  );
}
