"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { generateInterviewQuestions, checkInterviewRateLimit, type InterviewQuestion } from "@/app/actions/interview";
import { getRecentResumes } from "@/app/actions/resume";
import { toast } from "sonner";

// ─── Category definitions ────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "Coding / DSA",
    label: "Coding / DSA",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "violet",
    topics: "Arrays, Strings, Linked Lists, Trees, Graphs, DP, Coding rounds",
  },
  {
    id: "Core CS",
    label: "Core CS",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    color: "blue",
    topics: "Operating Systems, DBMS, Computer Networks, OOP",
  },
  {
    id: "Development / Tech Stack",
    label: "Dev / Tech Stack",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "emerald",
    topics: "React, Node.js, Python, Java, APIs, Frameworks",
  },
  {
    id: "System Design",
    label: "System Design",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: "orange",
    topics: "HLD, LLD, Scalability, Microservices",
  },
  {
    id: "DevOps / Cloud",
    label: "DevOps / Cloud",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    color: "sky",
    topics: "Docker, Kubernetes, CI/CD, AWS, Monitoring",
  },
  {
    id: "Behavioral",
    label: "Behavioral",
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "rose",
    topics: "Teamwork, Leadership, Conflict resolution, Introductions, Strengths, Salary, Career goals",
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; activeBg: string; activeText: string; activeBorder: string }> = {
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", activeBg: "bg-violet-600", activeText: "text-white", activeBorder: "border-violet-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", activeBg: "bg-blue-600", activeText: "text-white", activeBorder: "border-blue-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", activeBg: "bg-emerald-600", activeText: "text-white", activeBorder: "border-emerald-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", activeBg: "bg-orange-500", activeText: "text-white", activeBorder: "border-orange-500" },
  sky: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", activeBg: "bg-sky-600", activeText: "text-white", activeBorder: "border-sky-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", activeBg: "bg-rose-600", activeText: "text-white", activeBorder: "border-rose-600" },
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Hard: "bg-red-100 text-red-700 border-red-200",
};

const SOURCE_LABEL: Record<string, string> = {
  resume: "📄 Resume-Based",
  position: "🎯 Position-Specific",
  category: "",
};

