"use client";

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { parseResumeAndCompare } from '@/app/actions/resume';

const markdownComponents = {
  p: ({ children }: any) => <span className="inline">{children}</span>,
  a: ({ href, children }: any) => <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">{children}</a>,
  strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
  ul: ({ children }: any) => <ul className="list-disc pl-5 my-1 space-y-1 block w-full">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal pl-5 my-1 space-y-1 block w-full">{children}</ol>,
  li: ({ children }: any) => <li>{children}</li>,
};

// Mock data for the selected job
const MOCK_JOB_REQUIREMENTS = [
  "Strong proficiency in React and Next.js",
  "Experience with TypeScript and modern JavaScript",
  "Familiarity with state management (Redux, Zustand, or Context)",
  "Understanding of responsive design and CSS frameworks (Tailwind)",
  "Ability to work in agile teams",
];

export default function AiResumeBuilderTab({ jobs = [] }: { jobs?: any[] }) {
  const [step, setStep] = useState(1);
  const [selectedJob, setSelectedJob] = useState("");

  const activeJob = jobs.find(j => j.id === selectedJob);
  const jobRequirements = activeJob ? [
    activeJob.requiredSkills,
    activeJob.goodToHaveSkills,
    activeJob.description?.substring(0, 100) + "..."
  ].filter(Boolean) : MOCK_JOB_REQUIREMENTS;

  // Step 2 State
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3 State (Extracted Data Form)
  const [resumeData, setResumeData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    socials: "",
    categorizedSkills: {
      technical: ["React", "JavaScript", "HTML", "CSS"],
      tools: ["Git", "Webpack"],
      soft: ["Teamwork", "Agile"]
    },
    tailoredExperience: "Frontend Developer at TechCorp (2 years)\n- Built responsive UIs [Insert Metric]\n- Improved performance by 20%",
    education: "B.S. in Computer Science, University of Tech (2018-2022)",
    certifications: "AWS Certified Developer - Associate",
    executiveSummary: "Detail-oriented software engineer with expertise in frontend paradigms. Proven track record in agile team environments building responsive applications.",
  });
  const [missingGapAnalysis, setMissingGapAnalysis] = useState<string[]>([]);
  const [atsKeywords, setAtsKeywords] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      startParsing(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startParsing(e.target.files[0]);
    }
  };

  const startParsing = async (file: File) => {
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const jobDesc = activeJob
        ? `${activeJob.jobTitle} at ${activeJob.companyName}. Description: ${activeJob.description}. Required Skills: ${activeJob.requiredSkills}. Good to have: ${activeJob.goodToHaveSkills}`
        : MOCK_JOB_REQUIREMENTS.join(", ");

      formData.append("jobDescription", jobDesc);

      const result = await parseResumeAndCompare(formData);

      if (result.error) {
        alert(result.error);
        setIsParsing(false);
        return;
      }

      setResumeData({
        name: result.name || "",
        email: result.email || "",
        socials: Array.isArray(result.socials) ? result.socials.join(', ') : (typeof result.socials === 'string' ? result.socials : ""),
        education: result.education || "",
        certifications: result.certifications || "",
        executiveSummary: result.executiveSummary || "",
        tailoredExperience: result.tailoredExperience || "",
        categorizedSkills: {
          technical: Array.isArray(result.categorizedSkills?.technical) ? result.categorizedSkills.technical : [],
          tools: Array.isArray(result.categorizedSkills?.tools) ? result.categorizedSkills.tools : [],
          soft: Array.isArray(result.categorizedSkills?.soft) ? result.categorizedSkills.soft : [],
        },
      });

      setMissingGapAnalysis(Array.isArray(result.missingGapAnalysis) ? result.missingGapAnalysis : []);
      setAtsKeywords(Array.isArray(result.atsKeywordSummary) ? result.atsKeywordSummary : []);

      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to parse resume.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(4);
    }, 7700);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');
      
      const styles = StyleSheet.create({
        page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, color: '#111827' },
        header: { marginBottom: 20, textAlign: 'center', borderBottom: '1pt solid #111827', paddingBottom: 15 },
        name: { fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
        contact: { fontSize: 10, color: '#4b5563', flexDirection: 'row', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
        section: { marginBottom: 15 },
        sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1pt solid #d1d5db', marginBottom: 8, paddingBottom: 2 },
        text: { fontSize: 10, lineHeight: 1.5 },
        skillRow: { flexDirection: 'row', marginBottom: 4 },
        skillCategory: { width: 120, fontSize: 10, fontWeight: 'bold' },
        skillList: { flex: 1, fontSize: 10 }
      });
      
      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.name}>{resumeData.name}</Text>
              <View style={styles.contact}>
                {resumeData.email ? <Text>{resumeData.email}</Text> : null}
                {resumeData.socials.split(',').map(s => s.trim()).filter(Boolean).map((social, i) => (
                  <Text key={i}>{social}</Text>
                ))}
              </View>
            </View>

            {resumeData.executiveSummary ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={styles.text}>{resumeData.executiveSummary}</Text>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Technologies</Text>
              {Object.entries(resumeData.categorizedSkills).map(([category, skills]) => skills.length > 0 ? (
                <View key={category} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>
                    {category === 'technical' ? 'Technical Skills:' : category === 'tools' ? 'Tools & Frameworks:' : 'Soft Skills:'}
                  </Text>
                  <Text style={styles.skillList}>{(skills as string[]).join(', ')}</Text>
                </View>
              ) : null)}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              <Text style={styles.text}>{resumeData.tailoredExperience}</Text>
            </View>

            {resumeData.education ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <Text style={styles.text}>{resumeData.education}</Text>
              </View>
            ) : null}

            {resumeData.certifications ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications & Licenses</Text>
                <Text style={styles.text}>{resumeData.certifications}</Text>
              </View>
            ) : null}
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("PDF Generation Error:", err);
      alert(`Failed to generate PDF: ${err.message || "Unknown error"}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div className="flex items-start gap-4 print:hidden">
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
      <div className="overflow-x-auto -mx-1 px-1 print:hidden">
        <div className="flex items-center w-full min-w-[500px] max-w-5xl">
          {[
            { num: 1, label: "Select Job" },
            { num: 2, label: "Upload & Analyze" },
            { num: 3, label: "Review Info" },
            { num: 4, label: "Generated Resume" },
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${step >= s.num ? "bg-[#2563eb] text-white" : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className={`text-sm whitespace-nowrap ${step >= s.num ? "font-bold text-[#111827]" : "font-semibold text-[#6b7280]"
                  }`}>
                  {s.label}
                </span>
              </div>
              {index < 3 && (
                <div className={`flex-1 h-px mx-3 sm:mx-4 ${step > s.num ? "bg-[#2563eb]" : "bg-gray-200"
                  }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* --- Step 1: Select Job --- */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-[500px] animate-in slide-in-from-right-4 duration-300">
          <h3 className="text-lg font-bold text-[#111827] mb-6">Choose Target Job</h3>

          <div className="flex flex-col gap-2 mb-8">
            <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
              SELECT A JOB POSTING
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

          <button
            disabled={!selectedJob}
            onClick={() => setStep(2)}
            className={`text-sm font-semibold py-2 px-5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm ${selectedJob ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Continue
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* --- Step 2: Upload & Analyze --- */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-[600px] animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#111827]">Upload Your Current Resume</h3>
            <button onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-gray-800">
              ← Back
            </button>
          </div>

          {!isParsing ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-base font-bold text-gray-900 mb-1">Drag and drop your resume here</p>
              <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX (Max 5MB)</p>
              <button className="mt-6 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium py-2 px-6 rounded-md shadow-sm transition-colors text-sm">
                Browse Files
              </button>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analyzing Resume...</h3>
              <p className="text-sm text-gray-500 max-w-[250px] animate-pulse">
                Extracting skills, experience, and contact information...
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- Step 3: Review Info --- */}
      {step === 3 && (
        <div className="animate-in slide-in-from-right-4 duration-300 max-w-6xl w-full mx-auto">
          {!isGenerating ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#111827]">Review & Edit Information</h3>
                <button onClick={() => setStep(2)} className="text-sm font-medium text-gray-500 hover:text-gray-800">
                  ← Back
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: ATS Analysis */}
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#d97706">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h4 className="font-bold text-amber-900">ATS Analysis & Recommendations</h4>
                  </div>
                  <p className="text-sm text-amber-800 mb-6">
                    Based on our analysis against the target job description, here is what you need to address to pass ATS screens:
                  </p>

                  {missingGapAnalysis.length > 0 && (
                    <div className="mb-6">
                      <h5 className="font-bold text-amber-900 text-sm mb-2 border-b border-amber-200 pb-1">Missing High-Priority Skills</h5>
                      <ul className="space-y-2">
                        {missingGapAnalysis.map((gap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {atsKeywords.length > 0 && (
                    <div>
                      <h5 className="font-bold text-amber-900 text-sm mb-2 border-b border-amber-200 pb-1">ATS Keyword Summary</h5>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {atsKeywords.map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-md border border-amber-200">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {missingGapAnalysis.length === 0 && atsKeywords.length === 0 && (
                    <p className="text-sm text-green-700 bg-green-100 p-3 rounded-md">
                      Your resume looks highly optimized for this role!
                    </p>
                  )}
                </div>

                {/* Right: Editable Form */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#0f9d58">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="font-bold text-gray-900">Extracted Data</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          value={resumeData.name}
                          onChange={e => setResumeData({ ...resumeData, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          value={resumeData.email}
                          onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Social Links</label>
                        <input
                          type="text"
                          value={resumeData.socials}
                          onChange={e => setResumeData({ ...resumeData, socials: e.target.value })}
                          placeholder="e.g. github.com/user, linkedin..."
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Executive Summary</label>
                      <textarea
                        value={resumeData.executiveSummary}
                        onChange={e => setResumeData({ ...resumeData, executiveSummary: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none h-24 resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      {Object.entries(resumeData.categorizedSkills).map(([category, skills]) => (
                        <div key={category}>
                          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                            {category === 'technical' ? 'Technical Skills' : category === 'tools' ? 'Tools & Frameworks' : 'Soft Skills'}
                          </label>
                          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[40px] items-start">
                            {skills.map((skill: string, i: number) => (
                              <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSkills = [...skills];
                                    newSkills.splice(i, 1);
                                    setResumeData({ ...resumeData, categorizedSkills: { ...resumeData.categorizedSkills, [category]: newSkills } });
                                  }}
                                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors text-blue-500 hover:text-blue-800 focus:outline-none"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              placeholder="Type & Enter..."
                              className="flex-1 min-w-[100px] outline-none text-sm bg-transparent py-1"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                  e.preventDefault();
                                  const val = e.currentTarget.value.trim();
                                  if (val && !skills.includes(val)) {
                                    setResumeData({ ...resumeData, categorizedSkills: { ...resumeData.categorizedSkills, [category]: [...skills, val] } });
                                  }
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Tailored Experience (Action + Metric)</label>
                      <textarea
                        value={resumeData.tailoredExperience}
                        onChange={e => setResumeData({ ...resumeData, tailoredExperience: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none h-32 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Education</label>
                        <textarea
                          value={resumeData.education}
                          onChange={e => setResumeData({ ...resumeData, education: e.target.value })}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none h-24 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Certifications & Licenses</label>
                        <textarea
                          value={resumeData.certifications}
                          onChange={e => setResumeData({ ...resumeData, certifications: e.target.value })}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none h-24 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleGenerate}
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold py-2.5 px-6 rounded-md transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Generate Tailored Resume
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 max-w-[600px] mx-auto w-full flex flex-col items-center justify-center text-center mt-10">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Perfecting your resume for the job...</h3>
              <p className="text-sm text-gray-500 max-w-[280px] animate-pulse">
                Applying action + metric methodology and weaving in high-priority ATS keywords...
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- Step 4: Generated Resume --- */}
      {step === 4 && (
        <div className="animate-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 print:hidden">
            <div>
              <h3 className="text-xl font-bold text-[#111827]">Your Tailored Resume is Ready!</h3>
              <p className="text-sm text-gray-500">Optimized for {activeJob ? `${activeJob.jobTitle} @ ${activeJob.companyName}` : "Selected Role"}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center gap-2 shadow-sm ${
                  isDownloading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Resume Preview Document (Mock) */}
          <div id="resume-preview-document" className="bg-white rounded-sm shadow-lg border border-gray-200 p-8 sm:p-12 min-h-[600px] font-serif">
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">{resumeData.name}</h1>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-4 flex-wrap mt-1">
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.socials.split(',').map(s => s.trim()).filter(Boolean).map((social, i) => (
                  <React.Fragment key={i}>
                    {(i > 0 || resumeData.email) && <span>•</span>}
                    <a href={social.startsWith('http') ? social : `https://${social}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                      {social}
                    </a>
                  </React.Fragment>
                ))}
              </p>
            </div>

            {resumeData.executiveSummary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {resumeData.executiveSummary}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 mb-3 pb-1">Skills & Technologies</h2>
              <div className="space-y-3 mt-2">
                {Object.entries(resumeData.categorizedSkills).map(([category, skills]) => skills.length > 0 && (
                  <div key={category} className="flex items-start gap-2">
                    <span className="text-sm font-bold text-gray-700 min-w-[140px] pt-1">
                      {category === 'technical' ? 'Technical Skills:' : category === 'tools' ? 'Tools & Frameworks:' : 'Soft Skills:'}
                    </span>
                    <div className="flex flex-wrap text-sm text-gray-700 pt-1">
                      {skills.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 mb-3 pb-1">Professional Experience</h2>
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {resumeData.tailoredExperience}
              </div>
            </div>

            {resumeData.education && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {resumeData.education}
                </div>
              </div>
            )}

            {resumeData.certifications && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 mb-3 pb-1">Certifications & Licenses</h2>
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {resumeData.certifications}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
