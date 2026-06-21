"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { POPULAR_TAGS, generateJobSlug } from "../components/data";
import { Button } from "@heroui/react";
import { JobCreationForm } from "../components/JobCreationForm";
import { AddStudentForm } from "../components/AddStudentForm";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import DashboardTab from "../components/tabs/DashboardTab";
import StudentsTab from "../components/tabs/StudentsTab";
import AnalyticsTab from "../components/tabs/AnalyticsTab";

const ADMIN_TABS = ["Dashboard", "Job Posting", "Analytics", "Students"] as const;

export default function AdminClient({ initialJobs }: { initialJobs: any[] }) {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [showEligible, setShowEligible] = useState(true);
  const [showNonEligible, setShowNonEligible] = useState(false);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 py-2 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MIT Arts Commerce & Science College"
              width={180}
              height={48}
              className="h-8 sm:h-10 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            {session ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold border-2 border-blue-200 uppercase shrink-0">
                    {session.user.name.substring(0, 2)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[150px] truncate">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1300px] px-4 sm:px-6 py-5">
        {/* Page Title + Admin Buttons (mobile) */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#7C3AED"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="1.5" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Jobs</h1>
          </div>
          {/* Admin buttons visible on mobile in header row */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              className="flex items-center gap-1.5 text-sm font-semibold bg-[#0f9d58] text-white shadow-sm px-3 py-2 rounded-lg hover:bg-[#0b8043] transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              AI JD Parser
            </button>
            <button
              onClick={() => setIsJobFormOpen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold bg-[#2563eb] text-white shadow-sm px-3 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Job
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-5">
          <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Dashboard" && <DashboardTab />}
        {activeTab === "Analytics" && <AnalyticsTab />}
        {activeTab === "Students" && <StudentsTab onAddStudent={() => setIsAddStudentOpen(true)} />}
        
        {activeTab === "Job Posting" && (
          <div className="flex gap-6">
            {/* Jobs List */}
            <div className="flex-1 min-w-0">
            {/* Job Cards */}
            <div className="flex flex-col gap-4">
              {initialJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" className="mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-700">Currently jobs are not available</h3>
                  <p className="text-sm text-gray-500 mt-1">Check back later for new opportunities.</p>
                </div>
              ) : (
                initialJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/admin/jobs/${generateJobSlug(job.companyName, job.jobTitle)}`}
                    className="block bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
                          {job.jobTitle}
                        </h3>
                        {job.companyName && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{job.companyName}</p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 shrink-0 ml-3">
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Eligible
                        </span>
                      </div>
                    </div>

                  {/* Card Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3 mb-3 sm:mb-4">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Job type</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-800">{job.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Position Type</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-800">{job.positionType}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Industry</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-800">{job.industry}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Stipend / Salary</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-800">{job.stipendMonthly ? `INR ${job.stipendMonthly}/mo` : job.ctcFixedLpa ? `${job.ctcFixedLpa} LPA` : 'Unspecified'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Location</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-800">
                        {job.location}
                      </p>
                    </div>
                    {job.jobFunction && (
                      <div>
                        <p className="text-[11px] text-gray-400 mb-0.5">Job Function(s)</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-800">{job.jobFunction}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      {job.status || "Open"}
                    </span>
                    <span className="text-xs sm:text-sm text-blue-600 font-medium hover:text-blue-900 transition-colors flex items-center gap-1">
                      View details
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </div>
                </Link>
              ))
            )}
            </div>
          </div>

          {/* Right Sidebar — desktop only */}
          <aside className="w-[260px] shrink-0 hidden lg:flex flex-col gap-5">
              <div className="flex flex-row gap-2 w-full">
                <button 
                  className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold bg-[#0f9d58] text-white shadow-sm py-2.5 rounded-lg hover:bg-[#0b8043] transition-colors"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  AI JD Parser
                </button>
                <button 
                  onClick={() => setIsJobFormOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold bg-[#2563eb] text-white shadow-sm py-2.5 rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Job
                </button>
              </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#F59E0B"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="7" r="1" fill="#F59E0B" /></svg>
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Popular Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Offer CTA */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                Have you received any offer directly ?
              </p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Please provide the offer details for the TPOs records and approval
              </p>
              <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1">
                <span className="text-lg leading-none">+</span> Create Offer
              </button>
            </div>
          </aside>
          </div>
        )}
      </main>

      {/* Create Job Modal Overlay */}
      {isJobFormOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 overflow-y-auto backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-3xl">
              <JobCreationForm onClose={() => setIsJobFormOpen(false)} userId={session?.user?.id || ""} />
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal Overlay */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 overflow-y-auto backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-md">
              <AddStudentForm onClose={() => setIsAddStudentOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
