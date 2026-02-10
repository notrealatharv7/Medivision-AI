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
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Activity className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                MedVision AI
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
                                <Link to="/history" className="text-gray-700 hover:text-primary font-medium">History</Link>
                                <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                                    <Link to="/profile" className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary transition-colors">
                                        <UserIcon className="h-4 w-4" />
                                        <span>{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-primary font-medium">Login</Link>
                                <Link to="/signup" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
