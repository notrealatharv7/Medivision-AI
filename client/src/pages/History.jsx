import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar } from 'lucide-react';

export default function History() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/reports/history');
                setReports(res.data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading history...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">History</h1>

            {reports.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm">
                    No past analyses found. Start by uploading a report!
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <span className="text-xs text-gray-400 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(report.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate" title={report.filename}>
                                {report.filename}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                {report.ai_explanation}
                            </p>
                            <div className="text-xs text-gray-500">
                                {JSON.parse(report.risks || "[]").length} Risks Detected
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
