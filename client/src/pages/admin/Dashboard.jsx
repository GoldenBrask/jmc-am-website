import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Plus, Edit2, Trash2,
    TrendingUp, Users, FileText, Eye,
    Activity, Calendar, ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/admin/StatCard';

export default function Dashboard() {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [stats, setStats] = useState({
        totalVisits: 0,
        monthlyVisits: 0,
        chartData: [],
        topArticles: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, articlesRes] = await Promise.all([
                api.get('/stats'),
                api.get('/articles')
            ]);

            setStats(statsRes.data);
            setArticles(articlesRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Erreur chargement données', {
                style: { background: '#1e293b', color: '#fff' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet article ?')) return;
        try {
            await api.delete(`/articles/${id}`);
            toast.success('Article supprimé');
            fetchData();
        } catch (error) {
            toast.error('Erreur suppression');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Bonjour, {user?.name} 👋
                    </h1>
                    <p className="text-slate-400">
                        Voici ce qui se passe sur votre site aujourd'hui.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/admin/articles/new"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Nouvel Article</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Vues Totales"
                    value={stats.totalVisits.toLocaleString()}
                    icon={Eye}
                    color="blue"
                    trend={12.5}
                />
                <StatCard
                    title="Visites ce mois"
                    value={stats.monthlyVisits.toLocaleString()}
                    icon={Activity}
                    color="purple"
                    trend={8.2}
                />
                <StatCard
                    title="Articles Publiés"
                    value={articles.filter(a => a.published).length}
                    icon={FileText}
                    color="green"
                />
                <StatCard
                    title="Total Brouillons"
                    value={articles.filter(a => !a.published).length}
                    icon={Edit2}
                    color="orange"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" />
                            Aperçu du Trafic
                        </h3>
                        <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-sm text-slate-400 focus:outline-none focus:border-blue-500 scrollbar-none">
                            <option>7 derniers jours</option>
                            <option>30 derniers jours</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: '#334155',
                                        color: '#fff',
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Articles Sidebar */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Award size={20} className="text-yellow-500" />
                        Articles Populaires
                    </h3>
                    <div className="space-y-4">
                        {stats.topArticles.map((article, index) => (
                            <div key={article.id} className="group flex items-center gap-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                                <div className={`
                                    w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm
                                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                        index === 1 ? 'bg-slate-400/20 text-slate-400' :
                                            index === 2 ? 'bg-orange-700/20 text-orange-700' : 'bg-slate-800 text-slate-500'}
                                `}>
                                    #{index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <Eye size={10} /> {article.views} vues
                                    </p>
                                </div>
                                <Link
                                    to={`/admin/articles/edit/${article.id}`}
                                    className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                    <ArrowUpRight size={16} />
                                </Link>
                            </div>
                        ))}
                        {stats.topArticles.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                <FileText size={48} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Aucune donnée disponible</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Articles Table Section */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Articles Récents</h2>
                        <p className="text-sm text-slate-400 mt-1">Gérez vos publications récentes</p>
                    </div>
                    <Link
                        to="/admin/articles"
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                    >
                        Voir tout <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold border-b border-slate-800">Article</th>
                                <th className="p-4 font-semibold border-b border-slate-800">Date</th>
                                <th className="p-4 font-semibold border-b border-slate-800">Statut</th>
                                <th className="p-4 font-semibold border-b border-slate-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {articles.slice(0, 5).map((article) => (
                                <tr key={article.id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white group-hover:text-blue-100 transition-colors">{article.title}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{article.category}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="opacity-70" />
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {article.published ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Publié
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                Brouillon
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/admin/articles/edit/${article.id}`}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper component for Icon placeholders until imports are fixed if any missing
const Award = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
);
const ArrowRight = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
