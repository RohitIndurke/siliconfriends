import React from 'react';

interface StudentsTabProps {
  onAddStudent: () => void;
}

export default function StudentsTab({ onAddStudent }: StudentsTabProps) {
  const students = [
    { roll: "CS2021001", initials: "AS", name: "Arjun Sharma", email: "arjun.sharma@college.edu", dept: "Computer Science", cgpa: "8.7", cgpaColor: "text-green-600", skills: ["React", "Node.js"], extraSkills: "+1", status: "Placed", statusBg: "bg-green-100", statusText: "text-green-700" },
    { roll: "CS2021002", initials: "PP", name: "Priya Patel", email: "priya.patel@college.edu", dept: "Computer Science", cgpa: "9.1", cgpaColor: "text-green-600", skills: ["Java", "Spring Boot"], extraSkills: "+1", status: "Placed", statusBg: "bg-green-100", statusText: "text-green-700" },
    { roll: "EC2021003", initials: "RK", name: "Rahul Kumar", email: "rahul.kumar@college.edu", dept: "Electronics", cgpa: "7.8", cgpaColor: "text-blue-600", skills: ["Embedded C", "VLSI"], extraSkills: "+1", status: "Interviewing", statusBg: "bg-orange-100", statusText: "text-orange-700" },
    { roll: "CS2021004", initials: "SG", name: "Sneha Gupta", email: "sneha.gupta@college.edu", dept: "Computer Science", cgpa: "8.2", cgpaColor: "text-blue-600", skills: ["ML", "Python"], extraSkills: "+1", status: "Placed", statusBg: "bg-green-100", statusText: "text-green-700" },
    { roll: "ME2021005", initials: "VS", name: "Vikram Singh", email: "vikram.singh@college.edu", dept: "Mechanical", cgpa: "7.5", cgpaColor: "text-blue-600", skills: ["AutoCAD", "SolidWorks"], extraSkills: "+1", status: "Active", statusBg: "bg-blue-100", statusText: "text-blue-700" },
    { roll: "CS2021006", initials: "AR", name: "Ananya Reddy", email: "ananya.reddy@college.edu", dept: "Computer Science", cgpa: "9.4", cgpaColor: "text-green-600", skills: ["Full Stack", "DevOps"], extraSkills: "+1", status: "Placed", statusBg: "bg-green-100", statusText: "text-green-700" },
    { roll: "IT2021007", initials: "KM", name: "Karan Mehta", email: "karan.mehta@college.edu", dept: "Information Tech", cgpa: "8", cgpaColor: "text-blue-600", skills: ["Angular", "SQL"], extraSkills: "+1", status: "Active", statusBg: "bg-blue-100", statusText: "text-blue-700" },
    { roll: "CS2021008", initials: "DN", name: "Divya Nair", email: "divya.nair@college.edu", dept: "Computer Science", cgpa: "8.9", cgpaColor: "text-green-600", skills: ["Data Science", "R"], extraSkills: "+1", status: "Interviewing", statusBg: "bg-orange-100", statusText: "text-orange-700" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
          <p className="text-sm text-gray-500 mt-1">8 of 8 students</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button 
            onClick={onAddStudent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search by name or roll number..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4 sm:w-[400px]">
          <div className="relative flex-1">
            <select className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-gray-700 cursor-pointer">
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Electronics</option>
              <option>Mechanical</option>
              <option>Information Tech</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="relative flex-1">
            <select className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-gray-700 cursor-pointer">
              <option>All Statuses</option>
              <option>Placed</option>
              <option>Interviewing</option>
              <option>Active</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 md:hidden">
        {students.map((student, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 border border-blue-100">
                  {student.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{student.roll}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${student.statusBg} ${student.statusText}`}>
                {student.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <p className="text-gray-400 mb-0.5">Department</p>
                <p className="font-medium text-gray-700">{student.dept}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">CGPA</p>
                <p className={`font-bold ${student.cgpaColor}`}>{student.cgpa}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1">Email</p>
                <p className="text-gray-600 truncate">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill, j) => (
                  <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                    {skill}
                  </span>
                ))}
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                  {student.extraSkills}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 shrink-0 ml-2">
                <button className="hover:text-blue-600 transition-colors" title="View Details">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="hover:text-blue-600 transition-colors" title="Send Message">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Roll No.</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">CGPA</th>
                <th className="px-6 py-4 font-medium">Skills</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{student.roll}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 border border-blue-100">
                        {student.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{student.dept}</td>
                  <td className={`px-6 py-4 font-bold ${student.cgpaColor}`}>{student.cgpa}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map((skill, j) => (
                        <span key={j} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                          {skill}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                        {student.extraSkills}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${student.statusBg} ${student.statusText}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-blue-600 transition-colors" title="View Details">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="hover:text-blue-600 transition-colors" title="Send Message">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
