import React, { useState, ChangeEvent, FormEvent } from "react";
import { createJobAction } from "@/actions/job";
import { useRouter } from "next/navigation";

interface JobFormState {
    jobTitle: string;
    employmentType: string;
    positionType: string;
    location: string;
    duration: string;
    jobFunction: string;

    companyName: string;
    companyLogo: string;
    industry: string;
    foundedYear: number | "";
    website: string;
    contactPerson: string;
    organizationSize: string;
    baseLocation: string;

    stipendMonthly: number | "";
    maxIncentivesMonthly: number | "";
    eligibleForFte: boolean;
    ctcFixedLpa: number | "";
    ctcVariableLpa: number | "";

    requiredSkills: string;
    goodToHaveSkills: string;

    description: string;
    otherDetails: string;

    eligibilitySummary: string;
    eligibleCourses: string[];
    selectionProcess: string;

    status: string;
    onCampus: boolean;
    opensAt: string;
    closesAt: string;
    externalApplyLink: string;
}

const INITIAL_STATE: JobFormState = {
    jobTitle: "",
    employmentType: "Internship",
    positionType: "Non-Technical",
    location: "",
    duration: "2 Months",
    jobFunction: "",

    companyName: "",
    companyLogo: "",
    industry: "",
    foundedYear: "",
    website: "",
    contactPerson: "",
    organizationSize: "",
    baseLocation: "",

    stipendMonthly: "",
    maxIncentivesMonthly: "",
    eligibleForFte: true,
    ctcFixedLpa: "",
    ctcVariableLpa: "",

    requiredSkills: "",
    goodToHaveSkills: "",

    description: "",
    otherDetails: "",

    eligibilitySummary: "",
    eligibleCourses: [],
    selectionProcess: "",

    status: "Eligible / Open",
    onCampus: true,
    opensAt: "",
    closesAt: "",
    externalApplyLink: "",
};

const ALL_COURSES = [
    "B.Sc. - Cyber & Digital Science",
    "B.Sc. - Animation",
    "B.Sc. - Computer Science",
    "M.Com. - Commerce",
    "B.Com. - Commerce",
    "B.B.A. - International Business",
    "B.B.A. - Business Administration",
    "M.Sc. - Computer Application",
    "B.C.A. - Science",
    "B.B.A. - Computer Applications",
    "B.Sc. - Information Technology",
    "M.Sc. - Cyber Security",
    "B.Sc. - Artificial Intelligence & Machine Learning",
    "B.Sc. - Data Science",
    "M.Sc. - Information Technology",
    "M.Sc. - Industrial Mathematics with Computer Applications",
    "M.Sc. - Computer Science"
];

export interface JobCreationFormProps {
    onClose?: () => void;
    userId: string;
}

