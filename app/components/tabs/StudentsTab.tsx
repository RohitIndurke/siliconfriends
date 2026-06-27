import React, { useState } from 'react';
import { DEPARTMENTS } from '@/app/components/data';

interface StudentsTabProps {
  students: any[];
  onAddStudent: () => void;
}

export default function StudentsTab({ students = [], onAddStudent }: StudentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const formattedStudents = students.map((s) => {
    const initials = s.name
      ? s.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
      : "ST";

    const status = s.placementStatus || "Active";
    let statusBg = "bg-blue-100";
    let statusText = "text-blue-700";
    if (status === "Placed") {
      statusBg = "bg-green-100";
      statusText = "text-green-700";
    } else if (status === "Interviewing") {
      statusBg = "bg-orange-100";
      statusText = "text-orange-700";
    }

    const skillsList = Array.isArray(s.skills) ? s.skills : [];

    return {
      id: s.id,
      roll: s.rollNumber || "Pending",
      initials,
      name: s.name || "Unknown Student",
      email: s.email,
      dept: s.department || "Unassigned",
      cgpa: s.cgpa !== null && s.cgpa !== undefined ? String(s.cgpa) : "-",
      cgpaColor: s.cgpa >= 8.5 ? "text-green-600" : "text-blue-600",
      skills: skillsList.slice(0, 3),
      extraSkills: skillsList.length > 3 ? `+${skillsList.length - 3}` : null,
      status,
      statusBg,
      statusText,
    };
  });

  const filteredStudents = formattedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDept === "All Departments" || student.dept === selectedDept;

    const matchesStatus =
      selectedStatus === "All Statuses" || student.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredStudents.length} of {students.length} students</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4 sm:w-[400px]">
          <div className="relative flex-1">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-gray-700 cursor-pointer"
            >
              <option>All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="relative flex-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-gray-700 cursor-pointer"
            >
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

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-200 text-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" className="mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-base font-bold text-gray-700">No students found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredStudents.map((student, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
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
                    {student.skills.map((skill: string, j: number) => (
                      <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                        {skill}
                      </span>
                    ))}
                    {student.extraSkills && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                        {student.extraSkills}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.map((student, i) => (
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
                          {student.skills.map((skill: string, j: number) => (
                            <span key={j} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                              {skill}
                            </span>
                          ))}
                          {student.extraSkills && (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                              {student.extraSkills}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${student.statusBg} ${student.statusText}`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
