import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Search, Bell } from 'lucide-react';
import Sidebar from './admin/Sidebar';

export default function AdminLayout() {
    const { user, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/admin': return 'Tableau de bord';
            case '/admin/articles': return 'Gestion des articles';
            case '/admin/projects': return 'Projets';
            case '/admin/hall-of-fame': return 'Hall of Fame';
            default: return 'Admin';
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <main className={`transition-all duration-300 min-h-screen md:ml-64 flex flex-col`}>

                {/* Topbar */}
                <header className="h-16 sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-slate-800 md:hidden text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-100 hidden sm:block">
                            {getPageTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar (Visual only for now) */}
                        <div className="hidden md:flex items-center bg-slate-800/50 rounded-full px-4 py-1.5 border border-slate-700 focus-within:border-blue-500/50 transition-colors">
                            <Search size={16} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-slate-200 placeholder-slate-500"
                            />
                        </div>

                        {/* Notifications (Visual) */}
                        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        <Outlet />
                    </div>
                </div>

            </main>
        </div>
    );
}
