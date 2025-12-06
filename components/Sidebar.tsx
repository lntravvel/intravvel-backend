import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
    LayoutDashboard,
    Package,
    Mail,
    FileText,
    Sparkles,
    LogOut,
    Plane
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { to: '/services', icon: Package, label: 'Services' },
        { to: '/messages', icon: Mail, label: 'Messages' },
        { to: '/content', icon: FileText, label: 'Content' },
        { to: '/ai', icon: Sparkles, label: 'AI Generator' },
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Plane className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Intravvel</h1>
                        <p className="text-xs text-gray-400">Admin Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
