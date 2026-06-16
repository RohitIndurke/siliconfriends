"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { JOBS, POPULAR_TAGS } from "./data";
import { Button } from "@heroui/react";

const TABS = ["Opportunities", "Applications", "Offers"] as const;
type Tab = (typeof TABS)[number];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Opportunities");
  const [showEligible, setShowEligible] = useState(true);
  const [showNonEligible, setShowNonEligible] = useState(false);

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

      {/* Main Content */}
      <main className="mx-auto max-w-[1100px] px-6 py-6">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#7C3AED"><rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="1.5" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-5">
          <div className="flex gap-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-purple-700 border-b-2 border-purple-700"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Jobs List */}
          <div className="flex-1 min-w-0">
            {/* Filter checkboxes */}
            <div className="flex items-center justify-end gap-4 mb-4">
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showEligible}
                  onChange={() => setShowEligible(!showEligible)}
                  className="w-4 h-4 accent-purple-700 rounded"
                />
                Eligible
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showNonEligible}
                  onChange={() => setShowNonEligible(!showNonEligible)}
                  className="w-4 h-4 accent-gray-400 rounded"
                />
                Non Eligible
              </label>
            </div>

            {/* Job Cards */}
            <div className="flex flex-col gap-4">
              {JOBS.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {job.title}
                      </h3>
                      {job.company && (
                        <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-xs text-gray-400">{job.postedAgo}</span>
                      {job.eligible && (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Eligible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-3 mb-4">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Job type</p>
                      <p className="text-sm font-medium text-gray-800">{job.jobType}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Position Type</p>
                      <p className="text-sm font-medium text-gray-800">{job.positionType}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Industry</p>
                      <p className="text-sm font-medium text-gray-800">{job.industry}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">{job.salaryLabel}</p>
                      <p className="text-sm font-medium text-gray-800">{job.salary}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Location</p>
                      <p className="text-sm font-medium text-gray-800">
                        {job.locations.join(", ")}
                      </p>
                    </div>
                    {job.jobFunction && (
                      <div>
                        <p className="text-[11px] text-gray-400 mb-0.5">Job Function(s)</p>
                        <p className="text-sm font-medium text-gray-800">{job.jobFunction}</p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      {job.registrationClosed}
                    </span>
                    <span className="text-sm text-purple-700 font-medium hover:text-purple-900 transition-colors flex items-center gap-1">
                      View details
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-[280px] shrink-0 hidden lg:flex flex-col gap-5">
            <Button className="w-full font-semibold bg-purple-700 text-white shadow-md py-3 rounded-xl hover:bg-purple-800 transition-colors">
              Create Job
            </Button>

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
                    className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
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
              <button className="mt-3 text-sm font-semibold text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1">
                <span className="text-lg leading-none">+</span> Create Offer
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
