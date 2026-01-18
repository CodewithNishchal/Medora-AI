"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  FlaskConical,
  Gauge,
  Heart,
  HelpCircle,
  Pill,
  Search,
  Stethoscope,
  Syringe,
  Target,
  Thermometer,
  TrendingUp,
  User,
  UserCheck,
  Wind,
  XCircle,
  Zap
} from "lucide-react";

// --- STYLES ---
const glassCard = "bg-[rgba(255,255,255,0.18)] backdrop-blur-[0.9px] border border-[rgba(255,255,255,0.76)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl";
const glassBtn = "flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl transition-all font-bold shadow-sm duration-300 whitespace-nowrap text-base";

const activeBtn = "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white shadow-[0_4px_15px_rgba(0,242,254,0.3)] translate-y-[-2px]";
const inactiveBtn = "bg-white/80 text-slate-600 hover:bg-white hover:text-[#00f2fe] border border-white/60";

const OutputSection = ({ isVisible = true }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [highlightedText, setHighlightedText] = useState<string[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState<any>(null);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<number, boolean>>({});
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  if (!isVisible) return null;

  // --- DATA STORE ---
  const clinicalNote = {
    originalText: `Patient is a 58-year-old male presenting with substernal chest pain for the past 3 hours. Pain is described as burning and pressure-like, rated 7/10 in severity, radiating to the left arm and jaw. Pain worsens with exertion and improves slightly with rest. Patient reports associated diaphoresis and nausea. Denies shortness of breath, palpitations, or syncope. Past medical history significant for hypertension and hyperlipidemia. Current medications include lisinopril 10mg daily and atorvastatin 40mg nightly. Patient reports smoking 1 pack per day for 30 years. Family history positive for coronary artery disease (father had MI at age 62). Vitals: BP 145/92 mmHg, HR 98 bpm, SpO2 96%, Temp 37.1°C, RR 18/min.`,
    patientInfo: { id: "MRN-482916", age: 58, sex: "Male", chiefComplaint: "Chest Pain - 3h duration", admitDate: "Jan 17, 2026" },
    metadata: { time: "1.4s", model: "Medora-v2.4 (RAG)", confidence: "High", tokens: 2847 }
  };

  const aiSummary = {
    text: "58-year-old male with 30-pack-year smoking history and cardiovascular risk factors (HTN, HLD) presents with acute substernal chest pain (7/10) radiating to left arm/jaw, associated with diaphoresis. Clinical presentation is highly concerning for acute coronary syndrome (ACS).",
    redFlags: [
      { flag: "Radiating Chest Pain (Left Arm/Jaw)", severity: "critical", keywords: ["radiating", "left arm", "jaw"] },
      { flag: "Associated Diaphoresis", severity: "critical", keywords: ["diaphoresis"] },
      { flag: "Exertional Pattern", severity: "critical", keywords: ["exertion"] }
    ]
  };

  const extractedVitals = [
    { name: "Blood Pressure", value: "145/92", unit: "mmHg", status: "high", icon: Gauge, normal: "120/80" },
    { name: "Heart Rate", value: "98", unit: "bpm", status: "high", icon: Heart, normal: "60-100" },
    { name: "SpO2", value: "96", unit: "%", status: "normal", icon: Wind, normal: ">95" },
    { name: "Temp", value: "37.1", unit: "°C", status: "normal", icon: Thermometer, normal: "36.5-37.5" }
  ];

  const riskScores = [
    { name: "HEART Score", value: 7, max: 10, risk: "High", color: "red", desc: "Risk of MACE: 50-65%" },
    { name: "TIMI Risk", value: 4, max: 7, risk: "Intermediate", color: "orange", desc: "14-day events: 20%" }
  ];

  const differentialDiagnoses = [
    {
      id: 1,
      condition: "Acute Coronary Syndrome (STEMI/NSTEMI)",
      confidence: 87,
      severity: "critical",
      source: "RAG + LLM",
      reasoning: "Classic anginal pain with radiation, significant risk factors (Smoking, HTN), and autonomic symptoms strongly suggest myocardial ischemia.",
      evidence: [
        { source: "UpToDate 2024", excerpt: "Typical angina presents as substernal discomfort radiating to arm/jaw with diaphoresis.", similarity: 94, keywords: ["substernal", "radiation", "diaphoresis"] },
        { source: "StatPearls", excerpt: "Smoking and family history significantly increase ACS likelihood.", similarity: 89, keywords: ["smoking", "family history"] }
      ],
      nextSteps: ["STAT ECG (12-lead)", "Cardiac Biomarkers (Troponin)", "Aspirin 325mg PO"]
    },
    {
      id: 2,
      condition: "Gastroesophageal Reflux (GERD)",
      confidence: 34,
      severity: "moderate",
      source: "Rule-Based",
      reasoning: "Burning character suggests esophageal origin, but radiation and diaphoresis make this less likely as primary cause.",
      evidence: [
        { source: "Mayo Clinic", excerpt: "GERD presents with substernal burning worsening with recumbency.", similarity: 62, keywords: ["burning", "substernal"] }
      ],
      nextSteps: ["GI Cocktail Trial", "Monitor for postprandial patterns"]
    }
  ];

  const atomicSymptoms = [
    { id: "s1", symptom: "Chest Pain", detail: "Substernal, Burning, 7/10", severity: 7, status: "present", organ: "heart", keywords: ["chest pain", "substernal", "burning"] },
    { id: "s2", symptom: "Diaphoresis", detail: "Profuse sweating", severity: 6, status: "present", organ: "general", keywords: ["diaphoresis"] },
    { id: "s3", symptom: "Nausea", detail: "Associated symptom", severity: 4, status: "present", organ: "stomach", keywords: ["nausea"] },
    { id: "s4", symptom: "Dyspnea", detail: "Patient denies", severity: 0, status: "absent", organ: "lungs", keywords: ["shortness of breath", "denies"] }
  ];

  const keyEntities = {
    medications: [
      { name: "Lisinopril", dose: "10mg", freq: "Daily", class: "ACE Inhibitor" },
      { name: "Atorvastatin", dose: "40mg", freq: "Nightly", class: "Statin" }
    ],
    history: [
      { condition: "Hypertension", status: "Active" },
      { condition: "Hyperlipidemia", status: "Active" }
    ],
    social: [
      { factor: "Smoking", detail: "1 PPD x 30y", risk: "High" },
      { factor: "Family Hx CAD", detail: "Father MI @ 62", risk: "High" }
    ]
  };

  const actionPlan = {
    immediate: [
      { id: "a1", action: "12-Lead ECG", priority: "STAT", time: "< 10 min" },
      { id: "a2", action: "Aspirin 325mg PO", priority: "STAT", time: "Immediate" },
      { id: "a3", action: "IV Access x2", priority: "STAT", time: "< 5 min" }
    ],
    labs: [
      { id: "l1", test: "Troponin I (Serial)", time: "Now, +3h, +6h" },
      { id: "l2", test: "CBC, BMP, Coags", time: "Now" }
    ],
    referrals: [
      { id: "r1", spec: "Cardiology", urgency: "STAT Consult", reason: "Suspected ACS" }
    ]
  };

  const missingData = [
    { field: "Prior Cardiac Workup", importance: "High" },
    { field: "Aspirin Allergy Status", importance: "Critical" }
  ];

  const organImages: Record<string, string> = {
    heart: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Heart_diagram-en.svg/400px-Heart_diagram-en.svg.png",
    lungs: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lungs_diagram_detailed.svg/400px-Lungs_diagram_detailed.svg.png",
    stomach: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Stomach_diagram.svg/300px-Stomach_diagram.svg.png",
    general: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Human_body_silhouette.svg/200px-Human_body_silhouette.svg.png"
  };

  // --- LOGIC ---
  const handleSymptomClick = (symptom: any) => {
    setSelectedSymptom(symptom);
    setHighlightedText(symptom.keywords);
  };

  const toggleEvidence = (id: number) => {
    setExpandedEvidence(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAction = (id: string) => {
    setCheckedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const highlightTextInNote = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text;
    let highlighted = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="bg-[#00f2fe]/30 text-slate-900 rounded-sm px-0.5 font-semibold">$1</mark>');
    });
    return highlighted;
  };

  const getRiskColor = (risk: string) => {
    if (risk === "High" || risk === "critical") return "text-red-600 bg-red-100 border-red-200";
    if (risk === "Intermediate" || risk === "moderate") return "text-orange-600 bg-orange-100 border-orange-200";
    return "text-green-600 bg-green-100 border-green-200";
  };

  return (
    <div className="w-full text-slate-800 animate-in fade-in duration-700">
      
      {/* 1. Header Area */}
      <div className={`${glassCard} p-6 mb-6`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Side: Title & Model Info */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">GenAI Clinical Analysis</h2>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="text-slate-500 font-medium bg-white/60 px-2 py-0.5 rounded border border-white/50">{clinicalNote.metadata.model}</span>
                <span className="text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{clinicalNote.metadata.tokens} tokens</span>
                <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1"><Clock className="w-3 h-3"/> {clinicalNote.metadata.time}</span>
              </div>
            </div>
          </div>
          
          {/* Right Side: Patient Context Panel (Widened) */}
          <div className="flex items-center justify-between gap-8 bg-slate-50/50 rounded-xl px-8 py-4 border border-slate-200/60 backdrop-blur-sm w-full md:w-auto md:min-w-[550px] md:max-w-[65%]">
             <div className="shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</div>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1 whitespace-nowrap">
                   <User className="w-3 h-3 text-slate-400" /> {clinicalNote.patientInfo.age}yo {clinicalNote.patientInfo.sex}
                </div>
             </div>
             <div className="h-8 w-px bg-slate-300/50 shrink-0"></div>
             <div className="shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MRN</div>
                <div className="text-sm font-bold text-slate-800 font-mono whitespace-nowrap">{clinicalNote.patientInfo.id}</div>
             </div>
             <div className="h-8 w-px bg-slate-300/50 shrink-0"></div>
             <div className="min-w-0 flex-1"> {/* flex-1 allows it to take remaining space */}
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complaint</div>
                <div className="text-sm font-bold text-red-500 truncate" title={clinicalNote.patientInfo.chiefComplaint}>
                  {clinicalNote.patientInfo.chiefComplaint}
                </div>
             </div>
          </div>

        </div>
      </div>
      {/* 2. Navigation Tabs (ROUNDED CAPSULE, STICKY, THICK GLASS) */}
      {/* - rounded-2xl: Gives it the capsule/pill shape
          - border: Full border to define the rounded shape
          - bg-[rgba(255,255,255,0.85)]: High opacity to obscure text behind
      */}
      <div className="sticky top-0 z-50 bg-[rgba(255,255,255,0.18)] backdrop-blur-[3.9px] border border-white/60 shadow-sm py-4 mb-6 -mx-6 px-6 rounded-2xl transition-all duration-300">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'summary', label: 'Clinical Summary', icon: FileText },
            { id: 'diagnosis', label: 'Differential Dx', icon: Brain },
            { id: 'symptoms', label: 'Symptom Analysis', icon: Stethoscope },
            { id: 'entities', label: 'Key Entities', icon: ClipboardList },
            { id: 'action', label: 'Action Plan', icon: Zap },
            { id: 'evidence', label: 'RAG Evidence', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${glassBtn} ${activeTab === tab.id ? activeBtn : inactiveBtn}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Content Area */}
      
      {/* --- TAB: SUMMARY --- */}
      {activeTab === 'summary' && (
        <div className="flex flex-col gap-6">
          
          {/* Top Row: AI Summary & Risk Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className={`${glassCard} p-8 lg:col-span-2 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" /> AI Generated Summary
                </h3>
                <div className="bg-white/50 border border-white/60 rounded-2xl p-6">
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">{aiSummary.text}</p>
                </div>
             </div>

             {/* Risk Score Widget */}
             <div className={`${glassCard} p-6 flex flex-col justify-between`}>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-orange-500" /> Risk Stratification
                </h3>
                <div className="space-y-4">
                   {riskScores.map((score, i) => (
                      <div key={i} className="bg-white/60 rounded-xl p-4 border border-white/80">
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-700">{score.name}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${score.risk === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{score.risk}</span>
                         </div>
                         <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-800">{score.value}</span>
                            <span className="text-sm text-slate-400 mb-1">/{score.max}</span>
                         </div>
                         <p className="text-[10px] text-slate-500 mt-1">{score.desc}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Vitals Strip */}
          <div className={`${glassCard} p-5`}>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00f2fe]" /> Extracted Vitals
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {extractedVitals.map((vital, i) => (
                   <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 ${vital.status === 'high' ? 'bg-red-50/50 border-red-100' : 'bg-white/40 border-white/50'}`}>
                      <div className={`p-2 rounded-lg ${vital.status === 'high' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                         <vital.icon className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="text-[10px] font-bold uppercase text-slate-500">{vital.name}</div>
                         <div className="text-lg font-bold text-slate-800 leading-none">{vital.value} <span className="text-[10px] font-normal text-slate-400">{vital.unit}</span></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Bottom Grid: Note & Red Flags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${glassCard} p-6 h-full flex flex-col`}>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00f2fe]" /> Original Clinical Note
              </h3>
              <div className="flex-1 bg-white/50 border border-white/60 rounded-xl p-5 text-slate-700 leading-relaxed font-mono text-sm shadow-inner max-h-[300px] overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: highlightTextInNote(clinicalNote.originalText, highlightedText) }} />
              </div>
              <p className="mt-3 text-center text-[10px] text-slate-400">Click a red flag to highlight the source text here.</p>
            </div>

            <div className="bg-red-50/80 border border-red-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" /> Critical Red Flags
              </h3>
              <div className="space-y-3">
                {aiSummary.redFlags.map((flag, idx) => (
                  <div key={idx} className="bg-white/60 border border-red-200 rounded-xl p-3 cursor-pointer hover:bg-white hover:shadow-md transition-all flex items-start gap-3 group" onClick={() => setHighlightedText(flag.keywords)}>
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block group-hover:text-red-700 transition-colors">{flag.flag}</span>
                      <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">{flag.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: ENTITIES --- */}
      {activeTab === 'entities' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${glassCard} p-6`}>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-500" /> Current Medications
               </h3>
               <div className="space-y-3">
                  {keyEntities.medications.map((med, i) => (
                     <div key={i} className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex justify-between items-center">
                        <div>
                           <div className="font-bold text-slate-800">{med.name} <span className="text-xs font-normal text-slate-500 ml-1">{med.dose}</span></div>
                           <div className="text-xs text-purple-600">{med.class} • {med.freq}</div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-purple-300" />
                     </div>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <div className={`${glassCard} p-6`}>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <AlertTriangle className="w-5 h-5 text-red-500" /> Risk Factors
                  </h3>
                  <div className="space-y-2">
                     {keyEntities.social.map((item, i) => (
                        <div key={i} className="bg-white/60 border border-red-100 rounded-xl p-3 flex justify-between items-center">
                           <span className="font-bold text-slate-700">{item.factor}</span>
                           <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">{item.risk}</span>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <HelpCircle className="w-4 h-4" /> Missing Information
                  </h3>
                  <ul className="space-y-2">
                     {missingData.map((data, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-amber-900">
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> {data.field} <span className="text-[10px] font-bold bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-700">{data.importance}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      )}

      {/* --- TAB: ACTION PLAN --- */}
      {activeTab === 'action' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               {/* Immediate Actions */}
               <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Zap className="w-5 h-5" /> Immediate Actions (STAT)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {actionPlan.immediate.map((action) => (
                        <div key={action.id} onClick={() => toggleAction(action.id)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${checkedActions[action.id] ? 'bg-white/30 border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'}`}>
                           <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${checkedActions[action.id] ? 'bg-white border-white' : 'border-white/60'}`}>
                              {checkedActions[action.id] && <CheckCircle className="w-3 h-3 text-red-500" />}
                           </div>
                           <div>
                              <div className="font-bold text-sm">{action.action}</div>
                              <div className="text-[10px] opacity-80">{action.time}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Labs & Referrals */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${glassCard} p-6`}>
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-blue-500" /> Labs
                     </h3>
                     <div className="space-y-2">
                        {actionPlan.labs.map((lab) => (
                           <div key={lab.id} onClick={() => toggleAction(lab.id)} className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${checkedActions[lab.id] ? 'bg-green-50 border-green-200' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checkedActions[lab.id] ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                 {checkedActions[lab.id] && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <div>
                                 <div className="font-semibold text-sm text-slate-800">{lab.test}</div>
                                 <div className="text-xs text-slate-500">{lab.time}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className={`${glassCard} p-6`}>
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-purple-500" /> Referrals
                     </h3>
                     <div className="space-y-2">
                        {actionPlan.referrals.map((ref) => (
                           <div key={ref.id} onClick={() => toggleAction(ref.id)} className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${checkedActions[ref.id] ? 'bg-purple-50 border-purple-200' : 'bg-white/40 border-white/60 hover:bg-white/60'}`}>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checkedActions[ref.id] ? 'bg-purple-500 border-purple-500' : 'border-slate-300'}`}>
                                 {checkedActions[ref.id] && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <div>
                                 <div className="font-semibold text-sm text-slate-800">{ref.spec}</div>
                                 <div className="text-xs text-slate-500">{ref.urgency}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Progress Bar Side Panel */}
            <div className={`${glassCard} p-6 h-fit`}>
               <h3 className="text-lg font-bold text-slate-800 mb-2">Workflow Status</h3>
               <div className="text-4xl font-bold text-[#00f2fe] mb-1">
                  {Object.values(checkedActions).filter(Boolean).length}
                  <span className="text-lg text-slate-400 font-medium">/{actionPlan.immediate.length + actionPlan.labs.length + actionPlan.referrals.length}</span>
               </div>
               <div className="w-full h-3 bg-slate-100 rounded-full mb-6 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe] transition-all duration-500" style={{ width: `${(Object.values(checkedActions).filter(Boolean).length / (actionPlan.immediate.length + actionPlan.labs.length + actionPlan.referrals.length)) * 100}%` }}></div>
               </div>
               <p className="text-xs text-slate-500 text-center">Complete all STAT items before discharge or admission.</p>
            </div>
         </div>
      )}

      {/* --- TAB: DIAGNOSIS (Unchanged) --- */}
      {activeTab === 'diagnosis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          <div className="lg:col-span-4 h-full">
             {/* Adjusted to top-28 for taller header */}
             <div className={`${glassCard} p-6 sticky top-28 max-h-[80vh] overflow-y-auto`}>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-[#00f2fe]" /> Live Context
                </h3>
                <div className="text-xs text-slate-600 font-mono leading-relaxed opacity-90 p-3 bg-white/40 rounded-xl border border-white/50">
                   <div dangerouslySetInnerHTML={{ __html: highlightTextInNote(clinicalNote.originalText, highlightedText) }} />
                </div>
                <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                   <p className="text-[10px] text-blue-500 font-bold uppercase mb-1">Tip</p>
                   <p className="text-xs text-blue-700">Click any highlighted evidence on the right to locate it instantly.</p>
                </div>
             </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {differentialDiagnoses.map((diag, idx) => (
              <div key={diag.id} className={`${glassCard} overflow-hidden group`}>
                <div className="p-6 border-b border-white/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white font-bold text-lg shadow-lg shadow-blue-500/30">#{idx + 1}</div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{diag.condition}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskColor(diag.severity)}`}>{diag.severity}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-purple-50 text-purple-600 border-purple-100">{diag.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase">Confidence</div>
                      <div className="text-2xl font-bold text-slate-800">{diag.confidence}%</div>
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${diag.confidence > 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${diag.confidence}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-700 font-medium leading-relaxed"><span className="text-purple-600 font-bold mr-1">AI Reasoning:</span> {diag.reasoning}</p>
                  </div>
                </div>
                <div className="bg-white/40 hover:bg-white/60 p-3 cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-[#00f2fe] hover:text-[#4facfe]" onClick={() => toggleEvidence(diag.id)}>
                  {expandedEvidence[diag.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />} View Evidence Sources ({diag.evidence.length})
                </div>
                {expandedEvidence[diag.id] && (
                  <div className="p-6 bg-slate-50/80 space-y-3 animate-in slide-in-from-top-2">
                    {diag.evidence.map((ev, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-[#4facfe] transition-all" onClick={() => setHighlightedText(ev.keywords)}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-[#00f2fe] bg-blue-50 px-2 py-1 rounded border border-blue-100">{ev.source}</span>
                          <span className="text-xs font-bold text-green-600">{ev.similarity}% Match</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">"{ev.excerpt}"</p>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Recommended Actions</span>
                      <div className="flex flex-wrap gap-2">
                        {diag.nextSteps.map((step, i) => (
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold"><CheckCircle className="w-3 h-3" /> {step}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB: SYMPTOMS (Unchanged) --- */}
      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${glassCard} p-6`}>
              <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Present Symptoms</h3>
              <div className="grid gap-3">
                {atomicSymptoms.filter(s => s.status === 'present').map(s => (
                  <div key={s.id} onClick={() => handleSymptomClick(s)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedSymptom?.id === s.id ? 'bg-green-50 border-green-400 shadow-md scale-[1.02]' : 'bg-white/40 border-white/60 hover:border-green-300'}`}>
                    <div><h4 className="font-bold text-slate-800">{s.symptom}</h4><p className="text-xs text-slate-500">{s.detail}</p></div>
                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded border border-red-200">Sev: {s.severity}/10</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${glassCard} p-6 opacity-80`}>
              <h3 className="text-lg font-bold text-slate-500 mb-4 flex items-center gap-2"><XCircle className="w-5 h-5" /> Negated Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {atomicSymptoms.filter(s => s.status === 'absent').map(s => (
                  <div key={s.id} className="px-3 py-2 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 text-sm font-medium line-through decoration-slate-400">{s.symptom}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className={`${glassCard} p-6 sticky top-28 text-center`}>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2"><Heart className="w-5 h-5 text-red-500" /> Organ Impact Map</h3>
              {selectedSymptom ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 inline-block">
                    <span className="text-xs font-bold text-[#4facfe] uppercase block mb-1">Selected Focus</span>
                    <span className="text-lg font-bold text-[#00f2fe]">{selectedSymptom.symptom}</span>
                  </div>
                  <div className="relative w-full aspect-square bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center">
                    

[Image of human heart diagram]

                    <img src={organImages[selectedSymptom.organ]} alt={selectedSymptom.organ} className="max-h-full max-w-full object-contain drop-shadow-xl" />
                  </div>
                  <p className="mt-4 text-sm text-slate-500 font-medium">Visualizing pathology in the <span className="capitalize font-bold text-slate-700">{selectedSymptom.organ}</span> system.</p>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Stethoscope className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">Select a symptom to visualize</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: EVIDENCE (Unchanged) --- */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
           {differentialDiagnoses.map(diag => (
             <div key={diag.id} className={`${glassCard} p-6`}>
               <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-white/50 pb-2">{diag.condition}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {diag.evidence.map((ev, i) => (
                   <div key={i} className="bg-white/60 p-4 rounded-xl border border-white/80 hover:shadow-md transition-all">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-[#00f2fe] bg-blue-50 px-2 py-1 rounded border border-blue-100">{ev.source}</span>
                        <span className="text-xs font-bold text-green-600">{ev.similarity}% Match</span>
                      </div>
                      <p className="text-sm text-slate-600 italic">"{ev.excerpt}"</p>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      )}

    </div>
  );
};

export default OutputSection;