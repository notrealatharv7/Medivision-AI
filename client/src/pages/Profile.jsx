import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Calendar, Weight, Activity, Save, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        age: '',
        gender: '',
        weight: '',
        health_history: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = res.data;
            setProfile({
                name: userData.name || '',
                age: userData.age || '',
                gender: userData.gender || '',
                weight: userData.weight || '',
                health_history: userData.health_history || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const dataToSend = {
            ...profile,
            age: profile.age === '' ? null : parseInt(profile.age),
            weight: profile.weight === '' ? null : parseInt(profile.weight)
        };
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8000/users/profile', dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-50">
                <div className="bg-primary/5 p-8 border-b border-blue-100 flex items-center space-x-6">
                    <div className="bg-white p-4 rounded-2xl shadow-md">
                        <UserCircle className="h-16 w-16 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Health Profile</h1>
                        <p className="text-gray-600">Provide medical context for better AI analysis</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                                <User className="h-5 w-5 mr-2 text-primary" />
                                Basic Information
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" /> Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={profile.age}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Years"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Activity className="h-4 w-4 mr-1" /> Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={profile.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Weight className="h-4 w-4 mr-1" /> Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={profile.weight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="kg"
                                />
                            </div>
                        </div>

                        {/* Medical History */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-primary" />
                                Medical Context
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Health History & Conditions
                                </label>
                                <textarea
                                    name="health_history"
                                    value={profile.health_history}
                                    onChange={handleChange}
                                    rows="10"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="e.g. Hypertension, Diabetes Type 2, Chronic iron deficiency, etc."
                                ></textarea>
                                <p className="mt-2 text-xs text-gray-500">
                                    * This information helps Gemini provide more accurate summaries and recommendations tailored to your conditions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center space-x-2 disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
