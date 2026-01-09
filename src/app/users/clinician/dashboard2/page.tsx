"use client";

import React, { useState } from 'react';
import { Poppins } from 'next/font/google';
import InputHub from '@/components/inputHub/inputHub';
import OutputSection from '@/components/outputSection/outputSection';
import Footer from '@/components/footer/footer';

// Load the font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export default function HealthDashboard() {
  // State to track if analysis is complete
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // The specific glass style you requested
  const glassStyle = "bg-[rgba(255,255,255,0.18)] rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[0.9px] border border-[rgba(255,255,255,0.76)]";

  // Function to handle the transition
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  // Function to go back to input
  const handleReset = () => {
    setHasAnalyzed(false);
  };

  return (
    <div className={`${poppins.className} flex h-screen w-full overflow-hidden bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)] text-[#2d3436]`}>
      
      {/* --- SIDEBAR --- */}
      <nav className="flex w-[90px] flex-col items-center justify-between border-r border-white/20 bg-transparent py-8 backdrop-blur-md z-50 h-full">
        {/* Top: Logo */}
        <div className="flex h-[70px] w-[45px] flex-col items-center justify-center rounded-2xl border border-white/30 bg-gradient-to-b from-[#4facfe] to-[#00f2fe] text-white shadow-[0_8px_12px_rgba(79,172,254,0.3)] shrink-0">
          <i className="fa-solid fa-plus mb-1 text-xl"></i>
          <i className="fa-solid fa-wave-square text-[10px]"></i>
        </div>

        {/* Center: Nav Links */}
        <div className="flex flex-1 w-full flex-col items-center justify-center">
          <ul className="flex flex-col items-center gap-4 relative">
            <div className="absolute left-1/2 top-2 bottom-2 w-[1px] -translate-x-1/2 bg-[#a4b0be]/30 -z-10"></div>
            
            <li className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-gradient-to-b from-[#4facfe] to-[#00f2fe] text-white shadow-[0_8px_15px_rgba(0,242,254,0.3)] transition-transform hover:scale-110">
              <i className="fa-solid fa-border-all text-lg"></i>
            </li>
            <li className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/60 text-[#2d3436] shadow-sm transition-transform hover:scale-110 hover:bg-white hover:text-[#2563eb]">
              <i className="fa-regular fa-calendar-check text-xl"></i>
            </li>
            <li className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/60 text-[#2d3436] shadow-sm transition-transform hover:scale-110 hover:bg-white hover:text-[#2563eb]">
              <i className="fa-solid fa-chart-pie text-xl"></i>
            </li>
            <li className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/60 text-[#2d3436] shadow-sm transition-transform hover:scale-110 hover:bg-white hover:text-[#2563eb]">
              <i className="fa-regular fa-file-lines text-xl"></i>
            </li>
            <li className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/60 text-[#2d3436] shadow-sm transition-transform hover:scale-110 hover:bg-white hover:text-[#2563eb]">
              <i className="fa-solid fa-gear text-xl"></i>
            </li>
          </ul>
        </div>

        {/* Bottom: Profile */}
        <div className="shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
            alt="User" 
            className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md"
          />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto px-10 py-8">
        
        <div className="mx-auto max-w-[1400px] h-full flex flex-col">

          {/* Header */}
          <header className="mb-8 flex h-[60px] items-center justify-between shrink-0">
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
              // --- VIEW 2: OUTPUT MODE ---
              <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
                 <button onClick={handleReset} className="self-start text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-2 transition-colors">
                    <i className="fa-solid fa-arrow-left"></i> Back to Input
                 </button>
                 <OutputSection isVisible={true} />
              </div>
            ) : (
              // --- VIEW 1: INPUT MODE ---
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
                
                {/* LEFT: Input Hub */}
                <div className="lg:col-span-8 flex flex-col">
                    <InputHub onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                </div>

                {/* RIGHT: System Vitals */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Temperature Card */}
                    <div className={`flex flex-1 min-h-[160px] flex-col justify-between p-6 transition-transform hover:-translate-y-1 ${glassStyle}`}>
                        <div className="mb-2 flex items-start gap-4">
                            <i className="fa-solid fa-temperature-half text-2xl text-[#ff7675] drop-shadow-sm"></i>
                            <div>
                                <h3 className="text-lg font-bold text-[#2d3436]">Temperature</h3>
                                <span className="block text-sm text-[#636e72]">102/70</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="relative mr-4 h-12 flex-1 opacity-80">
                                <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                                <path d="M0,35 Q30,35 50,30 T100,10" fill="none" stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </div>
                            <div className="flex min-w-[90px] flex-col items-center justify-center rounded-[20px] bg-white px-4 py-2 shadow-sm">
                                <span className="text-2xl font-bold leading-none text-[#2d3436]">37,1<span className="text-lg">°</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Heart Rate Card */}
                    <div className={`flex flex-1 min-h-[160px] flex-col justify-between p-6 transition-transform hover:-translate-y-1 ${glassStyle}`}>
                        <div className="mb-2 flex items-start gap-4">
                            <i className="fa-solid fa-heart text-2xl text-[#d63031] drop-shadow-sm"></i>
                            <div>
                                <h3 className="text-lg font-bold text-[#2d3436]">Heart Rate</h3>
                                <span className="block text-sm text-[#636e72]">124 bpm</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="relative mr-4 h-12 flex-1 opacity-80">
                                <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                                <path d="M0,20 L15,20 L25,5 L35,35 L45,10 L55,20 L100,20" fill="none" stroke="#0984e3" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="flex min-w-[90px] flex-col items-center justify-center rounded-[20px] bg-white px-4 py-2 shadow-sm">
                                <span className="text-2xl font-bold leading-none text-[#2d3436]">124</span>
                            </div>
                        </div>
                    </div>

                    {/* Glucose Card */}
                    <div className={`flex flex-1 min-h-[160px] flex-col justify-between p-6 transition-transform hover:-translate-y-1 ${glassStyle}`}>
                        <div className="mb-2 flex items-start gap-4">
                            <i className="fa-solid fa-viruses text-2xl text-[#e17055] drop-shadow-sm"></i>
                            <div>
                                <h3 className="text-lg font-bold text-[#2d3436]">Glucose</h3>
                                <span className="block text-sm text-[#636e72]">182/ml</span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="relative mr-4 h-12 flex-1 opacity-80">
                                <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                                <path d="M0,25 Q15,10 30,25 T60,25 T100,15" fill="none" stroke="#6c5ce7" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="flex min-w-[90px] flex-col items-center justify-center rounded-[20px] bg-white px-4 py-2 shadow-sm">
                                <span className="text-2xl font-bold leading-none text-[#2d3436]">182</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* --- BOTTOM SECTION: Body Conditions (Rest) --- */}
            {/* We keep this visible in Input Mode, but hide it in Output Mode to focus on results */}
            {!hasAnalyzed && (
              <div className={`flex flex-col p-8 ${glassStyle}`}>
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

        {/* Footer (Outside max-w container to stretch full width) */}
        <Footer />
        </div>
        
        
      </main>
    </div>
  );
}