const LOADING_MESSAGES = [
  "Reading your resume...",
  "Analyzing job description...",
  "Identifying key skills & requirements...",
  "Crafting personalized resume questions...",
  "Generating category-based questions...",
  "Adding position-specific questions...",
  "Reviewing for quality and depth...",
  "Almost there — finalizing your 30 questions...",
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AiInterviewPrepTab({ jobs = [] }: { jobs?: any[] }) {
  // Step: 1=configure, 2=loading, 3=results
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // Step 1 state
  const [selectedJob, setSelectedJob] = useState("");
  const [jdMode, setJdMode] = useState<"select" | "paste">("select");
  const [customJd, setCustomJd] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Step 3 state
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [fromCache, setFromCache] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Rate limit state
  const [rateLimitInfo, setRateLimitInfo] = useState({ limited: false, message: "" });

  // Load recent resumes and rate limit on mount
  useEffect(() => {
    setIsLoadingResumes(true);
    getRecentResumes().then((res) => {
      setRecentResumes(res);
      setIsLoadingResumes(false);
    });

    checkInterviewRateLimit().then((res) => {
      if (res.error) setRateLimitInfo({ limited: true, message: res.error });
      else setRateLimitInfo({ limited: false, message: "" });
    });
  }, [step]);

  // Cycle loading messages
  useEffect(() => {
    if (step === 2) {
      setLoadingMsgIdx(0);
      loadingIntervalRef.current = setInterval(() => {
        setLoadingMsgIdx((prev) => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
      }, 2800);
    }
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    };
  }, [step]);

  const toggleCategory = useCallback((catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  }, []);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, DOC, or DOCX files are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10 MB.");
      return;
    }
    setUploadedFile(file);
    setSelectedResumeId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0] ?? null);
  };

  const handleUseRecentResume = (id: string) => {
    setSelectedResumeId(id);
    setUploadedFile(null);
    toast.success("Resume selected — ready to generate!");
  };

  const handleGenerate = async (forceRegenerate = false) => {
    if (rateLimitInfo.limited) {
      toast.warning(rateLimitInfo.message);
      return;
    }

    const hasJobInput = jdMode === "select" ? !!selectedJob : customJd.trim().length > 20;
    if (!hasJobInput) { toast.error(jdMode === "select" ? "Please select a job." : "Please paste a job description (minimum 20 characters)."); return; }
    if (selectedCategories.length === 0) { toast.error("Select at least one question category."); return; }

    const limitCheck = await checkInterviewRateLimit();
    if (limitCheck.error) {
      setRateLimitInfo({ limited: true, message: limitCheck.error });
      toast.warning(limitCheck.error);
      return;
    }

    setStep(2);

    const fd = new FormData();
    if (jdMode === "select") {
      fd.append("jobId", selectedJob);
    } else {
      fd.append("customJobDescription", customJd.trim());
    }
    fd.append("categories", JSON.stringify(selectedCategories));
    fd.append("forceRegenerate", String(forceRegenerate));

    if (uploadedFile) {
      fd.append("resume", uploadedFile);
    } else if (selectedResumeId) {
      fd.append("resumeId", selectedResumeId);
    }

    const startTime = Date.now();
    let result: any;

    try {
      result = await generateInterviewQuestions(fd);
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
      setStep(1);
      return;
    }

    if (result && "error" in result && !result.questions) {
      if (result.error?.includes("Please wait")) {
        toast.warning(result.error);
      } else {
        toast.error(result.error);
      }
      setStep(1);
      return;
    }

    // Enforce a minimum loader time of 5.78 seconds for successful requests
    const elapsed = Date.now() - startTime;
    if (elapsed < 5780) {
      await new Promise((resolve) => setTimeout(resolve, 5780 - elapsed));
    }

    if ("error" in result && result.questions) {
      // Partial success fallback
      toast.success("Questions generated with AI successfully!");
    }

    setQuestions(result.questions ?? []);
    setFromCache((result as any).fromCache ?? false);
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setFilterCategory("All");
    setExpandedIdx(null);

    if (!(result as any).fromCache) {
      setRateLimitInfo({
        limited: true,
        message: "Please wait 15 minutes before generating new questions to prevent AI rate limiting."
      });
    } else {
      checkInterviewRateLimit().then((res) => {
        if (res.error) setRateLimitInfo({ limited: true, message: res.error });
        else setRateLimitInfo({ limited: false, message: "" });
      });
    }

    setStep(3);

    if (fromCache && !("error" in result)) {
      toast.success("Questions generated with AI successfully!");
    }
  };

  const activeJob = jobs.find((j) => j.id === selectedJob);

  // Filtered questions for list view
  const filteredQuestions =
    filterCategory === "All"
      ? questions
      : questions.filter((q) => q.category === filterCategory || (filterCategory === "Resume-Based" && q.source === "resume") || (filterCategory === "Position-Specific" && q.source === "position"));

  const uniqueCategories = ["All", ...Array.from(new Set(questions.map((q) =>
    q.source === "resume" ? "Resume-Based" : q.source === "position" ? "Position-Specific" : q.category
  )))];

  // Card navigation
  const prevCard = () => { setIsFlipped(false); setTimeout(() => setCurrentCardIdx((i) => Math.max(0, i - 1)), 150); };
  const nextCard = () => { setIsFlipped(false); setTimeout(() => setCurrentCardIdx((i) => Math.min(questions.length - 1, i + 1)), 150); };

  const getCategoryColor = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return CATEGORY_COLORS.blue;
    return CATEGORY_COLORS[cat.color];
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ─── Step 1: Configure ─────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="flex flex-col gap-8 animate-in fade-in duration-300 pb-10">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center shrink-0">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#a855f7" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-[#111827]">AI Interview Prep</h2>
              <span className="bg-[#e6f4ea] text-[#0f9d58] text-[11px] font-bold px-2 py-0.5 rounded border border-[#ceead6] uppercase tracking-wider">
                AI Powered
              </span>
            </div>
            <p className="text-sm text-[#6b7280]">
              Get 30 personalized interview questions — tailored to the job JD and your resume
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-5xl">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Section 1 — Job */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">1</div>
                <h3 className="font-semibold text-[#0F172A]">Target Job</h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex rounded-lg bg-[#f3f4f6] p-1 mb-4">
                <button
                  onClick={() => setJdMode("select")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-all duration-200 ${jdMode === "select"
                    ? "bg-white text-[#0F172A] shadow-sm"
                    : "text-[#6b7280] hover:text-[#374151]"
                    }`}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Select a Job
                </button>
                <button
                  onClick={() => setJdMode("paste")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-all duration-200 ${jdMode === "paste"
                    ? "bg-white text-[#0F172A] shadow-sm"
                    : "text-[#6b7280] hover:text-[#374151]"
                    }`}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Paste JD
                </button>
              </div>

              {/* Select Mode */}
              {jdMode === "select" && (
                <div className="animate-in fade-in duration-200">
                  <div className="relative">
                    <select
                      id="interview-job-select"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-[#4b5563] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none appearance-none cursor-pointer transition-shadow"
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                    >
                      <option value="" disabled>— Select a role —</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.jobTitle} @ {job.companyName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {jobs.length === 0 && (
                    <p className="text-xs text-amber-600 mt-2">No job postings available. Try pasting a JD instead.</p>
                  )}
                  {activeJob && (
                    <div className="mt-3 p-3 rounded-lg bg-[#EFF6FF] border border-blue-100 text-sm text-[#172554]">
                      <p className="font-semibold">{activeJob.jobTitle}</p>
                      <p className="text-xs text-[#2563EB] mt-0.5">{activeJob.companyName} · {activeJob.industry} · {activeJob.employmentType}</p>
                      {activeJob.requiredSkills && (
                        <p className="text-xs text-[#172554] mt-1.5 line-clamp-2">
                          <span className="font-semibold">Required:</span> {activeJob.requiredSkills}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Paste Mode */}
              {jdMode === "paste" && (
                <div className="animate-in fade-in duration-200">
                  <textarea
                    value={customJd}
                    onChange={(e) => setCustomJd(e.target.value)}
                    placeholder={"Paste the full job description here...\n\nExample:\nSoftware Engineer at TechCorp\n\nResponsibilities:\n- Build and maintain web applications\n- Collaborate with cross-functional teams\n\nRequirements:\n- 3+ years of experience with React/Next.js\n- Strong TypeScript skills"}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-[#4b5563] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-shadow resize-none h-40 leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-[#9ca3af]">
                      {customJd.trim().length > 0
                        ? `${customJd.trim().length} characters`
                        : "Minimum 20 characters"}
                    </p>
                    {customJd.trim().length > 0 && customJd.trim().length <= 20 && (
                      <p className="text-xs text-amber-600">Please paste a more detailed description</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2 — Categories */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">2</div>
                <h3 className="font-semibold text-[#0F172A]">Question Categories</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4 ml-8">Select topics you want to be tested on</p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    if (selectedCategories.length === CATEGORIES.length) {
                      setSelectedCategories([]);
                    } else {
                      setSelectedCategories(CATEGORIES.map(c => c.id));
                    }
                  }}
                  className={`relative flex items-center rounded-lg border px-3 py-2 text-left transition-all ${selectedCategories.length === CATEGORIES.length
                    ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm"
                    : "bg-[#EFF6FF] border-blue-100 hover:border-blue-300 hover:bg-blue-100"
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold ${selectedCategories.length === CATEGORIES.length ? "text-white" : "text-gray-800"}`}>All Topics</span>
                  </div>
                </button>
                {CATEGORIES.map((cat) => {
                  const colors = CATEGORY_COLORS[cat.color];
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      id={`category-${cat.id.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => toggleCategory(cat.id)}
                      className={`relative flex items-center rounded-lg border px-3 py-2 text-left transition-all ${isSelected
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm"
                        : "bg-[#EFF6FF] border-blue-100 hover:border-blue-300 hover:bg-blue-100"
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={isSelected ? "text-white" : "text-[#2563EB]"}>{cat.icon}</span>
                        <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-gray-800"}`}>{cat.label}</span>
                        {isSelected && (
                          <svg className="ml-auto w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-xs text-[#2563EB] font-medium mt-3">
                  {selectedCategories.length} categor{selectedCategories.length === 1 ? "y" : "ies"} selected
                </p>
              )}
            </div>

            {/* Section 3 — Resume */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">3</div>
                <h3 className="font-semibold text-[#0F172A]">Your Resume</h3>
                <span className="text-xs text-gray-400 font-normal">(optional — adds 5 personalized questions)</span>
              </div>

              <div className="ml-8 mt-3">
                {!uploadedFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 cursor-pointer transition-colors ${isDragging ? "border-[#2563EB] bg-[#EFF6FF]" : "border-gray-200 bg-gray-50 hover:border-[#2563EB] hover:bg-[#EFF6FF]"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-blue-100" : "bg-white border border-gray-200"}`}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={isDragging ? "#2563EB" : "#9ca3af"} strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#374151]">
                        {isDragging ? "Drop your resume here" : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-xs text-[#9ca3af] mt-0.5">PDF, DOC, DOCX — max 10 MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      id="interview-file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-white text-[10px] font-bold uppercase"
                      style={{ backgroundColor: uploadedFile.name.endsWith(".pdf") ? "#ef4444" : "#2563eb" }}
                    >
                      {uploadedFile.name.split(".").pop()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-[#9ca3af]">{formatBytes(uploadedFile.size)}</p>
                    </div>
                    <button
                      onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      title="Remove file"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Recent resumes */}
                {recentResumes.length > 0 && !uploadedFile && (
                  <div className="mt-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Or pick a recently uploaded resume
                    </p>
                    <div className="flex flex-col gap-2">
                      {recentResumes.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleUseRecentResume(r.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all text-sm ${selectedResumeId === r.id
                            ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                            }`}
                        >
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="flex-1 truncate font-medium">{r.fileName}</span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                          {selectedResumeId === r.id && (
                            <svg width="14" height="14" fill="#2563eb" viewBox="0 0 20 20" className="shrink-0">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column — Summary & Generate */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:sticky lg:top-[140px] z-30">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Session Summary</h3>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 shrink-0 mt-0.5">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className={activeJob || (jdMode === "paste" && customJd.trim().length > 20) ? "text-gray-900 font-medium" : "text-gray-400"}>
                    {activeJob ? `${activeJob.jobTitle} @ ${activeJob.companyName}` : jdMode === "paste" && customJd.trim().length > 20 ? `Custom JD (${customJd.trim().length} chars)` : "No job selected"}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-gray-400 shrink-0 mt-0.5">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </span>
                  <span className={selectedCategories.length > 0 ? "text-gray-900 font-medium" : "text-gray-400"}>
                    {selectedCategories.length > 0 ? selectedCategories.join(", ") : "No categories selected"}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-gray-400 shrink-0 mt-0.5">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <span className={uploadedFile || selectedResumeId ? "text-gray-900 font-medium" : "text-gray-400"}>
                    {uploadedFile ? uploadedFile.name : selectedResumeId ? "Recent resume selected" : "No resume (generic questions)"}
                  </span>
                </div>
              </div>


              <div className="mt-5 w-full">
                <button
                  id="interview-generate-btn"
                  onClick={() => handleGenerate(false)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-sm ${(jdMode === "select" ? !selectedJob : customJd.trim().length <= 20) || selectedCategories.length === 0 || rateLimitInfo.limited
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#2563EB] hover:bg-[#172554] text-white"
                    }`}
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Generate 30 Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 2: Loading ──────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 max-w-[480px] w-full text-center">
          {/* Animated rings */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-purple-100 border-t-[#a855f7] animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-purple-50 border-t-purple-300 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#a855f7" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI is crafting your questions...</h3>
          <p className="text-sm text-[#a855f7] font-medium animate-pulse min-h-[20px] transition-all duration-500">
            {LOADING_MESSAGES[loadingMsgIdx]}
          </p>
          <div className="mt-6 flex gap-1 justify-center">
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i <= loadingMsgIdx ? "bg-[#a855f7]" : "bg-gray-200"}`}
                style={{ width: i <= loadingMsgIdx ? "20px" : "6px" }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-5">This takes 15–30 seconds</p>
        </div>
      </div>
    );
  }

  // ─── Step 3: Results ──────────────────────────────────────────────────────
  const currentQuestion = questions[currentCardIdx];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-[#111827]">Your Interview Questions</h2>
          </div>
          <p className="text-sm text-gray-500">
            {questions.length} questions · {activeJob ? `${activeJob.jobTitle} @ ${activeJob.companyName}` : jdMode === "paste" && customJd.trim() ? `Custom JD: "${customJd.trim().substring(0, 50)}${customJd.trim().length > 50 ? '...' : ''}"` : "Selected Role"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              id="view-mode-cards"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${viewMode === "cards" ? "bg-[#2563EB] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              Cards
            </button>
            <button
              id="view-mode-list"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors border-l border-gray-200 ${viewMode === "list" ? "bg-[#2563EB] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
          </div>
          <div>
            <button
              onClick={() => handleGenerate(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${rateLimitInfo.limited
                  ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
          </div>
          <button
            onClick={() => { setStep(1); setQuestions([]); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Start Over
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilterCategory(cat);
              setCurrentCardIdx(0);
              setIsFlipped(false);
              setExpandedIdx(null);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filterCategory === cat
              ? "bg-[#2563EB] text-white border-[#2563EB]"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
          >
            {cat} {cat !== "All" && `(${questions.filter(q =>
              cat === "Resume-Based" ? q.source === "resume"
                : cat === "Position-Specific" ? q.source === "position"
                  : q.category === cat
            ).length})`}
          </button>
        ))}
      </div>

      {/* ── Card View ── */}
      {viewMode === "cards" && currentQuestion && (
        <div className="flex flex-col items-center gap-4">
          {/* Progress */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>Question {currentCardIdx + 1} of {questions.length}</span>
              <span>{Math.round(((currentCardIdx + 1) / questions.length) * 100)}% complete</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#a855f7] rounded-full transition-all duration-500"
                style={{ width: `${((currentCardIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flip card */}
          <div
            id={`interview-card-${currentCardIdx}`}
            onClick={() => setIsFlipped((f) => !f)}
            className="w-full max-w-2xl cursor-pointer"
            style={{ perspective: "1200px" }}
          >
            <div
              className="relative transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                minHeight: "320px",
              }}
            >
              {/* Front — Question */}
              <div
                className="absolute inset-0 bg-white rounded-2xl border border-gray-200 shadow-md p-8 flex flex-col"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {currentQuestion.source !== "category" && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-purple-100 text-purple-700 border-purple-200">
                      {SOURCE_LABEL[currentQuestion.source]}
                    </span>
                  )}
                  {currentQuestion.source === "category" && (() => {
                    const colors = getCategoryColor(currentQuestion.category);
                    return (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {currentQuestion.category}
                      </span>
                    );
                  })()}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[currentQuestion.difficulty]}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <p className="text-lg font-semibold text-gray-900 leading-relaxed flex-1">
                  {currentQuestion.question}
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                  Click to reveal answer
                </div>
              </div>

              {/* Back — Answer */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#f3e8ff] to-[#ede9fe] rounded-2xl border border-purple-200 shadow-md p-8 flex flex-col"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#a855f7" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-purple-700">Model Answer</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed flex-1 whitespace-pre-wrap overflow-y-auto">
                  {currentQuestion.answer}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-400">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                  Click to flip back
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              id="card-prev-btn"
              onClick={prevCard}
              disabled={currentCardIdx === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${currentCardIdx === 0
                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-sm text-gray-400 font-medium px-2">
              {currentCardIdx + 1} / {questions.length}
            </span>
            <button
              id="card-next-btn"
              onClick={nextCard}
              disabled={currentCardIdx === questions.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${currentCardIdx === questions.length - 1
                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-[#a855f7] border-[#a855f7] text-white hover:bg-[#9333ea]"
                }`}
            >
              Next
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === "list" && (
        <div className="flex flex-col gap-3 max-w-3xl">
          {filteredQuestions.map((q, idx) => {
            const globalIdx = questions.indexOf(q);
            const isOpen = expandedIdx === globalIdx;
            const colors = q.source === "category" ? getCategoryColor(q.category) : { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", activeBg: "", activeText: "", activeBorder: "" };
            return (
              <div
                key={globalIdx}
                className={`bg-white rounded-xl border transition-all duration-200 ${isOpen ? "border-purple-200 shadow-sm" : "border-gray-200"}`}
              >
                <button
                  id={`list-question-${globalIdx}`}
                  onClick={() => setExpandedIdx(isOpen ? null : globalIdx)}
                  className="w-full flex items-start gap-4 p-4 text-left"
                >
                  <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {globalIdx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {q.source !== "category" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                          {SOURCE_LABEL[q.source]}
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                          {q.category}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">{q.question}</p>
                  </div>
                  <svg
                    width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                    className={`shrink-0 mt-1 transition-transform duration-200 text-gray-400 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 ml-11">
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Model Answer</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{q.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
