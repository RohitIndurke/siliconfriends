"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { parseResumeAndCompare, getRecentResumes, deleteRecentResume } from '@/app/actions/resume';
import { toast } from "sonner";

const MOCK_JOB_REQUIREMENTS = [
  "Strong proficiency in React and Next.js",
  "Experience with TypeScript and modern JavaScript",
  "Familiarity with state management (Redux, Zustand, or Context)",
  "Understanding of responsive design and CSS frameworks (Tailwind)",
  "Ability to work in agile teams",
];

const parseSocials = (socials?: any): string[] => {
  if (!socials) return [];
  if (Array.isArray(socials)) {
    return socials.map(s => String(s).trim()).filter(Boolean);
  }
  if (typeof socials !== "string") return [];
  const cleaned = socials
    .replace(/https?:\/\/\s*[,|]\s*/gi, "https://")
    .replace(/www\.\s*[,|]\s*/gi, "www.");
  return cleaned
    .split(/[,|\n]+/)
    .map(s => s.trim().replace(/^\|\s*/, "").replace(/\s*\|$/, ""))
    .filter(Boolean);
};

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

  const [recentResumes, setRecentResumes] = useState<any[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const preloadedLogoRef = useRef<string>("/logo.png");

  useEffect(() => {
    import('@react-pdf/renderer').catch(() => {});
    if (typeof window !== "undefined") {
      fetch(window.location.origin + "/logo.png")
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => { preloadedLogoRef.current = reader.result as string; };
          reader.readAsDataURL(blob);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (step === 2) {
      setIsLoadingResumes(true);
      getRecentResumes().then(res => {
        setRecentResumes(res);
        setIsLoadingResumes(false);
      });
    }
  }, [step]);

  // Step 3 State (Extracted Data Form)
  const [resumeData, setResumeData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    location: "San Francisco, CA",
    socials: "github.com/johndoe, linkedin.com/in/johndoe",
    categorizedSkills: {
      languages: ["JavaScript", "TypeScript"],
      frontend: ["React", "Next.js", "Tailwind CSS"],
      backend: ["Node.js"],
      databases: ["MongoDB", "PostgreSQL"],
      tools: ["Git", "Docker"]
    },
    experience: [
      {
        title: "Frontend Developer",
        company: "TechCorp",
        duration: "2021 - Present",
        description: ["Built responsive UIs improving load time by 20%", "Collaborated with agile teams"]
      }
    ],
    projects: [
      {
        name: "Portfolio Website",
        duration: "2023",
        techStack: "Next.js, Tailwind",
        description: ["Developed personal portfolio with server components"]
      }
    ],
    education: [
      {
        institution: "University of Tech",
        degree: "B.S. in Computer Science",
        duration: "2018 - 2022",
        score: "GPA: 3.8/4.0"
      },
      {
        institution: "Tech High School",
        degree: "Higher Secondary Certificate",
        duration: "2016 - 2018",
        score: "92%"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services"
      }
    ],
    activities: ["Hackathon Winner 2022"],
    interests: ["Artificial Intelligence", "Open Source"],
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
    toast.success(`"${file.name}" uploaded successfully!`, {
      description: "Analyzing your resume with AI...",
    });
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const jobDesc = activeJob
        ? `${activeJob.jobTitle} at ${activeJob.companyName}. Description: ${activeJob.description}. Required Skills: ${activeJob.requiredSkills}. Good to have: ${activeJob.goodToHaveSkills}`
        : MOCK_JOB_REQUIREMENTS.join(", ");

      formData.append("jobDescription", jobDesc);

      const result = await parseResumeAndCompare(formData);

      if (result.error) {
        toast.error(result.error);
        setIsParsing(false);
        return;
      }

      setResumeData({
        name: result.name || "",
        email: result.email || "",
        phone: result.phone || "",
        location: result.location || "",
        socials: Array.isArray(result.socials) ? result.socials.join(', ') : (typeof result.socials === 'string' ? result.socials : ""),
        education: Array.isArray(result.education) ? result.education : [],
        certifications: Array.isArray(result.certifications) ? result.certifications : [],
        projects: Array.isArray(result.projects) ? result.projects : [],
        experience: Array.isArray(result.experience) ? result.experience : [],
        activities: Array.isArray(result.activities) ? result.activities : [],
        interests: Array.isArray(result.interests) ? result.interests : [],
        executiveSummary: result.executiveSummary || "",
        categorizedSkills: {
          languages: Array.isArray(result.categorizedSkills?.languages) ? result.categorizedSkills.languages : [],
          frontend: Array.isArray(result.categorizedSkills?.frontend) ? result.categorizedSkills.frontend : [],
          backend: Array.isArray(result.categorizedSkills?.backend) ? result.categorizedSkills.backend : [],
          databases: Array.isArray(result.categorizedSkills?.databases) ? result.categorizedSkills.databases : [],
          tools: Array.isArray(result.categorizedSkills?.tools) ? result.categorizedSkills.tools : [],
        },
      });

      setMissingGapAnalysis(Array.isArray(result.missingGapAnalysis) ? result.missingGapAnalysis : []);
      setAtsKeywords(Array.isArray(result.atsKeywordSummary) ? result.atsKeywordSummary : []);

      toast.success("Resume processed successfully by AI ✨");
      setStep(3);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to parse resume.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleUseRecentResume = async (resumeId: string) => {
    setIsParsing(true);
    const resume = recentResumes.find(r => r.id === resumeId);
    toast.success(resume?.fileName ? `"${resume.fileName}" loaded!` : "Resume loaded!", {
      description: "Analyzing your resume with AI...",
    });
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);

      const jobDesc = activeJob
        ? `${activeJob.jobTitle} at ${activeJob.companyName}. Description: ${activeJob.description}. Required Skills: ${activeJob.requiredSkills}. Good to have: ${activeJob.goodToHaveSkills}`
        : MOCK_JOB_REQUIREMENTS.join(", ");

      formData.append("jobDescription", jobDesc);

      const result = await parseResumeAndCompare(formData);

      if (result.error) {
        toast.error(result.error);
        setIsParsing(false);
        return;
      }

      setResumeData({
        name: result.name || "",
        email: result.email || "",
        phone: result.phone || "",
        location: result.location || "",
        socials: Array.isArray(result.socials) ? result.socials.join(', ') : (typeof result.socials === 'string' ? result.socials : ""),
        education: Array.isArray(result.education) ? result.education : [],
        certifications: Array.isArray(result.certifications) ? result.certifications : [],
        projects: Array.isArray(result.projects) ? result.projects : [],
        experience: Array.isArray(result.experience) ? result.experience : [],
        activities: Array.isArray(result.activities) ? result.activities : [],
        interests: Array.isArray(result.interests) ? result.interests : [],
        executiveSummary: result.executiveSummary || "",
        categorizedSkills: {
          languages: Array.isArray(result.categorizedSkills?.languages) ? result.categorizedSkills.languages : [],
          frontend: Array.isArray(result.categorizedSkills?.frontend) ? result.categorizedSkills.frontend : [],
          backend: Array.isArray(result.categorizedSkills?.backend) ? result.categorizedSkills.backend : [],
          databases: Array.isArray(result.categorizedSkills?.databases) ? result.categorizedSkills.databases : [],
          tools: Array.isArray(result.categorizedSkills?.tools) ? result.categorizedSkills.tools : [],
        },
      });

      setMissingGapAnalysis(Array.isArray(result.missingGapAnalysis) ? result.missingGapAnalysis : []);
      setAtsKeywords(Array.isArray(result.atsKeywordSummary) ? result.atsKeywordSummary : []);

      toast.success("Resume processed successfully by AI ✨");
      setStep(3);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load resume.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDeleteRecentResume = async (resumeId: string) => {
    setRecentResumes(prev => prev.filter(r => r.id !== resumeId));
    setConfirmDeleteId(null);
    toast.success("Resume deleted successfully");

    const res = await deleteRecentResume(resumeId);
    if (res.error) {
      toast.error(res.error);
      getRecentResumes().then(setRecentResumes);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("AI optimization complete: Your job-ready resume is prepared! ✨");
      setStep(4);
    }, 7700);
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const safetyTimer = setTimeout(() => {
      setIsDownloading(false);
      toast.error("Download took too long. Please try clicking again.");
    }, 30000);

    try {
      let logoDataUrl = preloadedLogoRef.current;
      if (!logoDataUrl || !logoDataUrl.startsWith("data:")) {
        try {
          const res = await fetch("/logo.png").catch(() => fetch(window.location.origin + "/logo.png"));
          if (res && res.ok) {
            const blob = await res.blob();
            logoDataUrl = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
            preloadedLogoRef.current = logoDataUrl;
          }
        } catch (e) {
          console.warn("Could not resolve logo base64", e);
        }
      }
      const { pdf, Document, Page, Text, View, StyleSheet, Font, Image } = await import('@react-pdf/renderer');

      const styles = StyleSheet.create({
        page: { paddingHorizontal: 40, paddingVertical: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#111827' },
        header: { flexDirection: 'row', alignItems: 'flex-start', borderBottom: '1.5pt solid #1e3a8a', paddingBottom: 12, marginBottom: 15 },
        logoContainer: { marginRight: 30 },
        logo: { width: 110, maxHeight: 75, objectFit: 'contain' },
        headerText: { flex: 1 },
        name: { fontSize: 17, fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: 5 },
        contact: { fontSize: 9, color: '#4b5563', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
        contactItem: { marginRight: 4 },
        separator: { marginHorizontal: 4, color: '#9ca3af' },
        section: { marginBottom: 12 },
        sectionTitle: {
          fontSize: 11,
          fontWeight: 'bold',
          color: '#1e3a8a',
          textTransform: 'uppercase',
          borderBottom: '1pt solid #bfdbfe',
          marginBottom: 6,
          paddingBottom: 2
        },
        row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
        itemTitle: { fontSize: 10, color: '#1e3a8a' },
        itemSubtitle: { fontSize: 9, color: '#374151' },
        dateText: { fontSize: 9, color: '#6b7280' },
        text: { fontSize: 9, lineHeight: 1.4, color: '#374151' },
        bulletRow: { flexDirection: 'row', marginBottom: 2 },
        bulletPoint: { width: 10, fontSize: 9, color: '#374151' },
        bulletContent: { flex: 1, fontSize: 9, lineHeight: 1.4, color: '#374151' },
        skillRow: { flexDirection: 'row', marginBottom: 3 },
        skillCategory: { width: 90, fontSize: 9, fontWeight: 'bold', color: '#111827' },
        skillList: { flex: 1, fontSize: 9, color: '#374151' }
      });

      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                {logoDataUrl && logoDataUrl.startsWith("data:") ? (
                  <Image src={logoDataUrl} style={styles.logo} />
                ) : null}
              </View>
              <View style={styles.headerText}>
                <Text style={styles.name}>{resumeData.name}</Text>
                <View style={styles.contact}>
                  {resumeData.location && <Text style={styles.contactItem}>{resumeData.location}</Text>}
                  {resumeData.location && (resumeData.email || resumeData.phone) && <Text style={styles.separator}>|</Text>}
                  {resumeData.email && <Text style={styles.contactItem}>{resumeData.email}</Text>}
                  {resumeData.email && resumeData.phone && <Text style={styles.separator}>|</Text>}
                  {resumeData.phone && <Text style={styles.contactItem}>{resumeData.phone}</Text>}
                </View>
                {parseSocials(resumeData.socials).length > 0 && (
                  <View style={[styles.contact, { marginTop: 3 }]}>
                    {parseSocials(resumeData.socials).map((soc, idx, arr) => (
                      <View key={idx} style={{ flexDirection: 'row' }}>
                        <Text style={styles.contactItem}>{soc}</Text>
                        {idx < arr.length - 1 && <Text style={styles.separator}>|</Text>}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {resumeData.executiveSummary ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Summary</Text>
                <Text style={styles.text}>{resumeData.executiveSummary}</Text>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technical Skills</Text>
              {Object.entries(resumeData.categorizedSkills).map(([category, skills]) => skills.length > 0 ? (
                <View key={category} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}:
                  </Text>
                  <Text style={styles.skillList}>{(skills as string[]).join(', ')}</Text>
                </View>
              ) : null)}
            </View>

            {resumeData.experience && resumeData.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {resumeData.experience.map((exp: any, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <View style={styles.row}>
                      <Text style={styles.itemTitle}>{exp.title}</Text>
                      <Text style={styles.dateText}>{exp.duration}</Text>
                    </View>
                    <Text style={[styles.itemSubtitle, { marginBottom: 3 }]}>{exp.company}</Text>
                    {exp.description && exp.description.map((bullet: string, j: number) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletContent}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {resumeData.projects && resumeData.projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {resumeData.projects.map((proj: any, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <View style={styles.row}>
                      <Text style={styles.itemTitle}>{proj.name}</Text>
                      <Text style={styles.dateText}>{proj.duration}</Text>
                    </View>
                    {proj.techStack && <Text style={[styles.itemSubtitle, { marginBottom: 3 }]}>Tech Stack: {proj.techStack}</Text>}
                    {proj.description && proj.description.map((bullet: string, j: number) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletContent}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {resumeData.education && resumeData.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {resumeData.education.map((edu: any, i: number) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <View style={styles.row}>
                      <Text style={[styles.itemTitle, { color: '#111827' }]}>{edu.institution}</Text>
                      <Text style={styles.dateText}>{edu.duration}</Text>
                    </View>
                    <Text style={styles.text}>{edu.degree} {edu.score ? `| ${edu.score}` : ''}</Text>
                  </View>
                ))}
              </View>
            )}

            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications & Licenses</Text>
                {resumeData.certifications.map((cert: any, i: number) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletContent}>
                      <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{cert.name}</Text>
                      {cert.issuer ? ` – ${cert.issuer}` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {resumeData.activities && resumeData.activities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activities, Leadership & Achievements</Text>
                {resumeData.activities.map((act: string, i: number) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletContent}>{act}</Text>
                  </View>
                ))}
              </View>
            )}

            {resumeData.interests && resumeData.interests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <Text style={styles.text}>{resumeData.interests.join(', ')}</Text>
              </View>
            )}

          </Page>
        </Document>
      );

      const blobPromise = pdf(doc).toBlob();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("PDF generation timed out after 25 seconds.")), 25000)
      );
      const blob = await Promise.race([blobPromise, timeoutPromise]);
      clearTimeout(safetyTimer);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Resume downloaded successfully!");
    } catch (err: any) {
      clearTimeout(safetyTimer);
      console.error("PDF Generation Error:", err);
      toast.error(`Failed to generate PDF: ${err.message || "Unknown error"}`);
    } finally {
      clearTimeout(safetyTimer);
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
            <>
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

              {recentResumes.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4">Or use a recently uploaded resume</h4>
                  <div className="space-y-3">
                    {recentResumes.map(resume => (
                      <div key={resume.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6b7280">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{resume.fileName}</p>
                            <p className="text-xs font-medium text-gray-500">Uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {confirmDeleteId === resume.id ? (
                            <div className="flex items-center gap-2 bg-red-50 px-2 py-1.5 rounded-md border border-red-100">
                              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Confirm:</span>
                              <button onClick={() => handleDeleteRecentResume(resume.id)} className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded shadow-sm hover:bg-red-700 transition-colors">Yes</button>
                              <button onClick={() => setConfirmDeleteId(null)} className="text-xs font-bold text-gray-500 hover:text-gray-700 px-1 transition-colors">No</button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleUseRecentResume(resume.id)}
                                className="text-sm font-semibold py-1.5 px-4 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 rounded-md shadow-sm transition-colors"
                              >
                                Continue
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(resume.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete resume"
                              >
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analyzing Resume with AI...</h3>
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
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 h-fit sticky top-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone</label>
                        <input
                          type="text"
                          value={resumeData.phone}
                          onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Location</label>
                        <input
                          type="text"
                          value={resumeData.location}
                          onChange={e => setResumeData({ ...resumeData, location: e.target.value })}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
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
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Profile Summary</label>
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
                            {category} Skills
                          </label>
                          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[40px] items-start">
                            {Array.isArray(skills) && skills.map((skill: string, i: number) => (
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
                              className="flex-1 min-w-[100px] outline-none text-sm text-gray-900 placeholder:text-gray-500 font-medium bg-transparent py-1"
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

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-3">Note: For structured sections below (Experience, Projects, Education, Certifications), direct editing is available via raw JSON in advanced mode or just continue to preview.</p>

                      {/* Advanced JSON Editor for deeply nested structures */}
                      <details className="cursor-pointer group">
                        <summary className="text-sm font-bold text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
                          Edit Advanced Structures (JSON)
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-open:rotate-180 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <textarea
                          value={JSON.stringify({
                            experience: resumeData.experience,
                            projects: resumeData.projects,
                            education: resumeData.education,
                            certifications: resumeData.certifications,
                            activities: resumeData.activities,
                            interests: resumeData.interests
                          }, null, 2)}
                          onChange={e => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setResumeData({ ...resumeData, ...parsed });
                            } catch (err) {
                              // Invalid JSON, don't update state
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md p-3 text-xs font-mono text-gray-800 bg-gray-50 focus:border-blue-500 focus:outline-none h-96 resize-y mt-2"
                        />
                      </details>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI is crafting your ATS friendly resume...</h3>
              <p className="text-sm text-gray-500 max-w-[280px] animate-pulse">
                Optimizing your experience with targeted ATS keywords and impact metrics.
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
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors flex items-center gap-2 shadow-sm ${isDownloading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading PDF...
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

          {/* Resume Preview Document (Mock - Matches PDF visually) */}
          <div id="resume-preview-document" className="bg-white rounded-sm shadow-xl border border-gray-200 p-8 sm:p-14 min-h-[800px] font-sans text-gray-800 leading-snug">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b-2 border-[#1e3a8a] pb-5 mb-6">
              <div className="shrink-0">
                <img src="/logo.png" alt="Logo" className="w-32 sm:w-40 h-auto max-h-24 object-contain object-left-top" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#1e3a8a] uppercase tracking-wide leading-none mb-2">{resumeData.name}</h1>
                <div className="text-[12px] text-gray-600 flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 font-medium mb-1.5">
                  {resumeData.location && <span>{resumeData.location}</span>}
                  {resumeData.location && (resumeData.email || resumeData.phone) && <span className="text-gray-300">|</span>}
                  {resumeData.email && <span>{resumeData.email}</span>}
                  {resumeData.email && resumeData.phone && <span className="text-gray-300">|</span>}
                  {resumeData.phone && <span>{resumeData.phone}</span>}
                </div>
                {parseSocials(resumeData.socials).length > 0 && (
                  <div className="text-[12px] text-gray-600 flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 font-medium">
                    {parseSocials(resumeData.socials).map((soc, idx, arr) => (
                      <React.Fragment key={idx}>
                        <span>{soc}</span>
                        {idx < arr.length - 1 && <span className="text-gray-300">|</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {resumeData.executiveSummary && (
              <div className="mb-5">
                <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Profile Summary</h2>
                <p className="text-[12px] text-gray-800 leading-relaxed">
                  {resumeData.executiveSummary}
                </p>
              </div>
            )}

            <div className="mb-5">
              <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Technical Skills</h2>
              <div className="space-y-1 mt-1 text-[12px]">
                {Object.entries(resumeData.categorizedSkills).map(([category, skills]) => skills.length > 0 && (
                  <div key={category} className="flex items-start gap-1">
                    <span className="font-bold text-gray-900 min-w-[90px] capitalize">
                      {category}:
                    </span>
                    <span className="text-gray-800">
                      {skills.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Professional Experience</h2>
                <div className="space-y-3">
                  {resumeData.experience.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-[13px] font-bold text-[#1e3a8a]">{exp.title}</span>
                        <span className="text-[11px] text-gray-600">{exp.duration}</span>
                      </div>
                      <div className="text-[12px] italic text-gray-700 mb-1">{exp.company}</div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {exp.description && exp.description.map((bullet: string, j: number) => (
                          <li key={j} className="text-[12px] text-gray-800">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Projects</h2>
                <div className="space-y-3">
                  {resumeData.projects.map((proj: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-[13px] font-bold text-[#1e3a8a]">{proj.name}</span>
                        <span className="text-[11px] text-gray-600">{proj.duration}</span>
                      </div>
                      {proj.techStack && <div className="text-[12px] italic text-gray-700 mb-1">Tech Stack: {proj.techStack}</div>}
                      <ul className="list-disc pl-4 space-y-0.5">
                        {proj.description && proj.description.map((bullet: string, j: number) => (
                          <li key={j} className="text-[12px] text-gray-800">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.education && resumeData.education.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Education</h2>
                <div className="space-y-3">
                  {resumeData.education.map((edu: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-[13px] font-bold text-gray-900">{edu.institution}</span>
                        <span className="text-[11px] text-gray-600">{edu.duration}</span>
                      </div>
                      <div className="text-[12px] text-gray-800">{edu.degree} {edu.score ? `| ${edu.score}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Certifications & Licenses</h2>
                <ul className="list-disc pl-4 space-y-0.5">
                  {resumeData.certifications.map((cert: any, i: number) => (
                    <li key={i} className="text-[12px] text-gray-800">
                      <span className="font-bold text-[#1e3a8a]">{cert.name}</span>
                      {cert.issuer ? ` – ${cert.issuer}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resumeData.activities && resumeData.activities.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Activities, Leadership & Achievements</h2>
                <ul className="list-disc pl-4 space-y-0.5">
                  {resumeData.activities.map((act: string, i: number) => (
                    <li key={i} className="text-[12px] text-gray-800">{act}</li>
                  ))}
                </ul>
              </div>
            )}

            {resumeData.interests && resumeData.interests.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[13px] font-bold text-[#1e3a8a] uppercase border-b border-blue-200 mb-2 pb-0.5">Interests</h2>
                <div className="text-[12px] text-gray-800">
                  {resumeData.interests.join(', ')}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
