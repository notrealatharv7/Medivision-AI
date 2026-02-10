import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [report, setReport] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setAnalyzing(true);
        setReport(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Use new n8n integration endpoint
            const res = await axios.post('/process-with-n8n', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setReport(res.data);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Analysis failed. Ensure server is running and n8n is reachable.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Medical Dashboard</h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4">New Analysis</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors bg-gray-50">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <span className="text-lg text-gray-700 font-medium">
                            {file ? file.name : "Click to upload report (Image/PDF)"}
                        </span>
                        <span className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, PDF</span>
                    </label>
                </div>
                {file && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleUpload}
                            disabled={analyzing}
                            className={`px-6 py-2 rounded-lg text-white font-medium ${analyzing ? 'bg-gray-400' : 'bg-primary hover:bg-blue-600'} transition-colors`}
                        >
                            {analyzing ? 'Analyzing with AI...' : 'Start Analysis'}
                        </button>
                    </div>
                )}
            </div>

            {/* Results Section */}
            {report && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
                        <div className="flex items-center space-x-3 mb-4">
                            <FileText className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                        </div>

                        <div className="prose max-w-none">
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Summary</h3>
                                <p className="text-blue-800">{report.ai_explanation}</p>
                            </div>

                            {/* Extracted Medical Data */}
                            <div className="bg-purple-50 p-4 rounded-lg mb-6">
                                <h3 className="text-lg font-semibold text-purple-900 mb-3">Extracted Medical Data</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {(() => {
                                        try {
                                            const data = JSON.parse(report.extracted_data || "{}");
                                            return (
                                                <>
                                                    <div className="bg-white p-3 rounded-lg">
                                                        <p className="text-sm text-gray-600">Hemoglobin</p>
                                                        <p className="text-xl font-bold text-purple-900">{data.hemoglobin || 'N/A'}</p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg">
                                                        <p className="text-sm text-gray-600">Blood Sugar</p>
                                                        <p className="text-xl font-bold text-purple-900">{data.blood_sugar || 'N/A'}</p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg">
                                                        <p className="text-sm text-gray-600">Cholesterol</p>
                                                        <p className="text-xl font-bold text-purple-900">{data.cholesterol || 'N/A'}</p>
                                                    </div>
                                                </>
                                            );
                                        } catch {
                                            return <p className="text-purple-800">No structured data available</p>;
                                        }
                                    })()}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                                        <AlertTriangle className="h-5 w-5 mr-2" />
                                        Potential Risks
                                    </h3>
                                    <ul className="list-disc list-inside text-red-800 space-y-1">
                                        {JSON.parse(report.risks || "[]").map((risk, i) => (
                                            <li key={i}>{risk}</li>
                                        ))}
                                        {JSON.parse(report.risks || "[]").length === 0 && <li>No specific risks detected.</li>}
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Recommendations
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="font-medium text-green-800">Diet:</p>
                                        <ul className="list-disc list-inside text-green-700">
                                            {JSON.parse(report.diet_plan || "[]").map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                        <p className="font-medium text-green-800 mt-2">Exercise:</p>
                                        <ul className="list-disc list-inside text-green-700">
                                            {JSON.parse(report.exercise_plan || "[]").map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
