import React, { useState, ChangeEvent, FormEvent } from "react";

interface JobFormState {
    jobTitle: string;
    companyName: string;
    industry: string;
    companySize: string;
    website: string;
    employmentType: "Full-Time" | "Part-Time" | "Internship";
    positionType: "Technical" | "Non-Technical";
    ctc: number;
    locations: string[];
    description: string;
    eligibleCourses: string[];
    eligibilityCriteria: string;
    selectionProcess: string;
    opensAt: string;
    closesAt: string;
}

const INITIAL_STATE: JobFormState = {
    jobTitle: "Multiple Jobs profiles, Back Office",
    companyName: "Karamtara Engineering Pvt Ltd",
    industry: "Manufacturing / Core",
    companySize: "501 - 2,000",
    website: "https://karamtara.com/",
    employmentType: "Full-Time",
    positionType: "Non-Technical",
    ctc: 216000,
    locations: ["Tarapur", "Nagpur"],
    description: "This is an excellent opportunity to join a reputed international manufacturing company that is looking for talented candidates across multiple functions...",
    eligibleCourses: ["B.B.A - CA", "B.Com", "M.Sc - Data Science"],
    eligibilityCriteria: "PG and UG Students",
    selectionProcess: "Personal Interview",
    opensAt: "2026-06-12T16:00",
    closesAt: "2026-06-15T10:00",
};

export const JobCreationForm: React.FC = () => {
    const [formData, setFormData] = useState<JobFormState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "ctc" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log("Submitting HeroUI Form Payload:", formData);
            await new Promise((resolve) => setTimeout(resolve, 800));
            alert("Job Profile successfully generated!");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-12 p-8 bg-background text-foreground rounded-2xl border border-default-200 shadow-xl transition-all">
            {/* Form Header */}
            <div className="flex flex-col gap-1 pb-6 mb-8 border-b border-default-100">
                <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Placement Job Configurator
                </h2>
                <p className="text-small text-default-500">
                    Provision structural schemas for immediate synchronization onto the university dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Corporate Profile */}
                <div className="space-y-4">
                    <h3 className="text-md font-semibold text-primary uppercase tracking-wider">
                        1. Corporate Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Company Identity</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Domain Classification</label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-100 border border-transparent rounded-xl text-small text-default-500 cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Resource URL</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Scale Metrics</label>
                            <input
                                type="text"
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-100 border border-transparent rounded-xl text-small text-default-500 cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Compensation Framework */}
                <div className="space-y-4">
                    <h3 className="text-md font-semibold text-primary uppercase tracking-wider">
                        2. Structural Offer Matrix
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2 flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Operational Target Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Engagement Type</label>
                            <select
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition cursor-pointer"
                            >
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Skill Tier Assignment</label>
                            <select
                                name="positionType"
                                value={formData.positionType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition cursor-pointer"
                            >
                                <option value="Non-Technical">Non-Technical Profile</option>
                                <option value="Technical">Technical Profile</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Cost to Company (Annual INR)</label>
                            <input
                                type="number"
                                name="ctc"
                                value={formData.ctc}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Evaluation Strategy</label>
                            <input
                                type="text"
                                name="selectionProcess"
                                value={formData.selectionProcess}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Descriptive & Operational Windows */}
                <div className="space-y-4">
                    <h3 className="text-md font-semibold text-primary uppercase tracking-wider">
                        3. Criteria & Operational Timelines
                    </h3>
                    <div className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-small font-medium text-default-700">Core Context Brief</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition leading-relaxed"
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-small font-medium text-default-700">Portal Initialization</label>
                                <input
                                    type="datetime-local"
                                    name="opensAt"
                                    value={formData.opensAt}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-small font-medium text-default-700">Portal Termination</label>
                                <input
                                    type="datetime-local"
                                    name="closesAt"
                                    value={formData.closesAt}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-default-50 border border-default-200 rounded-xl text-small focus:outline-none focus:border-primary transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Operations */}
                <div className="pt-6 border-t border-default-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary-600 transition-all active:scale-98 shadow-lg shadow-primary/20 ${isSubmitting ? "opacity-60 cursor-not-allowed scale-100" : ""
                            }`}
                    >
                        {isSubmitting ? "Saving Allocation Schema..." : "Publish Portal Offering"}
                    </button>
                </div>
            </form>
        </div>
    );
};  