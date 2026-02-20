import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertTriangle, User, Calendar, Weight, Activity, ChevronRight, PieChart, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,400;1,500&display=swap');

  .medvision-theme {
    --blue: #2563eb;
    --blue-light: #eff6ff;
    --blue-mid: #bfdbfe;
    --red: #dc2626;
    --red-light: #fef2f2;
    --orange: #ea580c;
    --orange-light: #fff7ed;
    --green: #16a34a;
    --green-light: #f0fdf4;
    --green-mid: #bbf7d0;
    --slate: #1e293b;
    --slate-700: #334155;
    --slate-500: #64748b;
    --slate-300: #cbd5e1;
    --slate-100: #f1f5f9;
    --slate-50: #f8fafc;
    --white: #ffffff;
    --radius: 14px;
    --radius-sm: 8px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    --shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
  }

  .medvision-theme { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--slate); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.19s; }
  .fade-up-4 { animation-delay: 0.26s; }

  .page-header { margin-bottom: 32px; }
  .page-eyebrow { display: inline-flex; align-items: center; gap: 7px; background: var(--blue-light); color: var(--blue); border: 1px solid var(--blue-mid); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px; }
  .page-title { font-size: 26px; font-weight: 800; color: var(--slate); letter-spacing: -0.02em; }
  .page-subtitle { font-size: 15px; color: var(--slate-500); margin-top: 6px; font-weight: 400; }

  .patient-band { display: flex; align-items: center; gap: 14px; background: var(--white); border: 1px solid var(--slate-300); border-radius: var(--radius); padding: 16px 20px; box-shadow: var(--shadow-sm); margin-bottom: 28px; }
  .patient-avatar { width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .patient-name { font-size: 16px; font-weight: 700; color: var(--slate); margin-bottom: 2px; }
  .patient-meta { font-size: 13px; color: var(--slate-500); }
  .patient-status { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .status-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
  .status-chip.warn { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
  .status-chip.danger { background: var(--red-light); color: var(--red); border: 1px solid #fecaca; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: pulse-dot 2s infinite; }

  .two-col { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
  @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

  .section-card { background: var(--white); border: 1px solid var(--slate-300); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
  .section-header { display: flex; align-items: center; gap: 10px; padding: 18px 22px; border-bottom: 1px solid var(--slate-100); }
  .section-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .icon-blue { background: var(--blue-light); }
  .icon-red { background: var(--red-light); }
  .icon-green { background: var(--green-light); }
  .icon-orange { background: var(--orange-light); }
  .section-title { font-size: 14px; font-weight: 700; color: var(--slate); letter-spacing: 0.01em; }
  .section-subtitle { font-size: 12px; color: var(--slate-500); margin-top: 1px; }
  .section-body { padding: 22px; }

  .vitals-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--slate-500); margin-bottom: 16px; }
  .vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .vital-card { border-radius: 12px; padding: 20px 16px 14px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .vital-card.red { background: #fff1f2; border: 1.5px solid #fecdd3; }
  .vital-card.amber { background: #fffbeb; border: 1.5px solid #fde68a; }
  .vital-card.blue { background: #eff6ff; border: 1.5px solid #bfdbfe; }
  .vital-value { font-size: 22px; font-weight: 800; line-height: 1; letter-spacing: -0.02em; }
  .vital-value.red { color: #dc2626; }
  .vital-value.amber { color: #d97706; }
  .vital-value.blue { color: #2563eb; }
  .vital-name { font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--slate-500); text-align: center; }
  .vital-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
  .vital-badge.low { background: #fee2e2; color: #b91c1c; }
  .vital-badge.high { background: #fef3c7; color: #b45309; }
  .vital-badge.na { background: var(--slate-100); color: var(--slate-500); }

  .ai-card { background: var(--slate); border-radius: var(--radius); padding: 22px; position: relative; overflow: hidden; margin-top: 16px; }
  .ai-card::before { content: ''; position: absolute; top: -60px; right: -60px; width: 160px; height: 160px; border-radius: 50%; background: rgba(37,99,235,0.15); pointer-events: none; }
  .ai-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #60a5fa; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .ai-bolt { width: 22px; height: 22px; background: #2563eb; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
  .ai-text { font-family: 'Lora', serif; font-style: italic; font-size: 15px; line-height: 1.8; color: #e2e8f0; font-weight: 400; }

  .vuln-list { display: flex; flex-direction: column; gap: 12px; }
  .vuln-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 10px; background: var(--slate-50); border: 1px solid var(--slate-100); }
  .vuln-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); flex-shrink: 0; margin-top: 6px; }
  .vuln-text { font-size: 13.5px; color: var(--slate-700); line-height: 1.65; font-weight: 400; }

  .lifestyle-section { margin-bottom: 24px; }
  .lifestyle-section:last-child { margin-bottom: 0; }
  .lifestyle-section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--slate-500); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .lifestyle-section-label::after { content: ''; flex: 1; height: 1px; background: var(--slate-100); }
  .lifestyle-items { display: flex; flex-direction: column; gap: 8px; }
  .lifestyle-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 10px; background: var(--green-light); border: 1px solid var(--green-mid); transition: transform 0.15s, box-shadow 0.15s; }
  .lifestyle-item.exercise { background: var(--blue-light); border-color: var(--blue-mid); }
  .lifestyle-num { width: 22px; height: 22px; border-radius: 50%; background: var(--green); color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .lifestyle-num.blue-num { background: var(--blue); }
  .lifestyle-text { font-size: 13.5px; color: var(--slate-700); line-height: 1.65; font-weight: 500; }

  .sidebar { display: flex; flex-direction: column; gap: 20px; }
`;

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
            const token = localStorage.getItem('token');
            const res = await axios.post('/process-with-n8n', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setReport(res.data);
            toast.success('Analysis completed successfully');
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const safeParse = (data, fallback = []) => {
        if (!data) return fallback;
        if (Array.isArray(data) || typeof data === 'object') return data;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Parse error", e);
            return fallback;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="relative overflow-hidden">
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className="flex justify-between items-center mb-10" variants={itemVariants}>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                            Health <span className="text-blue-600">Intelligence</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">Advanced AI Medical Analysis Portal</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    {/* Hero Upload Zone */}
                    <motion.div className="lg:col-span-8" variants={itemVariants}>
                        <div className="glass-card p-8 rounded-3xl h-full border-t border-white/40">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                    <Zap className="h-5 w-5 mr-2 text-yellow-500 fill-yellow-500" />
                                    New Analysis
                                </h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Medivision Flash-M4
                                </span>
                            </div>

                            <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 group
                                ${file ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'}`}>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className={`p-4 rounded-full mb-4 transition-transform group-hover:scale-110 duration-300
                                        ${file ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-400'}`}>
                                        <Upload className="h-10 w-10" />
                                    </div>
                                    <span className="text-xl text-slate-800 font-bold mb-1">
                                        {file ? file.name : "Secure Data Ingestion"}
                                    </span>
                                    <p className="text-slate-500 max-w-xs mx-auto">
                                        Drag & drop your medical reports here for instant AI interpretation.
                                    </p>
                                </label>
                            </div>

                            <AnimatePresence mode="wait">
                                {file && (
                                    <motion.div
                                        className="mt-6 flex justify-end"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <button
                                            onClick={handleUpload}
                                            disabled={analyzing}
                                            className={`relative px-8 py-3 rounded-xl text-white font-bold overflow-hidden shadow-lg transition-all
                                                ${analyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                                        >
                                            <span className="relative z-10 flex items-center">
                                                {analyzing ? (
                                                    <>
                                                        <Activity className="h-5 w-5 mr-2 animate-pulse" />
                                                        Processing Results...
                                                    </>
                                                ) : 'Initiate AI Scan'}
                                            </span>
                                            {analyzing && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite] -skew-x-12" />}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Stats/Overview Quick Cards */}
                    {/* User Guide / Instructions */}
                    <motion.div className="lg:col-span-4 flex flex-col gap-6" variants={itemVariants}>
                        <div className="glass-card p-8 rounded-3xl h-full border-slate-200/50 bg-white/60 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap className="h-32 w-32 -translate-y-10 translate-x-10 -rotate-12 text-blue-600" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                <Info className="h-6 w-6 mr-2 text-blue-600" />
                                Quick Start Guide
                            </h3>

                            <div className="space-y-6 relative z-10">
                                <div className="flex">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-4">1</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">Upload & Analyze</h4>
                                        <p className="text-sm text-slate-500 mt-1">Simply drop your medical report (PDF/Image) into the upload zone.</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-4">2</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">AI Extraction</h4>
                                        <p className="text-sm text-slate-500 mt-1">Our AI instantly identifies key markers like Hemoglobin and Cholesterol.</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-4">3</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">Get Recommendations</h4>
                                        <p className="text-sm text-slate-500 mt-1">Receive personalized diet plans and risk assessments based on your data.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Results Section */}
                {/* Results Section */}
                <AnimatePresence>
                    {report && (
                        <div className="medvision-theme mt-10">
                            <style>{css}</style>
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", damping: 20 }}
                            >
                                {/* Page header */}
                                <div className="page-header fade-up">
                                    <div className="page-eyebrow">
                                        <span>🩺</span> Structured Clinical Verification
                                    </div>
                                    <div className="page-header-top">
                                        <div>
                                            <h1 className="page-title">Expert Analysis Report</h1>
                                            <p className="page-subtitle">Generated {new Date().toLocaleDateString()} · AI-assisted interpretation</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Patient band */}
                                <div className="patient-band fade-up fade-up-1">
                                    <div className="patient-avatar">P</div>
                                    <div>
                                        <div className="patient-name">{file ? file.name : "Patient File"}</div>
                                        <div className="patient-meta">ID: {Math.floor(Math.random() * 1000000)} · Auto-Analysis</div>
                                    </div>
                                    <div className="patient-status">
                                        <div className="status-chip warn"><span className="status-dot" />Review Needed</div>
                                    </div>
                                </div>

                                {/* Main two-column */}
                                <div className="two-col">
                                    {/* LEFT COLUMN */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                                        {/* Vital Markers */}
                                        <div className="section-card fade-up fade-up-2">
                                            <div className="section-header">
                                                <div className="section-icon icon-blue">🔬</div>
                                                <div>
                                                    <div className="section-title">Vital Markers</div>
                                                    <div className="section-subtitle">Key extracted lab values</div>
                                                </div>
                                            </div>
                                            <div className="section-body">
                                                <div className="vitals-label">Test Results</div>
                                                <div className="vitals-grid">
                                                    {(() => {
                                                        const data = safeParse(report.extracted_data, {});
                                                        return (
                                                            <>
                                                                <div className="vital-card red">
                                                                    <div className="vital-value red">{data.hemoglobin || '--'}</div>
                                                                    <div className="vital-badge low">Hemoglobin</div>
                                                                </div>
                                                                <div className="vital-card amber">
                                                                    <div className="vital-value amber">{data.blood_sugar || '--'}</div>
                                                                    <div className="vital-badge high">Blood Sugar</div>
                                                                </div>
                                                                <div className="vital-card blue">
                                                                    <div className="vital-value blue">{data.cholesterol || '--'}</div>
                                                                    <div className="vital-badge na">Cholesterol</div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>

                                                {/* AI Interpretation block */}
                                                <div className="ai-card">
                                                    <div className="ai-label">
                                                        <div className="ai-bolt">⚡</div>
                                                        AI Interpretation
                                                    </div>
                                                    <p className="ai-text">
                                                        "{report.ai_explanation || report.summary || 'No summary provided.'}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lifestyle Optimization */}
                                        <div className="section-card fade-up fade-up-3">
                                            <div className="section-header">
                                                <div className="section-icon icon-green">✦</div>
                                                <div>
                                                    <div className="section-title">Lifestyle Optimization</div>
                                                    <div className="section-subtitle">Personalized recommendations</div>
                                                </div>
                                            </div>
                                            <div className="section-body">
                                                <div className="lifestyle-section">
                                                    <div className="lifestyle-section-label">🥦 Nutritional Adjustments</div>
                                                    <div className="lifestyle-items">
                                                        {safeParse(report.diet_plan, []).map((tip, i) => (
                                                            <div className="lifestyle-item" key={i}>
                                                                <div className="lifestyle-num">{i + 1}</div>
                                                                <div className="lifestyle-text">{tip}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="lifestyle-section">
                                                    <div className="lifestyle-section-label">🏃 Physiological Recovery</div>
                                                    <div className="lifestyle-items">
                                                        {safeParse(report.exercise_plan, []).map((tip, i) => (
                                                            <div className="lifestyle-item exercise" key={i}>
                                                                <div className="lifestyle-num blue-num">{i + 1}</div>
                                                                <div className="lifestyle-text">{tip}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDEBAR */}
                                    <div className="sidebar fade-up fade-up-4">
                                        {/* Priority Vulnerabilities */}
                                        <div className="section-card">
                                            <div className="section-header">
                                                <div className="section-icon icon-red">⚠️</div>
                                                <div>
                                                    <div className="section-title">Priority Vulnerabilities</div>
                                                    <div className="section-subtitle">Risks requiring attention</div>
                                                </div>
                                            </div>
                                            <div className="section-body">
                                                <div className="vuln-list">
                                                    {safeParse(report.risks, []).map((v, i) => (
                                                        <div className="vuln-item" key={i}>
                                                            <div className="vuln-dot" />
                                                            <p className="vuln-text">{v}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
