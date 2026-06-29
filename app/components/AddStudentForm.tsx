"use client";

import React, { useState } from "react";
import { adminCreateStudentAction } from "@/actions/application";
import * as XLSX from "xlsx";

interface BulkStudent {
  name: string;
  email: string;
}

export const AddStudentForm = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  // Single student state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passMode, setPassMode] = useState<"default" | "custom">("default");
  const [customPassword, setCustomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Bulk upload state
  const [bulkPassMode, setBulkPassMode] = useState<"default" | "custom">("default");
  const [bulkCustomPassword, setBulkCustomPassword] = useState("");
  const [showBulkPassword, setShowBulkPassword] = useState(false);
  const [bulkStudents, setBulkStudents] = useState<BulkStudent[]>([]);
  const [fileName, setFileName] = useState("");
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  // General UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle Single Student Submission
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalPassword = passMode === "default" ? "mitalandi" : customPassword;
    if (!finalPassword || finalPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const res = await adminCreateStudentAction({
      email: email.trim(),
      password: finalPassword,
      name: name.trim(),
    });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(res.error || "Failed to register student.");
      setLoading(false);
    }
  };

  // Handle Excel File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const parsed: BulkStudent[] = [];
        for (const row of json) {
          const rowName = row.Name || row.name || row["Full Name"] || row.fullname || "";
          const rowEmail = row.Email || row.email || row["Email Address"] || row.mail || "";

          if (rowName && rowEmail) {
            parsed.push({
              name: String(rowName).trim(),
              email: String(rowEmail).trim(),
            });
          }
        }

        if (parsed.length === 0) {
          setError("No valid student rows (requiring Name and Email columns) found in file.");
        } else {
          setBulkStudents(parsed);
        }
      } catch (err) {
        setError("Error parsing Excel sheet. Please ensure it is a valid .xlsx or .csv file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle Bulk Submission
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkStudents.length === 0) {
      setError("Please upload a valid Excel or CSV sheet containing student records.");
      return;
    }

    const finalPassword = bulkPassMode === "default" ? "mitalandi" : bulkCustomPassword;
    if (!finalPassword || finalPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setBulkProgress({ current: 0, total: bulkStudents.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < bulkStudents.length; i++) {
      const student = bulkStudents[i];

      try {
        const res = await adminCreateStudentAction({
          email: student.email,
          password: finalPassword,
          name: student.name,
        });
        if (res.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
      setBulkProgress({ current: i + 1, total: bulkStudents.length });
    }

    setLoading(false);
    if (successCount > 0) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(`Failed to register students. Please check if emails already exist.`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto p-6 bg-white text-gray-900 rounded-lg shadow-xl relative border border-gray-200 max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-gray-600 z-10"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Form Header */}
      <div className="flex flex-col gap-0.5 pb-4 mb-4 border-b border-gray-100 pr-8">
        <h2 className="text-lg font-bold tracking-tight text-blue-600">
          Add Student Accounts
        </h2>
        <p className="text-xs text-gray-500">
          Register students individually or import a batch list.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-md mb-4">
        <button
          type="button"
          onClick={() => { setActiveTab("single"); setError(""); }}
          className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === "single" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Single Student
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("bulk"); setError(""); }}
          className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === "bulk" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Upload Excel Sheet
        </button>
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-800">Registration Complete!</h3>
          <p className="text-xs text-gray-500 mt-1">Closing modal window...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 text-red-600 p-2.5 rounded-md text-xs border border-red-200 mb-3 text-center font-medium">
              {error}
            </div>
          )}

          {/* SINGLE STUDENT FORM */}
          {activeTab === "single" ? (
            <form onSubmit={handleSingleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow"
                />
              </div>

              {/* Password Selection */}
              <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-700">Password Option</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="passMode"
                      checked={passMode === "default"}
                      onChange={() => setPassMode("default")}
                      className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    Default (<code className="bg-gray-100 px-1 py-0.5 rounded text-[11px] text-blue-600 font-mono">mitalandi</code>)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="passMode"
                      checked={passMode === "custom"}
                      onChange={() => setPassMode("custom")}
                      className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    Custom Password
                  </label>
                </div>

                {passMode === "custom" && (
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter custom password..."
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pr-9 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-colors text-xs flex items-center justify-center shadow-sm ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Registering..." : "Add Student"}
              </button>
            </form>
          ) : (
            /* BULK IMPORT FORM */
            <form onSubmit={handleBulkSubmit} className="flex flex-col gap-3.5">
              {/* Excel Upload */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Select Excel or CSV Spreadsheet (.xlsx / .csv)
                </label>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-md p-4 bg-gray-50 cursor-pointer transition-colors text-center">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6B7280" className="mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[240px]">
                    {fileName ? fileName : "Click to select or drag .xlsx / .csv file"}
                  </span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {bulkStudents.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-md p-2 text-xs text-blue-800 flex items-center justify-between font-medium">
                  <span>Detected Students:</span>
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold">{bulkStudents.length}</span>
                </div>
              )}

              {/* Bulk Password Option */}
              <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-700">Password Option</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="bulkPassMode"
                      checked={bulkPassMode === "default"}
                      onChange={() => setBulkPassMode("default")}
                      className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    Default (<code className="bg-gray-100 px-1 py-0.5 rounded text-[11px] text-blue-600 font-mono">mitalandi</code>)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="bulkPassMode"
                      checked={bulkPassMode === "custom"}
                      onChange={() => setBulkPassMode("custom")}
                      className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    Custom Password
                  </label>
                </div>

                {bulkPassMode === "custom" && (
                  <div className="relative mt-1">
                    <input
                      type={showBulkPassword ? "text" : "password"}
                      placeholder="Enter custom password for all students..."
                      value={bulkCustomPassword}
                      onChange={(e) => setBulkCustomPassword(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pr-9 text-xs text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBulkPassword(!showBulkPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {loading && bulkProgress.total > 0 && (
                <div className="flex flex-col gap-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Registering accounts...</span>
                    <span>{bulkProgress.current} / {bulkProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || bulkStudents.length === 0}
                className={`mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition-colors text-xs flex items-center justify-center shadow-sm ${
                  loading || bulkStudents.length === 0 ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing Bulk Import..." : `Register ${bulkStudents.length || ""} Students`}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
