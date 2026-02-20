import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,400;1,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
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
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05);
  }

  body { 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    background: var(--slate-50); 
    color: var(--slate);
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -500px 0; }
    100% { background-position:  500px 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.19s; }
  .fade-up-4 { animation-delay: 0.26s; }

  /* Nav */
  .nav {
    background: var(--white);
    border-bottom: 1px solid var(--slate-300);
    position: sticky; top: 0; z-index: 50;
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 28px; height: 64px;
    display: flex; align-items: center; gap: 32px;
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: var(--blue);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 17px;
  }
  .logo-text { font-size: 18px; font-weight: 800; color: var(--slate); letter-spacing: -0.02em; }
  .logo-text span { color: var(--blue); }
  .nav-links { display: flex; gap: 4px; margin-left: auto; }
  .nav-link {
    padding: 7px 16px; border-radius: 8px; font-size: 13.5px;
    font-weight: 600; letter-spacing: 0.03em; cursor: pointer;
    color: var(--slate-500); text-transform: uppercase; font-size: 12px;
    transition: all 0.15s; border: none; background: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .nav-link:hover { background: var(--slate-100); color: var(--slate); }
  .nav-link.active { background: var(--blue-light); color: var(--blue); }
  .nav-user {
    display: flex; align-items: center; gap: 10px; margin-left: 16px;
    padding: 6px 14px; border-radius: 10px;
    border: 1px solid var(--slate-300); cursor: pointer;
  }
  .nav-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--blue); color: white; font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .nav-name { font-size: 13px; font-weight: 600; color: var(--slate-700); }

  /* Page layout */
  .page { max-width: 1200px; margin: 0 auto; padding: 36px 28px 80px; }

  /* Page header */
  .page-header { margin-bottom: 32px; }
  .page-header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 6px; }
  .page-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--blue-light); color: var(--blue);
    border: 1px solid var(--blue-mid); border-radius: 20px;
    padding: 4px 12px; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px;
  }
  .page-title { font-size: 26px; font-weight: 800; color: var(--slate); letter-spacing: -0.02em; }
  .page-subtitle { font-size: 15px; color: var(--slate-500); margin-top: 6px; font-weight: 400; }

  .patient-band {
    display: flex; align-items: center; gap: 14px;
    background: var(--white); border: 1px solid var(--slate-300);
    border-radius: var(--radius); padding: 16px 20px;
    box-shadow: var(--shadow-sm); margin-bottom: 28px;
  }
  .patient-avatar {
    width: 46px; height: 46px; border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white; font-size: 15px; font-weight: 800;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .patient-name { font-size: 16px; font-weight: 700; color: var(--slate); margin-bottom: 2px; }
  .patient-meta { font-size: 13px; color: var(--slate-500); }
  .patient-status {
    margin-left: auto; display: flex; align-items: center; gap: 8px;
  }
  .status-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 600;
  }
  .status-chip.warn { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
  .status-chip.danger { background: var(--red-light); color: var(--red); border: 1px solid #fecaca; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: pulse-dot 2s infinite; }

  /* Two column layout */
  .two-col { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
  @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

  /* Section cards */
  .section-card {
    background: var(--white); border: 1px solid var(--slate-300);
    border-radius: var(--radius); box-shadow: var(--shadow);
    overflow: hidden;
  }
  .section-header {
    display: flex; align-items: center; gap: 10px;
    padding: 18px 22px; border-bottom: 1px solid var(--slate-100);
  }
  .section-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .icon-blue { background: var(--blue-light); }
  .icon-red  { background: var(--red-light); }
  .icon-green{ background: var(--green-light); }
  .icon-orange{ background: var(--orange-light); }
  .section-title { font-size: 14px; font-weight: 700; color: var(--slate); letter-spacing: 0.01em; }
  .section-subtitle { font-size: 12px; color: var(--slate-500); margin-top: 1px; }
  .section-body { padding: 22px; }

  /* Vital markers */
  .vitals-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--slate-500); margin-bottom: 16px;
  }
  .vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .vital-card {
    border-radius: 12px; padding: 20px 16px 14px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .vital-card.red   { background: #fff1f2; border: 1.5px solid #fecdd3; }
  .vital-card.amber { background: #fffbeb; border: 1.5px solid #fde68a; }
  .vital-card.blue  { background: #eff6ff; border: 1.5px solid #bfdbfe; }
  .vital-value { font-size: 22px; font-weight: 800; line-height: 1; letter-spacing: -0.02em; }
  .vital-value.red   { color: #dc2626; }
  .vital-value.amber { color: #d97706; }
  .vital-value.blue  { color: #2563eb; }
  .vital-name { font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--slate-500); text-align: center; }
  .vital-badge {
    font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px;
  }
  .vital-badge.low  { background: #fee2e2; color: #b91c1c; }
  .vital-badge.high { background: #fef3c7; color: #b45309; }
  .vital-badge.na   { background: var(--slate-100); color: var(--slate-500); }

  /* AI Interpretation */
  .ai-card {
    background: var(--slate); border-radius: var(--radius);
    padding: 22px; position: relative; overflow: hidden; margin-top: 16px;
  }
  .ai-card::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 160px; height: 160px; border-radius: 50%;
    background: rgba(37,99,235,0.15); pointer-events: none;
  }
  .ai-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #60a5fa; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .ai-bolt {
    width: 22px; height: 22px; background: #2563eb; border-radius: 6px;
    display: flex; align-items: center; justify-content: center; font-size: 12px;
  }
  .ai-text {
    font-family: 'Lora', serif; font-style: italic;
    font-size: 15px; line-height: 1.8; color: #e2e8f0; font-weight: 400;
  }

  /* Divider */
  .divider { height: 1px; background: var(--slate-100); margin: 18px 0; }

  /* Vulnerability list */
  .vuln-list { display: flex; flex-direction: column; gap: 12px; }
  .vuln-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px; border-radius: 10px;
    background: var(--slate-50); border: 1px solid var(--slate-100);
  }
  .vuln-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--red); flex-shrink: 0; margin-top: 6px;
  }
  .vuln-text { font-size: 13.5px; color: var(--slate-700); line-height: 1.65; font-weight: 400; }

  /* Lifestyle sections */
  .lifestyle-section { margin-bottom: 24px; }
  .lifestyle-section:last-child { margin-bottom: 0; }
  .lifestyle-section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--slate-500);
    margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
  }
  .lifestyle-section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--slate-100);
  }
  .lifestyle-items { display: flex; flex-direction: column; gap: 8px; }
  .lifestyle-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px; border-radius: 10px;
    background: var(--green-light); border: 1px solid var(--green-mid);
    transition: transform 0.15s, box-shadow 0.15s;
    cursor: default;
  }
  .lifestyle-item:hover { transform: translateY(-1px); box-shadow: var(--shadow-sm); }
  .lifestyle-item.exercise {
    background: var(--blue-light); border-color: var(--blue-mid);
  }
  .lifestyle-num {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--green); color: white;
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    margin-top: 1px;
  }
  .lifestyle-num.blue-num { background: var(--blue); }
  .lifestyle-text { font-size: 13.5px; color: var(--slate-700); line-height: 1.65; font-weight: 500; }

  /* Right sidebar cards */
  .sidebar { display: flex; flex-direction: column; gap: 20px; }

  /* Clinical flags */
  .flags-grid { display: flex; flex-direction: column; gap: 8px; }
  .flag-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: 9px;
  }
  .flag-item.high-risk { background: var(--red-light); border: 1px solid #fca5a5; }
  .flag-item.med-risk  { background: var(--orange-light); border: 1px solid #fdba74; }
  .flag-item.low-risk  { background: var(--blue-light); border: 1px solid var(--blue-mid); }
  .flag-icon { font-size: 15px; }
  .flag-content { flex: 1; }
  .flag-title { font-size: 13px; font-weight: 700; color: var(--slate); }
  .flag-desc  { font-size: 11.5px; color: var(--slate-500); margin-top: 1px; }
  .flag-level {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 6px;
  }
  .flag-level.high { background: #fee2e2; color: var(--red); }
  .flag-level.med  { background: #fed7aa; color: var(--orange); }
  .flag-level.low  { background: var(--blue-mid); color: #1d4ed8; }

  /* Summary stats */
  .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-box {
    background: var(--slate-50); border: 1px solid var(--slate-300);
    border-radius: 10px; padding: 14px;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .stat-number { font-size: 24px; font-weight: 800; color: var(--slate); letter-spacing: -0.02em; }
  .stat-number.red-num { color: var(--red); }
  .stat-number.green-num { color: var(--green); }
  .stat-label { font-size: 11px; color: var(--slate-500); font-weight: 500; text-align: center; }

  /* Action buttons */
  .btn-primary {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white; border: none; border-radius: 10px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    transition: all 0.2s;
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.4); }
  .btn-outline {
    width: 100%; padding: 11px;
    background: white; color: var(--slate-700);
    border: 1.5px solid var(--slate-300); border-radius: 10px;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.15s;
  }
  .btn-outline:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }

  /* Disclaimer */
  .disclaimer {
    display: flex; align-items: flex-start; gap: 9px;
    background: #fffbeb; border: 1px solid #fde68a;
    border-radius: 9px; padding: 11px 14px;
    font-size: 12px; color: #92400e; line-height: 1.55;
  }
`;

const NUTRITION_TIPS = [
  "Increase intake of iron-rich foods such as red meat, poultry, fish, beans, lentils, spinach, fortified cereals, and dark leafy greens to address low hemoglobin.",
  "Consume foods high in Vitamin C (e.g., citrus fruits, berries, bell peppers, broccoli) alongside iron-rich meals to enhance iron absorption.",
  "Include foods rich in Vitamin B12 and folate, such as eggs, dairy products, fortified plant milks, leafy greens, and legumes — crucial for red blood cell production.",
  "Ensure adequate hydration by drinking plenty of water throughout the day, especially given the elevated PCV, to help maintain proper blood consistency.",
  "Limit consumption of tea, coffee, and calcium-rich foods around iron-rich meals, as they can inhibit iron absorption.",
  "Focus on a balanced diet rich in whole foods, lean proteins, fruits, and vegetables to support overall health and nutrient intake.",
  "Consider incorporating a variety of colorful fruits and vegetables to ensure a broad spectrum of vitamins and antioxidants.",
];

const EXERCISE_TIPS = [
  "Start with low-impact, moderate-intensity activities like brisk walking for 20–30 minutes, 3–4 times a week, gradually increasing as energy improves.",
  "Incorporate light aerobic exercises such as cycling, swimming, or elliptical training to improve cardiovascular health without excessive strain.",
  "Include gentle strength training using body weight or light resistance bands 2–3 times a week to build muscle and combat fatigue.",
  "Listen to your body and avoid overexertion, especially during initial stages while hemoglobin levels are low.",
  "Prioritize adequate hydration before, during, and after exercise — particularly important with high PCV to maintain blood volume.",
  "Consider flexibility and balance exercises like yoga or Pilates to improve overall physical well-being and reduce stress.",
  "Consult with a healthcare professional or certified fitness trainer before starting any new exercise regimen.",
];

const VULNERABILITIES = [
  { text: "Fatigue, weakness, and shortness of breath due to reduced oxygen transport caused by low hemoglobin (anemia)." },
  { text: "Potential for underlying conditions contributing to anemia, such as iron deficiency, nutritional deficiencies (Vitamin B12, folate), or chronic blood loss." },
  { text: "Increased risk of dehydration or polycythemia vera due to the significantly elevated Packed Cell Volume, which can lead to thicker blood and cardiovascular strain." },
  { text: "Increased susceptibility to bleeding or bruising due to the borderline low platelet count, though it's still within the lower normal limits." },
  { text: "Impaired cognitive function and reduced immune response may occur due to persistent anemia." },
];

const AI_INTERPRETATION = `"The medical report for Yash M. Patel indicates a low hemoglobin level of 12.5 g/dL, which is below the normal reference range and suggests anemia. Additionally, the Packed Cell Volume (PCV) is significantly elevated at 57.5%, a finding that warrants further investigation as it can indicate dehydration or conditions like polycythemia. The platelet count is also noted as borderline at the lower end of the normal range (150,000 cumm). The overall interpretation recommends further confirmation for anemia."`;

export default function MedVisionResults() {
  const [activeNav, setActiveNav] = useState("DASHBOARD");

  return (
    <>
      <style>{css}</style>

      {/* Navbar */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">MedVision<span>.AI</span></span>
          </div>
          <div className="nav-links">
            {["DASHBOARD", "HISTORY"].map(l => (
              <button key={l} className={`nav-link ${activeNav === l ? "active" : ""}`} onClick={() => setActiveNav(l)}>{l}</button>
            ))}
          </div>
          <div className="nav-user">
            <div className="nav-avatar">AK</div>
            <span className="nav-name">atharv sachin kate</span>
          </div>
        </div>
      </nav>

      <div className="page">

        {/* Page header */}
        <div className="page-header fade-up">
          <div className="page-eyebrow">
            <span>🩺</span> Structured Clinical Verification
          </div>
          <div className="page-header-top">
            <div>
              <h1 className="page-title">Expert Analysis Report</h1>
              <p className="page-subtitle">Generated Feb 17, 2026 · AI-assisted interpretation — verify with source records before clinical action</p>
            </div>
          </div>
        </div>

        {/* Patient band */}
        <div className="patient-band fade-up fade-up-1">
          <div className="patient-avatar">YP</div>
          <div>
            <div className="patient-name">Yash M. Patel</div>
            <div className="patient-meta">MRN: 00291847 · DOB: 14/06/1994 · Male · visit-notes-02172026.pdf</div>
          </div>
          <div className="patient-status">
            <div className="status-chip danger"><span className="status-dot"/>Anemia Suspected</div>
            <div className="status-chip warn"><span className="status-dot"/>High PCV</div>
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
                  <div className="section-subtitle">Key lab values from this visit</div>
                </div>
              </div>
              <div className="section-body">
                <div className="vitals-label">Test Results</div>
                <div className="vitals-grid">
                  <div className="vital-card red">
                    <div className="vital-value red">12.5 g/dL</div>
                    <div className="vital-badge low">Below Normal</div>
                    <div className="vital-name">Hemoglobin</div>
                  </div>
                  <div className="vital-card amber">
                    <div className="vital-value amber">57.5%</div>
                    <div className="vital-badge high">Elevated</div>
                    <div className="vital-name">Packed Cell Volume</div>
                  </div>
                  <div className="vital-card blue">
                    <div className="vital-value blue">150K</div>
                    <div className="vital-badge na">Borderline</div>
                    <div className="vital-name">Platelet Count</div>
                  </div>
                </div>

                {/* AI Interpretation block */}
                <div className="ai-card">
                  <div className="ai-label">
                    <div className="ai-bolt">⚡</div>
                    AI Interpretation
                  </div>
                  <p className="ai-text">{AI_INTERPRETATION}</p>
                </div>
              </div>
            </div>

            {/* Lifestyle Optimization */}
            <div className="section-card fade-up fade-up-3">
              <div className="section-header">
                <div className="section-icon icon-green">✦</div>
                <div>
                  <div className="section-title">Lifestyle Optimization</div>
                  <div className="section-subtitle">Personalized recommendations based on your results</div>
                </div>
              </div>
              <div className="section-body">

                <div className="lifestyle-section">
                  <div className="lifestyle-section-label">🥦 Nutritional Adjustments</div>
                  <div className="lifestyle-items">
                    {NUTRITION_TIPS.map((tip, i) => (
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
                    {EXERCISE_TIPS.map((tip, i) => (
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
                  {VULNERABILITIES.map((v, i) => (
                    <div className="vuln-item" key={i}>
                      <div className="vuln-dot" />
                      <p className="vuln-text">{v.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinical Flags */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-icon icon-orange">🚩</div>
                <div>
                  <div className="section-title">Clinical Flags</div>
                  <div className="section-subtitle">Conditions to monitor</div>
                </div>
              </div>
              <div className="section-body">
                <div className="flags-grid">
                  <div className="flag-item high-risk">
                    <span className="flag-icon">🩸</span>
                    <div className="flag-content">
                      <div className="flag-title">Anemia Suspected</div>
                      <div className="flag-desc">Low hemoglobin, further testing needed</div>
                    </div>
                    <span className="flag-level high">High</span>
                  </div>
                  <div className="flag-item med-risk">
                    <span className="flag-icon">💧</span>
                    <div className="flag-content">
                      <div className="flag-title">Elevated PCV (57.5%)</div>
                      <div className="flag-desc">Possible dehydration or polycythemia</div>
                    </div>
                    <span className="flag-level med">Medium</span>
                  </div>
                  <div className="flag-item low-risk">
                    <span className="flag-icon">🔬</span>
                    <div className="flag-content">
                      <div className="flag-title">Borderline Platelets</div>
                      <div className="flag-desc">150K cumm — lower normal limit</div>
                    </div>
                    <span className="flag-level low">Monitor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-icon icon-blue">📊</div>
                <div>
                  <div className="section-title">Report Summary</div>
                </div>
              </div>
              <div className="section-body">
                <div className="stats-row">
                  <div className="stat-box">
                    <div className="stat-number red-num">3</div>
                    <div className="stat-label">Abnormal Values</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">5</div>
                    <div className="stat-label">Risk Factors</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number green-num">14</div>
                    <div className="stat-label">Recommendations</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">8w</div>
                    <div className="stat-label">Follow-up In</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-primary">📋 Export Full Report (PDF)</button>
              <button className="btn-outline">📤 Share with Physician</button>
              <button className="btn-outline">🔔 Set Follow-up Reminder</button>
            </div>

            {/* Disclaimer */}
            <div className="disclaimer">
              <span>⚠️</span>
              This AI-generated report is for informational purposes only. Always consult a qualified healthcare professional before making medical decisions.
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
