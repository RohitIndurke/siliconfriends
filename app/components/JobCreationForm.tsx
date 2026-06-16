import React, { useState, ChangeEvent, FormEvent } from "react";

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
    jobTitle: "Business Development Trainee (BDT)",
    employmentType: "Internship",
    positionType: "Non-Technical",
    location: "Hyderabad",
    duration: "3 Months",
    jobFunction: "Non Technical",

    companyName: "SEOAK Innovations Pvt. Ltd.",
    companyLogo: "SI",
    industry: "EdTech / IT Training",
    foundedYear: 2023,
    website: "https://www.seoak.in",
    contactPerson: "Nishant V. Kasare",
    organizationSize: "51 - 200",
    baseLocation: "Warangal, Telangana",

    stipendMonthly: 15000,
    maxIncentivesMonthly: 10000,
    eligibleForFte: true,
    ctcFixedLpa: 6.0,
    ctcVariableLpa: 2.0,

    requiredSkills: "Business Development, Communications",
    goodToHaveSkills: "Business Acumen, Communication Skills",

    description: "Business development and client engagement. Excellent Communication Skill is required.",
    otherDetails: "Business Development Trainee (BDT) / Business Development Associate (BDA)",

    eligibilitySummary: "All Interested U.G AND P.G.",
    eligibleCourses: ["B.Sc. - Cyber & Digital Science", "B.Sc. - Computer Science", "B.Com. - Commerce"],
    selectionProcess: "Telephonic Round 1, Telephonic Round 2",

    status: "Eligible / Open",
    onCampus: true,
    opensAt: "2026-06-16T09:00",
    closesAt: "2026-06-19T10:00",
    externalApplyLink: "https://forms.gle/hSZj66CVGxmWB8uQ6",
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
}

export const JobCreationForm: React.FC<JobCreationFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<JobFormState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showToast, setShowToast] = useState(false);

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
            await new Promise((resolve) => setTimeout(resolve, 800));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3500);
            if (onClose) onClose();
        } catch (error) {
            console.error(error);
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
        <div className="w-full max-w-4xl mx-auto my-auto p-8 bg-white text-gray-900 rounded-2xl shadow-2xl transition-all relative max-h-[90vh] overflow-y-auto no-scrollbar">
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
                <h2 className="text-2xl font-bold tracking-tight text-purple-700">
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
                            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Employment Type</label>
                            <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition cursor-pointer">
                                <option value="Internship">Internship</option>
                                <option value="Placement">Placement</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Position Type</label>
                            <select name="positionType" value={formData.positionType} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition cursor-pointer">
                                <option value="Technical">Technical</option>
                                <option value="Non-Technical">Non-Technical</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. Hyderabad" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Duration</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. 3 Months" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">Job Function(s)</label>
                            <input type="text" name="jobFunction" value={formData.jobFunction} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. Non Technical" />
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
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Company Logo (Text Initials)</label>
                            <input type="text" name="companyLogo" value={formData.companyLogo} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. SI" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Industry</label>
                            <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. EdTech" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Founded Year</label>
                            <input type="number" name="foundedYear" value={formData.foundedYear} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Organization Size</label>
                            <input type="text" name="organizationSize" value={formData.organizationSize} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. 51-200" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Base Location</label>
                            <input type="text" name="baseLocation" value={formData.baseLocation} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">Website</label>
                            <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">Contact Person</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
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
                            <input type="number" name="stipendMonthly" value={formData.stipendMonthly} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Max Incentives Monthly (INR)</label>
                            <input type="number" name="maxIncentivesMonthly" value={formData.maxIncentivesMonthly} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="checkbox" name="eligibleForFte" checked={formData.eligibleForFte} onChange={handleInputChange} className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500" />
                                Eligible for FTE (Post-Conversion)
                            </label>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">CTC Fixed (LPA)</label>
                            <input type="number" step="0.1" name="ctcFixedLpa" value={formData.ctcFixedLpa} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">CTC Variable (LPA)</label>
                            <input type="number" step="0.1" name="ctcVariableLpa" value={formData.ctcVariableLpa} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
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
                            <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Good To Have Skills (Comma separated)</label>
                            <input type="text" name="goodToHaveSkills" value={formData.goodToHaveSkills} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
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
                            <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition leading-relaxed" required></textarea>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Other Details</label>
                            <textarea name="otherDetails" rows={3} value={formData.otherDetails} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition leading-relaxed"></textarea>
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
                            <input type="text" name="eligibilitySummary" value={formData.eligibilitySummary} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. All Interested U.G AND P.G." />
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
                            <input type="text" name="selectionProcess" value={formData.selectionProcess} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
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
                            <input type="text" name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" placeholder="e.g. Eligible / Open" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="checkbox" name="onCampus" checked={formData.onCampus} onChange={handleInputChange} className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500" />
                                On Campus Drive
                            </label>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Opens At</label>
                            <input type="datetime-local" name="opensAt" value={formData.opensAt} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600">Closes At</label>
                            <input type="datetime-local" name="closesAt" value={formData.closesAt} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600">External Apply Link</label>
                            <input type="url" name="externalApplyLink" value={formData.externalApplyLink} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 transition" />
                        </div>
                    </div>
                </div>

                {/* Form Operations */}
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 rounded-lg font-bold text-white bg-purple-700 hover:bg-purple-800 transition-all shadow-md ${isSubmitting ? "opacity-60 cursor-not-allowed scale-100" : ""
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