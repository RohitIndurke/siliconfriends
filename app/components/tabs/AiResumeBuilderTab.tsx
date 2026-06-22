import React, { useState } from 'react';

export default function AiResumeBuilderTab() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#e6f4ea] flex items-center justify-center shrink-0">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#0f9d58">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-[#111827]">AI Resume Builder</h2>
            <span className="bg-[#e6f4ea] text-[#0f9d58] text-[11px] font-bold px-2 py-0.5 rounded border border-[#ceead6] uppercase tracking-wider">
              AI Powered
            </span>
          </div>
          <p className="text-sm text-[#6b7280]">Generate a tailored resume optimized for your target role</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex items-center w-full min-w-[320px] max-w-5xl">
          {/* Step 1 */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-sm font-bold shadow-sm">
              1
            </div>
            <span className="text-sm font-bold text-[#111827] whitespace-nowrap">Select Job</span>
          </div>
          
          {/* Line */}
          <div className="flex-1 h-px bg-gray-200 mx-3 sm:mx-4"></div>
          
          {/* Step 2 */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#f3f4f6] text-[#6b7280] flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-sm font-semibold text-[#6b7280] whitespace-nowrap">Review Info</span>
          </div>

          {/* Line */}
          <div className="flex-1 h-px bg-gray-200 mx-3 sm:mx-4"></div>

          {/* Step 3 */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#f3f4f6] text-[#6b7280] flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-sm font-semibold text-[#6b7280] whitespace-nowrap">Generated Resume</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-[500px]">
        <h3 className="text-lg font-bold text-[#111827] mb-6">Choose Target Job</h3>
        
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            SELECT A JOB POSTING
          </label>
          <div className="relative">
            <select 
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-[#4b5563] focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>— Select a role —</option>
              <option value="1">Software Engineer - Google</option>
              <option value="2">Data Analyst - Amazon</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button className="bg-[#8ba5ff] hover:bg-[#7a95ef] text-white text-sm font-semibold py-2 px-5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm">
          Continue
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
