"use client";

import React, { useState } from 'react';
import { Poppins } from 'next/font/google';
import InputHub from '@/components/inputHub/inputHub';
import OutputSection from '@/components/outputSection/outputSection';
import Footer from '@/components/footer/footer';
import Sidebar from '@/components/sidebar/sidebar';
import MedoraLoader from '@/components/medora_loader/medora_loader';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export default function HealthDashboard() {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const glassStyle = "bg-[rgba(255,255,255,0.18)] rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[0.9px] border border-[rgba(255,255,255,0.76)]";

  const handleAnalyze = () => {
    setHasAnalyzed(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
  };

  const handleReset = () => {
    setHasAnalyzed(false);
    setIsLoading(false);
  };

  return (
    <div className={`${poppins.className} flex h-screen w-full overflow-hidden bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)] text-[#2d3436]`}>
      
        <Sidebar />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <div className="mx-auto max-w-[1400px] h-full flex flex-col">

          {/* Header (Slides Down) */}
          <header className="mb-8 flex h-[60px] items-center justify-between shrink-0 animate-enter fade-in-down" style={{ animationDelay: '0ms' }}>
            <div>
              <h1 className="text-3xl font-semibold text-[#2d3436]">Good Morning, Ayoub!</h1>
              <p className="mt-1 text-sm text-[#636e72]">Monday, January 05, 2026 • Updated 10m ago</p>
            </div>

            <div className="flex items-center gap-5">
              <div className={`flex h-[50px] w-[350px] items-center px-5 transition-all focus-within:bg-white/60 ${glassStyle}`}>
                <i className="fa-solid fa-magnifying-glass text-[#636e72] text-base"></i>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="ml-4 w-full bg-transparent text-base text-[#2d3436] outline-none placeholder:text-[#636e72]"
                />
              </div>
              <button className={`relative flex h-12 w-12 items-center justify-center transition-transform hover:scale-105 hover:bg-white ${glassStyle} rounded-full`}>
                <i className="fa-regular fa-bell text-lg"></i>
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full border border-white bg-[#ff7675]"></span>
              </button>
              <button className={`flex h-12 w-12 items-center justify-center transition-transform hover:scale-105 hover:bg-white ${glassStyle} rounded-full`}>
                <i className="fa-regular fa-message text-lg"></i>
              </button>
            </div>
          </header>
          
          <div className="flex-1 flex flex-col gap-6">

            {/* --- CONDITIONAL VIEW LOGIC --- */}
            {hasAnalyzed ? (
              // OUTPUT MODE (Zoom In)
              <div key="output" className="w-full flex flex-col gap-6 animate-enter zoom-in">
                 
                 {!isLoading && (
                   <button onClick={handleReset} className="self-start text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-2 transition-colors animate-enter fade-in-left">
                      <i className="fa-solid fa-arrow-left"></i> Back to Input
                   </button>
                 )}

                 {isLoading ? (
                   <div className="w-full bg-[rgba(255,255,255,0.18)] backdrop-blur-[0.9px] border border-white/60 shadow-xl rounded-3xl p-12 min-h-[600px] flex items-center justify-center animate-enter fade-in">
                     <MedoraLoader />
                   </div>
                 ) : (
                   <OutputSection isVisible={true} />
                 )}
              </div>
            ) : (
              // INPUT MODE (Staggered Entry)
              <div key="input" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT: Input Hub (Slides in from Left) */}
                <div className="lg:col-span-8 flex flex-col animate-enter fade-in-left" style={{ animationDelay: '100ms' }}>
                    <InputHub onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                </div>

                {/* RIGHT: Patient Snapshot (Safety, Meds, History) */}
                {/* RIGHT: Patient Snapshot (Compact Version) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Widget 1: Safety Profile (Compact) */}
                    <div className={`flex flex-1 min-h-[160px] flex-col justify-between p-5 transition-transform hover:-translate-y-1 ${glassStyle} animate-in fade-in zoom-in-95 duration-700 delay-200 fill-mode-backwards`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7675]/10 text-[#ff7675]">
                                    <i className="fa-solid fa-shield-virus text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#2d3436]">Safety</h3>
                                    <span className="text-xs font-bold text-[#ff7675] uppercase tracking-wide">High Alert</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs font-bold text-[#636e72] uppercase">Blood</span>
                                <span className="block text-xl font-bold text-[#2d3436] leading-none">O+</span>
                            </div>
                        </div>
                        
                        <div className="mt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#636e72] mb-2 block">Allergies</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded-md bg-red-50 text-red-600 border border-red-100 text-xs font-bold flex items-center gap-1">
                                    <i className="fa-solid fa-circle-exclamation text-[10px]"></i> Penicillin
                                </span>
                                <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold">
                                    Peanuts
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Widget 2: Active Meds (Compact List) */}
                    <div className={`flex flex-1 min-h-[160px] flex-col justify-between p-5 transition-transform hover:-translate-y-1 ${glassStyle} animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-backwards`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#74b9ff]/10 text-[#0984e3]">
                                    <i className="fa-solid fa-pills text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#2d3436]">Meds</h3>
                                    <span className="text-xs text-[#636e72]">Active</span>
                                </div>
                            </div>
                            <span className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#2d3436]">3</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between p-1.5 rounded hover:bg-white/40 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                                    <span className="text-sm font-bold text-[#2d3436]">Lisinopril</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#636e72]">10mg</span>
                            </div>
                            <div className="flex items-center justify-between p-1.5 rounded hover:bg-white/40 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                                    <span className="text-sm font-bold text-[#2d3436]">Atorvastatin</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#636e72]">40mg</span>
                            </div>
                        </div>
                    </div>

                    {/* Widget 3: Daily Progress (Radial Graph - Visual & Compact) */}
                    <div className={`flex flex-1 min-h-[160px] flex-col justify-between p-5 transition-transform hover:-translate-y-1 ${glassStyle} animate-in fade-in zoom-in-95 duration-700 delay-500 fill-mode-backwards`}>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#55efc4]/10 text-[#00b894]">
                                <i className="fa-solid fa-clipboard-check text-lg"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#2d3436]">Progress</h3>
                                <span className="text-xs text-[#636e72]">Daily Reports</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="relative h-20 w-20">
                                {/* SVG Radial Progress Bar */}
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                                    {/* Background Circle */}
                                    <path
                                        className="text-slate-200"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    {/* Progress Circle (75% filled) */}
                                    <path
                                        className="text-[#00b894] drop-shadow-sm"
                                        strokeDasharray="75, 100"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                {/* Percentage Text in Center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-[#2d3436]">75%</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-[#2d3436]">9<span className="text-slate-400 text-lg">/12</span></span>
                                <span className="text-[10px] font-bold text-[#00b894] bg-[#55efc4]/10 px-2 py-0.5 rounded-full">On Track</span>
                                <span className="text-[10px] text-[#636e72] mt-1">3 Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* --- BOTTOM SECTION: Body Conditions (Slide Up) --- */}
            {!hasAnalyzed && (
              <div className={`flex flex-col p-8 ${glassStyle} animate-enter fade-in-up`} style={{ animationDelay: '500ms' }}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#2d3436]">Body Conditions</h2>
                  <span className="text-sm text-[#636e72]">124 Metrics Analyzed</span>
                </div>

                <div className="grid flex-1 grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                  {/* Left Subgrid */}
                  <div className="grid grid-cols-2 grid-rows-[auto_auto] gap-6">
                    
                    {/* Weight */}
                    <div className={`flex items-center justify-between p-5 ${glassStyle}`}>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-[#2d3436]">Weight</h3>
                        <span className="text-sm font-medium text-[#636e72]">Lost 0.4kg</span>
                        <div className="mt-4 flex h-12 items-end gap-1.5">
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[20%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[40%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[30%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[60%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#2d3436] h-[80%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[40%]"></div>
                        </div>
                      </div>
                      <div className="flex min-w-[110px] flex-col items-center justify-center rounded-[20px] bg-white px-6 py-4 shadow-sm">
                        <span className="text-3xl font-bold leading-none text-[#2d3436]">74.2</span>
                        <span className="text-sm font-medium text-[#a4b0be]">kg</span>
                      </div>
                    </div>

                    {/* Food */}
                    <div className={`flex items-center justify-between p-5 ${glassStyle}`}>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-[#2d3436]">Food</h3>
                        <span className="text-sm font-medium text-[#636e72]">254/1342 kCal</span>
                        <div className="mt-4 flex h-12 items-end gap-1.5">
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[30%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[50%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[20%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#2d3436] h-[60%]"></div>
                          <div className="w-1.5 rounded-sm bg-[#b2bec3] h-[30%]"></div>
                        </div>
                      </div>
                      <div className="flex min-w-[110px] flex-col items-center justify-center rounded-[20px] bg-white px-6 py-4 shadow-sm">
                        <span className="text-3xl font-bold leading-none text-[#2d3436]">253</span>
                        <span className="text-sm font-medium text-[#a4b0be]">kCal</span>
                      </div>
                    </div>

                    {/* Sleep Row */}
                    <div className={`col-span-2 flex items-center justify-between p-5 ${glassStyle}`}>
                      <div>
                        <h3 className="mb-1 text-lg font-bold text-[#2d3436]">Sleep time</h3>
                        <span className="text-sm font-medium text-[#636e72]">6h 31m</span>
                      </div>
                      <div className="relative h-10 w-[240px] rounded-full border border-white/60 bg-white/50">
                        <div className="absolute left-[30%] flex h-full w-1/2 items-center justify-center rounded-full bg-[#2d3436] text-xs font-semibold text-white shadow-md">
                          00:30 - 08:00
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Activity */}
                  <div className={`flex flex-col items-center justify-center text-center p-6 ${glassStyle}`}>
                    <h3 className="self-start text-lg font-bold text-[#2d3436]">Activity</h3>
                    <span className="self-start text-sm font-medium text-[#636e72]">654 Steps left</span>

                    <div className="relative mt-6 h-48 w-48">
                      <svg className="h-full w-full -rotate-90 transform">
                        <circle cx="96" cy="96" r="80" fill="none" stroke="#dfe6e9" strokeWidth="16" />
                        <circle 
                          cx="96" 
                          cy="96" 
                          r="80" 
                          fill="none" 
                          stroke="#2563eb" 
                          strokeWidth="16" 
                          strokeDasharray="500" 
                          strokeDashoffset="100" 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                        <span className="text-4xl font-bold leading-none text-[#2d3436]">6839</span>
                        <span className="text-sm font-medium text-[#a4b0be]">Steps</span>
                      </div>
                    </div>
                    <span className="mt-6 text-sm font-medium text-[#636e72]">Goal: 10,000 Steps</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        {/* Footer */}
        <Footer />
        </div>
        
      </main>
    </div>
  );
}