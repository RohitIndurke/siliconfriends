"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { JOBS } from "../data";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const job = JOBS.find((j) => j.id === Number(id));

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Job not found</h1>
          <Link href="/jobs" className="text-purple-700 hover:text-purple-900 font-medium">
            ← Back to Opportunity List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-2 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="MIT Arts Commerce & Science College"
            width={180}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-5">
          <button className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Gallery">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" /><circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" /><path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Calendar">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" /><path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors relative" aria-label="Messages">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="text-gray-500 hover:text-gray-800 transition-colors relative" aria-label="Notifications">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex items-center gap-2 ml-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold border-2 border-purple-200">
              RI
            </div>
            <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">Rohit Dashr...</span>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </header>

      {/* Back Link */}
      <div className="max-w-[1100px] mx-auto px-6 pt-5 pb-3">
        <Link
          href="/jobs"
          className="text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1.5 text-sm font-medium"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Opportunity List
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 -mt-4">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
              {/* Title Row */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {job.companyLogo}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{job.title}</h1>
                    <p className="text-sm text-purple-700 mt-0.5">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="text-xs text-gray-400">{job.postedAgo}</span>
                  {job.onCampus && (
                    <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-orange-200">
                      On Campus
                    </span>
                  )}
                  {job.eligible && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">
                      Eligible
                    </span>
                  )}
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-3 gap-6 mb-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">Employment Type</p>
                  <span className="inline-block text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                    {job.jobType}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">Position Type</p>
                  <span className="inline-block text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                    {job.positionType}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">Locations</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {job.locations.slice(0, 2).map((loc) => (
                      <span
                        key={loc}
                        className="inline-block text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-full px-3 py-1"
                      >
                        {loc}
                      </span>
                    ))}
                    {job.locations.length > 2 && (
                      <span className="text-xs text-purple-700 font-medium cursor-pointer hover:text-purple-900">
                        +{job.locations.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div>
                <p className="text-xs text-gray-400 mb-1.5 font-medium">{job.salaryLabel}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                  CTC: {job.salary}
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Description */}
            <Section title="Description">
              <div className="bg-orange-50/60 border-l-4 border-orange-400 rounded-r-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            </Section>

            {/* Other Details */}
            {job.otherDetails && (
              <Section title="Other Details">
                <div className="bg-orange-50/60 border-l-4 border-orange-400 rounded-r-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{job.otherDetails}</p>
                </div>
              </Section>
            )}

            {/* Other Benefits */}
            {job.otherBenefits && (
              <Section title="Other Benefits">
                <div className="bg-orange-50/60 border-l-4 border-orange-400 rounded-r-lg p-4">
                  {job.otherBenefits.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* Bond Details */}
            <Section title="Bond Details">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">{job.bondDetails}</p>
              </div>
            </Section>

            {/* Registration Closed Notice */}
            <div className="flex justify-end mb-5">
              <span className="text-xs text-red-500 font-medium">{job.registrationClosed}</span>
            </div>

            {/* Eligible Courses */}
            {job.eligibleCourses.length > 0 && (
              <Section title="Eligible Courses">
                <div className="flex flex-wrap gap-2">
                  {job.eligibleCourses.map((course) => (
                    <span
                      key={course}
                      className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Eligibility Criteria */}
            <Section title="Eligibility Criteria">
              <div className="bg-orange-50/60 border-l-4 border-orange-400 rounded-r-lg p-4">
                <p className="text-sm text-gray-700 font-medium">{job.eligibilityCriteria}</p>
              </div>
            </Section>

            {/* Selection Process */}
            <Section title="Selection Process Details">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">{job.selectionProcess}</p>
              </div>
            </Section>

            {/* Other Details (bottom) */}
            <Section title="Other Details">
              <div className="bg-orange-50/60 border-l-4 border-orange-400 rounded-r-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{job.otherDetails}</p>
              </div>
            </Section>
          </div>

          {/* Right Sidebar */}
          <aside className="w-[300px] shrink-0 hidden lg:flex flex-col gap-5 pt-0">
            {/* Registration Schedule */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
                Registration Schedule
              </h3>
              <div className="space-y-1.5 mb-4">
                <p className="text-sm text-orange-600">{job.registrationOpens}</p>
                <p className="text-sm text-orange-600">{job.registrationCloses}</p>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm font-semibold text-gray-800 mb-1">Registration Details</p>
                <p className="text-sm text-gray-600">{job.registrationDetails}</p>
              </div>
            </div>

            {/* About the Organisation */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
                About the Organisation
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {job.aboutOrganisation.length > 200
                  ? job.aboutOrganisation.slice(0, 200) + "..."
                  : job.aboutOrganisation}
                {job.aboutOrganisation.length > 200 && (
                  <button className="text-purple-700 hover:text-purple-900 font-medium ml-1">
                    more
                  </button>
                )}
              </p>

              <div className="space-y-3 border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Website</p>
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 break-all"
                  >
                    {job.website}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Industry</p>
                  <p className="text-sm text-gray-700">{job.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Organization Size</p>
                  <p className="text-sm text-gray-700">{job.organisationSize}</p>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
                Contact Person
              </h3>
              <p className="text-sm text-purple-700 font-medium">{job.contactPerson}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-bold text-gray-800 mb-3">{title}</h2>
      {children}
    </div>
  );
}
