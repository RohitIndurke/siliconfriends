import React from 'react';

export default function AnalyticsTab({ data }: { data?: any }) {
  const placedStudents = data?.placedStudents ?? 0;
  const totalStudents = data?.totalStudents ?? 0;
  const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Placement statistics — Academic Year 2023-24</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Placements */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22c55e">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Placements</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{placedStudents}</p>
            <p className="text-xs text-gray-500">Live DB count</p>
          </div>
        </div>

        {/* Placement Rate */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Placement Rate</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{placementRate}%</p>
            <p className="text-xs text-gray-500">Based on eligible pool</p>
          </div>
        </div>

        {/* Highest Package */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#f97316">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Highest Package</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">35 LPA</p>
            <p className="text-xs text-gray-500">Google — SE L3</p>
          </div>
        </div>

        {/* Avg Package */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#a855f7">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Avg. Package</p>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">18.2 LPA</p>
            <p className="text-xs text-gray-500">Across all companies</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 sm:mb-6">Company-wise Placements</h3>
          <div className="overflow-x-auto">
            <div className="h-[220px] sm:h-[250px] flex items-end justify-between relative pl-8 pb-8 min-w-[280px]">
             {/* Y-Axis */}
             <div className="absolute left-0 top-0 bottom-8 w-6 flex flex-col justify-between text-[10px] text-gray-400 font-mono text-right">
                <span>20</span>
                <span>15</span>
                <span>10</span>
                <span>5</span>
                <span>0</span>
             </div>
             {/* Grid Lines */}
             <div className="absolute left-8 right-0 top-0 bottom-8 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-full h-px border-t border-dashed border-gray-200"></div>
                ))}
             </div>
             
             {/* Bars */}
             {[
               { label: 'Amazon', value: 15 },
               { label: 'Google', value: 12 },
               { label: 'Microsoft', value: 9 },
               { label: 'Flipkart', value: 7 },
               { label: 'Deloitte', value: 8 },
               { label: 'Infosys', value: 18 },
             ].map((company, i) => (
                <div key={i} className="relative flex flex-col items-center w-8 sm:w-12 z-10 group cursor-pointer">
                   <div 
                      className="w-4 sm:w-6 bg-blue-600 rounded-t-sm transition-all group-hover:bg-blue-500" 
                      style={{ height: `${(company.value / 20) * 100}%` }}
                   ></div>
                   <span className="absolute -bottom-6 text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{company.label}</span>
                </div>
             ))}
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 sm:mb-6">Department-wise Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16 h-auto sm:h-[250px] py-4 sm:py-0">
             <div className="relative w-48 h-48">
                {/* CSS SVG Donut Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                   {/* CS: 42 */}
                   <circle cx="50" cy="50" r="35" fill="transparent" stroke="#2563eb" strokeWidth="25" strokeDasharray="93 127" strokeDashoffset="0" />
                   {/* IT: 22 */}
                   <circle cx="50" cy="50" r="35" fill="transparent" stroke="#10b981" strokeWidth="25" strokeDasharray="48 172" strokeDashoffset="-95" />
                   {/* ECE: 15 */}
                   <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f59e0b" strokeWidth="25" strokeDasharray="32 188" strokeDashoffset="-145" />
                   {/* Mech: 10 */}
                   <circle cx="50" cy="50" r="35" fill="transparent" stroke="#8b5cf6" strokeWidth="25" strokeDasharray="21 199" strokeDashoffset="-179" />
                   {/* Civil: 8 */}
                   <circle cx="50" cy="50" r="35" fill="transparent" stroke="#ec4899" strokeWidth="25" strokeDasharray="16 204" strokeDashoffset="-202" />
                </svg>
                {/* Inner White Cutout to ensure transparency hole is clean if needed, though fill="transparent" works */}
             </div>
             
             {/* Legend */}
             <div className="flex flex-col gap-3">
                {[
                  { name: 'B.Sc. CS', count: 32, color: 'bg-blue-600' },
                  { name: 'B.C.A.', count: 24, color: 'bg-emerald-500' },
                  { name: 'M.Sc. CS', count: 18, color: 'bg-amber-500' },
                  { name: 'B.B.A.', count: 14, color: 'bg-violet-500' },
                  { name: 'Data Sci.', count: 9, color: 'bg-pink-500' },
                ].map((dept, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${dept.color}`}></div>
                      <span className="text-xs text-gray-600 w-20 truncate">{dept.name}</span>
                      <span className="text-xs font-mono font-bold text-gray-900 ml-auto">{dept.count}</span>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Area Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-4 sm:mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <h3 className="text-base font-bold text-gray-900">Monthly Applications vs Placements Trend</h3>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block bg-blue-500 rounded"></span>Applications</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block bg-green-500 rounded"></span>Placements</span>
          </div>
        </div>
        <div className="h-[180px] sm:h-[250px] relative w-full flex items-end pl-8 pb-8">
           {/* Y-Axis */}
           <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] text-gray-400 font-mono text-right">
              <span>120</span>
              <span>90</span>
              <span>60</span>
              <span>30</span>
              <span>0</span>
           </div>
           
           {/* Grid Lines */}
           <div className="absolute left-8 right-0 top-0 bottom-6 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                 <div key={i} className="w-full h-px border-t border-dashed border-gray-200"></div>
              ))}
           </div>
           
           {/* X-Axis Labels */}
           <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] text-gray-400 px-4">
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
           </div>
           
           {/* Line Chart Area */}
           <div className="absolute left-8 right-0 top-0 bottom-6">
             <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
                {/* Applications Trend (Blue) */}
                <path 
                   d="M 0 150 Q 250 100 500 80 T 1000 130" 
                   fill="none" 
                   stroke="#3b82f6" 
                   strokeWidth="3" 
                />
                <path 
                   d="M 0 150 Q 250 100 500 80 T 1000 130 L 1000 200 L 0 200 Z" 
                   fill="url(#blue-gradient)" 
                   opacity="0.1"
                />
                {/* Placements Trend (Green) */}
                <path 
                   d="M 0 180 Q 250 170 500 160 T 1000 165" 
                   fill="none" 
                   stroke="#22c55e" 
                   strokeWidth="3" 
                />
                <path 
                   d="M 0 180 Q 250 170 500 160 T 1000 165 L 1000 200 L 0 200 Z" 
                   fill="url(#green-gradient)" 
                   opacity="0.1"
                />

                <defs>
                   <linearGradient id="blue-gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                   <linearGradient id="green-gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                </defs>
             </svg>
           </div>
        </div>
      </div>
    </div>
  );
}
