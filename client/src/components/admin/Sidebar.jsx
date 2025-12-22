import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Award,
    LogOut,
    Menu,
    X,
    Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin/dashboard' },
        { icon: FileText, label: 'Articles', path: '/admin/articles' },
        { icon: Award, label: 'Hall of Fame', path: '/admin/hall-of-fame' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 z-50 transition-transform duration-300 ease-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        JMC Admin
                    </span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="ml-auto md:hidden text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            end={item.path === '/admin'}
                            className={({ isActive }) => `
                                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                                    <span className="font-medium">{item.label}</span>
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 rounded-xl bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User & Logout Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                            A
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">Admin</h4>
                            <p className="text-xs text-slate-400">Administrateur</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10 transition-all duration-300"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
