import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import api from '../services/api';

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container section text-center" style={{ paddingTop: '8rem' }}>
        <h2 className="text-3xl font-bold mb-4">Article non trouvé</h2>
        <p className="text-slate-400 mb-8">L'article que vous cherchez n'existe pas ou a été déplacé.</p>
        <Link to="/blog" className="btn btn-primary">Retour au blog</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Hero Section with Background Image */}
      <div
        className="article-hero relative flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage: article.image ? `url(${article.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0f172a', // Fallback color
          minHeight: '400px',
          position: 'relative',
          marginTop: '0', 
          marginBottom: '3rem',
        }}
      >
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/60 z-0"></div>

        {/* Content Content - z-10 to stay on top of overlay */}
        <div className="container relative z-10 text-center">
          <Link to="/blog" className="back-link text-slate-200 hover:text-white mb-6 inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Retour
          </Link>
          <div className="article-meta-top mb-4 flex justify-center gap-3">
            <span className="bg-blue-600/80 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {article.category}
            </span>
            <span className="bg-slate-800/60 px-3 py-1 rounded-full text-sm backdrop-blur-sm flex items-center gap-2">
              <Calendar size={14} />
              {new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold max-w-4xl mx-auto leading-tight">{article.title}</h1>
        </div>
      </div>

      <div className="container article-layout mt-12 mb-20 px-4 md:px-0">
        <div className="article-main mx-auto" style={{ maxWidth: '800px' }}>
          {/* Main Content - Text should wrap and handle overflow */}
          <div
            className="article-content prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>

      <style>{`
        /* Custom styles for content readability */
        .article-hero {
           padding: 6rem 0; 
        }
        .article-content img {
            border-radius: 0.75rem;
            margin: 2rem auto;
            max-width: 100%;
            height: auto;
        }
        .article-content {
            word-wrap: break-word;
            overflow-wrap: break-word;
            font-size: 1.15rem;
            line-height: 1.8;
            color: #d1d5db;
        }
        .article-content h3 {
            color: white;
            font-size: 1.75rem;
            margin: 2.5rem 0 1rem;
        }
        .article-content p { margin-bottom: 1.5rem; }
        .article-content ul { padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .article-content li { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
