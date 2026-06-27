import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardTab({ data }: { data?: any }) {
  const totalStudents = data?.totalStudents ?? 0;
  const activeJobs = data?.activeJobs ?? 0;
  const uniqueCompanies = data?.uniqueCompanies ?? 0;
  const placedStudents = data?.placedStudents ?? 0;
  const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
  const recentApps = data?.recentApplications || [];
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of placement activity — Jan 2024</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{totalStudents}</p>
            <p className="text-xs text-gray-500">Registered accounts</p>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#f97316">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Jobs</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{activeJobs}</p>
            <p className="text-xs text-gray-500">Across {uniqueCompanies} companies</p>
          </div>
        </div>

        {/* Companies */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#a855f7">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Companies</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{uniqueCompanies}</p>
            <p className="text-xs text-gray-500">Active hiring partners</p>
          </div>
        </div>

        {/* Placed */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22c55e">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Placed</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{placedStudents}</p>
            <p className="text-xs text-gray-500">{placementRate}% placement rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
            <span className="text-xs font-mono text-gray-400">{recentApps.length} total</span>
          </div>
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">
                      No recent job applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  recentApps.slice(0, 10).map((row: any, i: number) => {
                    let statusColor = "bg-blue-100 text-blue-700";
                    if (row.status === "Selected") statusColor = "bg-green-100 text-green-700";
                    else if (row.status === "Shortlisted") statusColor = "bg-yellow-100 text-yellow-700";
                    else if (row.status === "Rejected") statusColor = "bg-red-100 text-red-700";

                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{row.studentName}</p>
                          <p className="text-xs text-gray-500 font-mono">{row.rollNumber || "N/A"}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-700">{row.jobTitle}</td>
                        <td className="px-5 py-3 text-gray-700 font-medium">{row.companyName}</td>
                        <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                          {row.appliedAt ? formatDistanceToNow(new Date(row.appliedAt), { addSuffix: true }) : "Recently"}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile card list */}
          <div className="flex flex-col divide-y divide-gray-50 sm:hidden">
            {recentApps.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-xs">No applications submitted yet.</div>
            ) : (
              recentApps.slice(0, 10).map((row: any, i: number) => {
                let statusColor = "bg-blue-100 text-blue-700";
                if (row.status === "Selected") statusColor = "bg-green-100 text-green-700";
                else if (row.status === "Shortlisted") statusColor = "bg-yellow-100 text-yellow-700";
                else if (row.status === "Rejected") statusColor = "bg-red-100 text-red-700";

                return (
                  <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{row.studentName}</p>
                        <p className="text-xs text-gray-500 font-mono mb-1">{row.rollNumber || "N/A"}</p>
                        <p className="text-xs text-gray-600">{row.jobTitle} · <span className="font-medium">{row.companyName}</span></p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shrink-0 ${statusColor}`}>
                        {row.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="flex flex-col gap-6">
          {/* Placement Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-5">Placement Progress</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600 font-medium">Placed</span>
                  <span className="font-mono font-medium text-gray-900">4/8</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600 font-medium">Interviewing</span>
                  <span className="font-mono font-medium text-gray-900">2/8</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600 font-medium">Active</span>
                  <span className="font-mono font-medium text-gray-900">2/8</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Drives */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-5">Upcoming Drives</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0056b3] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    I
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Infosys</p>
                    <p className="text-xs text-gray-500 font-mono">Mar 15, 2024</p>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">5 roles</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#86bc25] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    D
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Deloitte</p>
                    <p className="text-xs text-gray-500 font-mono">Mar 20, 2024</p>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">3 roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
