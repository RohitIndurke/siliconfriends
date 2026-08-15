"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow, format } from "date-fns";
import { useSession } from "@/lib/auth-client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { applyToJobAction } from "@/actions/application";
import { toast } from "sonner";

const markdownComponents = {
   p: ({ children }: any) => <p className="mb-4 last:mb-0">{children}</p>,
   ul: ({ children }: any) => <ul className="list-disc pl-5 mb-4 last:mb-0 space-y-1">{children}</ul>,
   ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-4 last:mb-0 space-y-1">{children}</ol>,
   li: ({ children }: any) => <li>{children}</li>,
   a: ({ href, children }: any) => (
      <a href={href} className="text-purple-600 hover:text-purple-800 underline" target="_blank" rel="noreferrer">
         {children}
      </a>
   ),
   strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
   h1: ({ children }: any) => <h1 className="text-xl font-bold text-gray-900 mb-4 mt-6">{children}</h1>,
   h2: ({ children }: any) => <h2 className="text-lg font-bold text-gray-900 mb-3 mt-5">{children}</h2>,
   h3: ({ children }: any) => <h3 className="text-base font-bold text-gray-900 mb-2 mt-4">{children}</h3>,
};

export default function JobDetailClient({ job }: { job: any }) {
   const { data: session } = useSession();
   const [applying, setApplying] = useState(false);
   const [applied, setApplied] = useState(false);

   const handleApply = async () => {
      if (!session) {
         toast.error("Please login to apply");
         return;
      }
      setApplying(true);
      const res = await applyToJobAction(job.id);
      setApplying(false);
      if (res.success) {
         setApplied(true);
         toast.success("Application submitted successfully!");
      } else {
         toast.error(res.error || "Failed to apply");
      }
   };

   if (!job) {
      return (
         <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center font-sans">
            <div className="text-center">
               <h1 className="text-2xl font-bold text-gray-800 mb-2">Job not found</h1>
               <Link href="/profile" className="text-purple-700 hover:text-purple-900 font-medium">
                  ← Back to Opportunity List
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#f5f5f5] font-sans">
         {/* Top Navbar */}
         <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="mx-auto max-w-[1300px] px-4 sm:px-6 py-2 flex items-center justify-between w-full">
               <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl font-bold tracking-tight select-none flex items-center">
                     <span className="font-medino text-[#2563EB] font-medium text-3xl sm:text-4xl leading-none">sf</span>
                     <span className="text-gray-300 mx-1.5 font-light">|</span>
                     <span className="text-[#0F172A]">SiliconFriends</span>
                  </span>
               </div>
               <div className="flex items-center gap-5">
                  {session ? (
                     <div className="flex items-center gap-2 ml-2 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold border-2 border-purple-200 uppercase shrink-0">
                           {session.user.name.substring(0, 2)}
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[150px] truncate">{session.user.name}</span>
                     </div>
                  ) : (
                     <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-purple-700">Login</Link>
                  )}
               </div>
            </div>
         </header>

         {/* Banner */}
         <div className="w-full h-[160px] sm:h-[220px] lg:h-[260px] relative bg-slate-800 overflow-hidden">
            <Image
               src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
               alt="Banner"
               fill
               className="object-cover opacity-60 mix-blend-overlay"
               priority
            />
            {/* Back Link Overlay */}
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10 pt-6 sm:pt-8">
               <Link
                  href="/profile"
                  className="text-white hover:text-gray-200 transition-colors flex items-center gap-1.5 text-base sm:text-lg font-medium"
               >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Opportunity List
               </Link>
            </div>
         </div>

         {/* Content */}
         <div className="max-w-[1300px] mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 lg:-mt-32 relative z-10 pb-16">
            <div className="flex flex-col lg:flex-row gap-6">

               {/* Left Column: Main Card & Details */}
               <div className="flex-1 min-w-0">
                  {/* Main Card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 mb-6 shadow-sm">
                     {/* Header */}
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6 sm:mb-8">
                        <div className="flex gap-3 sm:gap-4">
                           <div className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-200 rounded-lg flex items-center justify-center bg-white shrink-0 text-xl font-bold text-purple-700 shadow-sm">
                              {job.companyLogo}
                           </div>
                           <div>
                              <h1 className="text-lg sm:text-xl font-bold text-gray-900">{job.jobTitle}</h1>
                              <p className="text-sm text-gray-500 mt-1">{job.companyName}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                           <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                           </span>
                           {job.onCampus && (
                              <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-100">
                                 On Campus
                              </span>
                           )}
                           {job.status && (
                              <span className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full border border-purple-100">
                                 {job.status}
                              </span>
                           )}
                        </div>
                     </div>

                     {/* Grid for Types & Location */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div>
                           <p className="text-sm font-medium text-gray-900 mb-2">Employment Type</p>
                           <span className="inline-block text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5">
                              {job.employmentType}
                           </span>
                        </div>
                        <div>
                           <p className="text-sm font-medium text-gray-900 mb-2">Position Type</p>
                           <span className="inline-block text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5">
                              {job.positionType}
                           </span>
                        </div>
                        <div>
                           <p className="text-sm font-medium text-gray-900 mb-2">Location</p>
                           <div className="flex flex-wrap gap-2">
                              <span className="inline-block text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5">
                                 {job.location}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Stipend */}
                     <div className="mb-8">
                        <p className="text-sm font-medium text-gray-900 mb-2">Compensation</p>
                        <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5">
                           {job.stipendMonthly ? `Stipend: INR ${job.stipendMonthly}/mo` : job.ctcFixedLpa ? `CTC: ${job.ctcFixedLpa} LPA` : 'Unspecified'} <span className="ml-2 text-gray-400">&gt;</span>
                        </span>
                     </div>

                     {/* Description Box */}
                     <div className="mb-8">
                        <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                        <div className="border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
                           <ReactMarkdown components={markdownComponents}>
                              {job.description}
                           </ReactMarkdown>
                        </div>
                     </div>

                     {/* Job Function */}
                     {job.jobFunction && (
                        <div className="mb-8">
                           <p className="text-sm font-medium text-gray-900 mb-2">Job Function(s)</p>
                           <p className="text-sm text-gray-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> {job.jobFunction}
                           </p>
                        </div>
                     )}

                     {/* Other Details Box */}
                     {job.otherDetails && (
                        <div className="mb-8">
                           <p className="text-sm font-medium text-gray-900 mb-2">Other Details</p>
                           <div className="border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
                              <ReactMarkdown components={markdownComponents}>
                                 {job.otherDetails}
                              </ReactMarkdown>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Outer Sections */}
                  {job.eligibleCourses && job.eligibleCourses.length > 0 && (
                     <div className="mb-6">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Eligible Courses</p>
                        <div className="border border-gray-200 bg-white rounded-xl p-4 flex flex-wrap gap-2">
                           {job.eligibleCourses.map((course: string) => (
                              <span key={course} className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-md px-3 py-1.5">
                                 {course}
                              </span>
                           ))}
                        </div>
                     </div>
                  )}

                  {job.eligibilitySummary && (
                     <div className="mb-6">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Eligibility Criteria</p>
                        <div className="border border-gray-200 bg-white rounded-xl p-4 text-sm text-gray-700">
                           {job.eligibilitySummary}
                        </div>
                     </div>
                  )}

                  {job.selectionProcess && (
                     <div className="mb-6">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Selection Process Details</p>
                        <div className="border border-gray-200 bg-white rounded-xl p-4 text-sm text-gray-700">
                           {job.selectionProcess}
                        </div>
                     </div>
                  )}

               </div>

               {/* Right Column: Sidebar */}
               <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
                  {/* Apply Now Button */}
                  {job.externalApplyLink ? (
                     <a href={job.externalApplyLink} target="_blank" rel="noreferrer" className="w-full block py-3 px-4 bg-[#5415C6] hover:bg-[#430FA1] text-white font-medium rounded-lg shadow-sm transition-colors text-center">
                        Apply Now (External)
                     </a>
                  ) : (
                     <button
                        type="button"
                        onClick={handleApply}
                        disabled={applying || applied}
                        className="w-full block py-3 px-4 bg-[#5415C6] hover:bg-[#430FA1] text-white font-medium rounded-lg shadow-sm transition-colors text-center disabled:opacity-70 cursor-pointer"
                     >
                        {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
                     </button>
                  )}

                  {/* Registration Schedule */}
                  <div>
                     <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Registration Schedule</p>
                     <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm text-gray-700">
                        <p className="mb-1">Opens: {format(new Date(job.opensAt), "dd MMM yyyy, hh:mm a")}</p>
                        <p className="mb-4">Closes: {format(new Date(job.closesAt), "dd MMM yyyy, hh:mm a")}</p>

                        <p className="font-semibold text-gray-900 mb-1">Registration Details</p>
                        <p className="text-gray-700">
                           Apply only on External Registration Link :-{" "}
                           <a
                              href={job.externalApplyLink || job.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-red-600 hover:underline"
                           >
                              {job.externalApplyLink || job.website}
                           </a>
                        </p>
                     </div>
                  </div>

                  {/* Contact Person */}
                  {job.contactPerson && (
                     <div>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Person</p>
                        <div className="bg-white border border-gray-200 rounded-xl p-5 text-sm text-gray-700">
                           {job.contactPerson}
                        </div>
                     </div>
                  )}
               </aside>

            </div>
         </div>
      </div>
   );
}
