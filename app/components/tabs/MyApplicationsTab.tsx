"use client";

import React, { useState, useEffect } from 'react';
import { getStudentApplicationsAction } from '@/actions/application';
import { formatDistanceToNow } from 'date-fns';

export default function MyApplicationsTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function loadApps() {
      setLoading(true);
      const res = await getStudentApplicationsAction();
      if (res.success && res.data) {
        setApplications(res.data);
      }
      setLoading(false);
    }
    loadApps();
  }, []);

  const filters = [`All (${applications.length})`, "Applied", "Shortlisted", "Interview", "Selected", "Rejected"];

  const renderStepper = (status: string) => {
    const steps = ["Applied", "Shortlisted", "Interview", "Selected"];
    let currentStep = 1;
    if (status === "Shortlisted") currentStep = 2;
    else if (status === "Interview") currentStep = 3;
    else if (status === "Selected") currentStep = 4;
    else if (status === "Rejected") currentStep = 0; // Rejected

    return (
      <div className="mt-8 mb-2 px-2 sm:px-6">
        <div className="relative flex justify-between items-center w-full">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gray-200"></div>
          
          {steps.map((stepName, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            let circleColor = "bg-white border-2 border-gray-300 text-gray-400";
            if (status === "Rejected") {
              circleColor = "bg-gray-100 border-gray-300 text-gray-400";
            } else if (isCompleted) {
              circleColor = "bg-blue-600 border-blue-600 text-white";
            } else if (isCurrent) {
              circleColor = "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100";
            }

            return (
              <div key={stepName} className="relative z-10 flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${circleColor}`}>
                  {isCompleted ? (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={`absolute top-8 text-[11px] font-semibold whitespace-nowrap ${
                  isCurrent ? "text-blue-600 font-bold" : isCompleted ? "text-gray-800" : "text-gray-400"
                }`}>
                  {stepName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredApps = applications.filter((app) => {
    if (activeFilter.startsWith("All")) return true;
    return app.status === activeFilter;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#111827]">My Applications</h2>
        <p className="text-sm text-[#6b7280] mt-1">{applications.length} applications tracked</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-2">
        {filters.map((filter) => {
          const filterName = filter.startsWith("All") ? "All" : filter;
          const isActive = activeFilter.startsWith("All") ? filter.startsWith("All") : activeFilter === filterName;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filterName)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'bg-white text-[#4b5563] border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500 text-sm">
          No job applications found. Browse Opportunities and apply to jobs!
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredApps.map((app) => {
            let statusColor = "text-blue-700 bg-blue-100";
            if (app.status === "Selected") statusColor = "text-green-700 bg-green-100";
            else if (app.status === "Shortlisted") statusColor = "text-amber-700 bg-amber-100";
            else if (app.status === "Rejected") statusColor = "text-red-700 bg-red-100";

            return (
              <div key={app.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-6 pb-12">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#111827]">{app.jobTitle}</h3>
                    <p className="text-[13px] text-[#4b5563] mt-0.5">{app.companyName}</p>
                    <p className="text-xs text-[#6b7280] font-mono mt-1">
                      Applied {app.appliedAt ? formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true }) : "recently"}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded ${statusColor}`}>
                    {app.status}
                  </span>
                </div>
                
                {renderStepper(app.status)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
