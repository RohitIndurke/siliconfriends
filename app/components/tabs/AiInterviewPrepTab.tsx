import React, { useState } from 'react';

export default function AiInterviewPrepTab({ jobs = [] }: { jobs?: any[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [selectedJob, setSelectedJob] = useState("");

  const categories = ["All", "Technical", "System Design", "Behavioral", "HR"];

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
      return;
    }

    let newCategories = selectedCategories.filter(c => c !== "All");

    if (newCategories.includes(category)) {
      newCategories = newCategories.filter(c => c !== category);
      if (newCategories.length === 0) {
        newCategories = ["All"];
      }
    } else {
      newCategories.push(category);
    }

    setSelectedCategories(newCategories);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center shrink-0">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#a855f7">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-[#111827]">AI Interview Prep</h2>
            <span className="bg-[#e6f4ea] text-[#0f9d58] text-[11px] font-bold px-2 py-0.5 rounded border border-[#ceead6] uppercase tracking-wider">
              AI Powered
            </span>
          </div>
          <p className="text-sm text-[#6b7280]">Get targeted practice questions for your upcoming interviews</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-[500px]">
        {/* Target Job */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            TARGET JOB / COMPANY
          </label>
          <div className="relative">
            <select
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-[#4b5563] focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow appearance-none cursor-pointer"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="" disabled>— Select a role —</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.jobTitle} @ {job.companyName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            QUESTION CATEGORIES
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedCategories.includes(category)
                    ? 'bg-[#2563eb] text-white border-[#2563eb]'
                    : 'bg-white text-[#4b5563] border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button className="bg-[#0f9d58] hover:bg-[#0b8043] text-white text-sm font-semibold py-2 px-5 rounded-md transition-colors flex items-center gap-2 shadow-sm">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Generate Practice Questions
        </button>
      </div>
    </div>
  );
}