export const JobCreationForm: React.FC<JobCreationFormProps> = ({ onClose, userId }) => {
    const [formData, setFormData] = useState<JobFormState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();

    const toggleCourse = (course: string) => {
        setFormData((prev) => {
            const current = prev.eligibleCourses;
            if (current.includes(course)) {
                return { ...prev, eligibleCourses: current.filter((c) => c !== course) };
            } else {
                return { ...prev, eligibleCourses: [...current, course] };
            }
        });
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log("Submitting Full Job Payload:", formData);
            
            const result = await createJobAction(formData, userId);
            
            if (result.success) {
                setShowToast(true);
                router.refresh(); // Refresh the page to fetch the new data
                
                setTimeout(() => {
                    setShowToast(false);
                    if (onClose) onClose();
                }, 1500);
            } else {
                alert("Failed to create job: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        {/* Success Toast */}
        {showToast && (
            <div style={{ position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 99999 }}
                className="flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce-in">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-sm">Job Profile successfully created!</span>
            </div>
        )}
        <div className="w-full max-w-4xl mx-auto my-auto p-5 sm:p-8 bg-white text-gray-900 rounded-2xl shadow-2xl transition-all relative max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Close Button */}
            {onClose && (
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700 z-10"
                >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            
            {/* Form Header */}
            <div className="flex flex-col gap-1 pb-6 mb-8 border-b border-gray-100 pr-10">
                <h2 className="text-2xl font-bold tracking-tight text-blue-600">
                    Create Opportunity Profile
                </h2>
                <p className="text-sm text-gray-500">
                    Configure all details regarding the new job posting.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* 1. Basic Details */}
                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        1. Basic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">Job Title</label>
                            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Employment Type</label>
                            <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition cursor-pointer">
                                <option value="Internship">Internship</option>
                                <option value="Placement">Placement</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Position Type</label>
                            <select name="positionType" value={formData.positionType} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition cursor-pointer">
                                <option value="Technical">Technical</option>
                                <option value="Non-Technical">Non-Technical</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="e.g. Hyderabad" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Duration</label>
                            <select name="duration" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition cursor-pointer">
                                <option value="2 Months">2 Months</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                                <option value="12 Months">12 Months</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">Job Function(s)</label>
                            <input type="text" name="jobFunction" value={formData.jobFunction} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="e.g. Non Technical" />
                        </div>
                    </div>
                </div>

                {/* 2. Company Details */}
                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        2. Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Company Name</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Company Logo (Text Initials)</label>
                            <input type="text" name="companyLogo" value={formData.companyLogo} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="e.g. SI" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Industry</label>
                            <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="e.g. EdTech" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Founded Year</label>
                            <input type="number" name="foundedYear" value={formData.foundedYear} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Organization Size</label>
                            <input type="text" name="organizationSize" value={formData.organizationSize} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="e.g. 51-200" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Base Location</label>
                            <input type="text" name="baseLocation" value={formData.baseLocation} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">Website</label>
                            <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">Contact Person</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                    </div>
                </div>

                {/* 3. Compensation & Perks */}
                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        3. Compensation & Perks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Stipend Monthly (INR)</label>
                            <input type="number" name="stipendMonthly" value={formData.stipendMonthly} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Max Incentives Monthly (INR)</label>
                            <input type="number" name="maxIncentivesMonthly" value={formData.maxIncentivesMonthly} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="checkbox" name="eligibleForFte" checked={formData.eligibleForFte} onChange={handleInputChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                Eligible for FTE (Post-Conversion)
                            </label>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">CTC Fixed (LPA)</label>
                            <input type="number" step="0.1" name="ctcFixedLpa" value={formData.ctcFixedLpa} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">CTC Variable (LPA)</label>
                            <input type="number" step="0.1" name="ctcVariableLpa" value={formData.ctcVariableLpa} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                    </div>
                </div>

                {/* 4. Skills & Requirements */}
                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        4. Skills & Requirements
                    </h3>
                    <div className="grid grid-cols-1 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Required Skills (Comma separated)</label>
                            <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Good To Have Skills (Comma separated)</label>
                            <input type="text" name="goodToHaveSkills" value={formData.goodToHaveSkills} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                    </div>
                </div>

                {/* 5. Descriptions */}
                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        5. Descriptions & Details
                    </h3>
                    <div className="grid grid-cols-1 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Main Description</label>
                            <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition leading-relaxed" required></textarea>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Other Details</label>
                            <textarea name="otherDetails" rows={3} value={formData.otherDetails} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition leading-relaxed"></textarea>
                        </div>
                    </div>
                </div>

                {/* 6. Eligibility & Selection */}
                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        6. Eligibility & Selection Process
                    </h3>
                    <div className="grid grid-cols-1 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Eligibility Summary</label>
                            <input type="text" name="eligibilitySummary" value={formData.eligibilitySummary} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="e.g. All Interested U.G AND P.G." />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Eligible Courses (Select all that apply)</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {ALL_COURSES.map(course => {
                                    const isSelected = formData.eligibleCourses.includes(course);
                                    return (
                                        <button
                                            key={course}
                                            type="button"
                                            onClick={() => toggleCourse(course)}
                                            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
                                                isSelected 
                                                ? 'bg-green-100 text-green-800 border-green-200' 
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            {course}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Selection Process (Comma separated stages)</label>
                            <input type="text" name="selectionProcess" value={formData.selectionProcess} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                    </div>
                </div>

                {/* 7. Registration Details */}
                <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                        7. Registration Timelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Status</label>
                            <input type="text" name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="e.g. Eligible / Open" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="checkbox" name="onCampus" checked={formData.onCampus} onChange={handleInputChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                On Campus Drive
                            </label>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Opens At</label>
                            <input type="datetime-local" name="opensAt" value={formData.opensAt} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Closes At</label>
                            <input type="datetime-local" name="closesAt" value={formData.closesAt} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">External Apply Link</label>
                            <input type="url" name="externalApplyLink" value={formData.externalApplyLink} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
                        </div>
                    </div>
                </div>

                {/* Form Operations */}
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md ${isSubmitting ? "opacity-60 cursor-not-allowed scale-100" : ""
                            }`}
                    >
                        {isSubmitting ? "Saving Opportunity..." : "Publish Opportunity"}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};  