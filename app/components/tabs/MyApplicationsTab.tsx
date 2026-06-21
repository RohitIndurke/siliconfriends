import React, { useState } from 'react';

const applications = [
  {
    id: 1,
    role: "Software Engineer L3",
    company: "Google",
    appliedDate: "Jan 15, 2024",
    status: "Shortlisted",
    statusColor: "text-amber-700 bg-amber-100",
    currentStep: 2,
  },
  {
    id: 2,
    role: "Software Development Engineer",
    company: "Amazon",
    appliedDate: "Jan 22, 2024",
    status: "Applied",
    statusColor: "text-blue-700 bg-blue-100",
    currentStep: 1,
  }
];

const filters = ["All (2)", "Applied", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];

export default function MyApplicationsTab() {
  const [activeFilter, setActiveFilter] = useState("All (2)");

  const renderStepper = (currentStep: number) => {
    const steps = ["Applied", "Shortlisted", "Interview", "Selected"];
    
    return (
      <div className="mt-8 mb-2 px-2 sm:px-6">
        <div className="relative flex justify-between items-center w-full">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gray-200"></div>
          
          {steps.map((stepName, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            
            return (
              <div key={stepName} className="flex flex-col items-center relative z-10">
                {isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-sm ring-[6px] ring-white">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-[13px] font-bold shadow-sm ring-[6px] ring-white">
                    {stepNum}
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#f3f4f6] text-[#9ca3af] flex items-center justify-center text-[13px] font-bold ring-[6px] ring-white">
                    {stepNum}
                  </div>
                )}
                <span className={`absolute top-10 text-[11px] font-mono whitespace-nowrap ${
                  isCompleted ? "text-[#374151]" : isActive ? "text-[#111827] font-bold" : "text-[#9ca3af]"
                }`}>
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-6"></div> {/* Spacer for absolute positioned labels */}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#111827]">My Applications</h2>
        <p className="text-sm text-[#6b7280] mt-1">2 applications tracked</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-2">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeFilter === filter
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'bg-white text-[#4b5563] border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-4">
        {applications.map(app => (
          <div key={app.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[15px] font-bold text-[#111827]">{app.role}</h3>
                <p className="text-[13px] text-[#4b5563] mt-0.5">{app.company}</p>
                <p className="text-xs text-[#6b7280] font-mono mt-1">Applied {app.appliedDate}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded ${app.statusColor}`}>
                {app.status}
              </span>
            </div>
            
            {renderStepper(app.currentStep)}
          </div>
        ))}
      </div>
    </div>
  );
}
