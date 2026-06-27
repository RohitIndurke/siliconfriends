"use client";

import React, { useState } from "react";
import { updateStudentProfileAction } from "@/actions/student";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DEPARTMENTS } from "@/app/components/data";

interface CompleteProfileModalProps {
  initialData?: {
    rollNumber?: string;
    department?: string;
    cgpa?: number;
    skills?: string[];
  };
  onClose: () => void;
}

export const CompleteProfileModal = ({
  initialData,
  onClose,
}: CompleteProfileModalProps) => {
  const [rollNumber, setRollNumber] = useState(initialData?.rollNumber || "");
  const [department, setDepartment] = useState(initialData?.department || DEPARTMENTS[0]);
  const [cgpa, setCgpa] = useState(initialData?.cgpa ? String(initialData.cgpa) : "");
  const [skills, setSkills] = useState(initialData?.skills ? initialData.skills.join(", ") : "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      toast.error("Please enter a valid CGPA between 0 and 10.");
      setLoading(false);
      return;
    }

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await updateStudentProfileAction({
      rollNumber: rollNumber.trim(),
      department,
      cgpa: parsedCgpa,
      skills: skillsArray,
    });

    setLoading(false);

    if (res.success) {
      toast.success("Profile completed successfully!");
      router.refresh();
      onClose();
    } else {
      toast.error(res.error || "Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden relative p-6 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700 z-10"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1.5 pb-5 mb-5 border-b border-gray-100 pr-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
              !
            </div>
            <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Please enter your academic details so placement officers can verify your eligibility.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. CS2024001"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              CGPA <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 8.75"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Skills (Comma Separated) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Python, SQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
            />
            <span className="text-[11px] text-gray-400">Separate skills with a comma</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center shadow-md shadow-blue-500/20 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Save Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
