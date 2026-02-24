import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-card sticky top-0 z-50 border-b border-white/20 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="p-2 bg-blue-600 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                <Activity className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tighter">
                                MedVision.AI
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wide transition-colors">DASHBOARD</Link>
                                <Link to="/history" className="text-slate-600 hover:text-blue-600 font-bold text-sm tracking-wide transition-colors">HISTORY</Link>
                                <div className="flex items-center space-x-4 pl-8 border-l border-slate-200">
                                    <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                            <UserIcon className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <span>{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold text-sm tracking-wide transition-all shadow-lg shadow-slate-200 active:scale-95">
                                GET STARTED
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
