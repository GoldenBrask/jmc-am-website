import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import api from '../services/api';

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        // Filter only published articles for the public blog
        const publishedArticles = res.data.filter(a => a.published);
        setArticles(publishedArticles);
      } catch (error) {
        console.error('Error fetching blog articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="blog-hero">
        <div className="container">
          <span className="section-label">MAGAZINE</span>
          <h1>Actualités & Veille</h1>
          <p>Explorez nos derniers articles sur la tech et la vie associative.</p>
        </div>
      </div>

      <div className="container section">
        {articles.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            <p>Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {articles.map((article) => (
              <Link to={`/blog/${article.id}`} key={article.id} className="blog-card">
                <div className="blog-image">
                  <img
                    src={article.image || '/images/default-blog.jpg'}
                    alt={article.title}
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800'}
                  />
                  <span className="category-badge">{article.category}</span>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="meta-item">
                      <Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt?.substring(0, 100)}...</p>
                  <span className="read-more">
                    Lire l'article <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .blog-hero {
          padding: 6rem 0 4rem;
          text-align: center;
          background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15), transparent 70%);
        }
        .section-label {
          color: var(--color-accent);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          display: block;
        }
        .blog-hero h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }
        .blog-hero p {
          color: var(--color-text-muted);
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .blog-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }
        .blog-card:hover {
          transform: translateY(-8px);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }

        .blog-image {
          height: 220px;
          overflow: hidden;
          position: relative;
        }
        .blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
          opacity: 0.8;
        }
        .blog-card:hover .blog-image img {
          transform: scale(1.1);
          opacity: 1;
        }
        .category-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .blog-content {
          padding: 2rem;
        }
        .blog-meta {
          color: var(--color-text-muted);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .blog-content p {
          color: var(--color-text-muted);
          margin-bottom: 2rem;
        }
        .read-more {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
