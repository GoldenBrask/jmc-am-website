import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
    const colorClasses = {
        blue: {
            bg: "bg-blue-500/10",
            text: "text-blue-500",
            border: "group-hover:border-blue-500/50"
        },
        purple: {
            bg: "bg-purple-500/10",
            text: "text-purple-500",
            border: "group-hover:border-purple-500/50"
        },
        green: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-500",
            border: "group-hover:border-emerald-500/50"
        },
        orange: {
            bg: "bg-orange-500/10",
            text: "text-orange-500",
            border: "group-hover:border-orange-500/50"
        }
    };

    const currentTheme = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`
            p-6 rounded-2xl bg-slate-900/50 border border-slate-800 
            transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 group
            ${currentTheme.border}
        `}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.text}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`
                        text-xs font-semibold px-2 py-1 rounded-full 
                        ${trend >= 0
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }
                    `}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>

            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-3xl font-bold text-white tracking-tight">
                {value}
            </div>
        </div>
    );
};

export default StatCard;
