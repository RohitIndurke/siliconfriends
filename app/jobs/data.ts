export type Job = {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  postedAgo: string;
  eligible: boolean;
  onCampus: boolean;
  jobType: string;
  positionType: string;
  industry: string;
  salary: string;
  salaryLabel: string;
  locations: string[];
  jobFunction: string;
  registrationClosed: string;
  registrationOpens: string;
  registrationCloses: string;
  registrationDetails: string;
  description: string;
  otherDetails: string;
  otherBenefits: string;
  bondDetails: string;
  eligibleCourses: string[];
  eligibilityCriteria: string;
  selectionProcess: string;
  aboutOrganisation: string;
  website: string;
  organisationSize: string;
  contactPerson: string;
};
export const generateJobSlug = (company: string, title: string) => {
  const combined = `${company}-${title}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};


export const JOBS: Job[] = [
  {
    id: 1,
    title: "Multiple Jobs profiles , Back Office",
    company: "Karamtara Engineering Pvt Ltd",
    companyLogo: "IK",
    postedAgo: "4 days ago",
    eligible: true,
    onCampus: true,
    jobType: "Full Time",
    positionType: "Non Technical",
    industry: "Manufacturing / Core",
    salary: "INR 2,16,000",
    salaryLabel: "Cost to Company",
    locations: ["Tarapur", "Nagpur"],
    jobFunction: "",
    registrationClosed: "Registrations closed on 15 Jun, 2026 – 10:00 AM",
    registrationOpens: "Opens: 04:00 PM, 12-Jun-2026",
    registrationCloses: "Closes: 10:00 AM, 15-Jun-2026",
    registrationDetails: "Apply on POD",
    description:
      "This is an excellent opportunity to join a reputed international manufacturing company that is looking for talented candidates across multiple functions. The company has openings in departments including Production, Quality Control (QC), Quality Assurance (QA), Maintenance, Supply Chain & Logistics, Procurement, Engineering, Research & Development (R&D), Environment, Health & Safety (EHS), Human Resources (HR), Finance & Accounts, Sales & Marketing, and Information Technology (IT). These roles offer valuable exposure to global industry standards, professional growth, and long-term career opportunities. Interested candidates are encouraged to review the job descriptions and apply for the positions that best match their qualifications and career goals.",
    otherDetails:
      "Please review the company's profile carefully before applying. The company may offer you a role based on the skills, qualities, and potential they assess during the interview process. Therefore, candidates should be open to different job opportunities that align with their capabilities and the organization's requirements.",
    otherBenefits:
      "Company-provided accommodation + Company-provided vehicle for to & fro usage (between Factory & Hostel) – during the probation period of one year from the date of joining (fooding will be at the students' expense).\n\nOpportunity to work in foreign countries as well! Candidates who perform exceptionally well may be considered for opportunities at the company's overseas offices, gaining valuable international exposure and career growth.",
    bondDetails: "N/A",
    eligibleCourses: [
      "M.Sc. – Data Science",
      "M.Sc. – Industrial Mathematics with Computer Applications",
      "B.Com. – Commerce",
      "B.B.A. – International Business",
      "B.B.A. – Business Administration",
      "B.B.A. – Computer Applications",
    ],
    eligibilityCriteria: "PG and UG Students",
    selectionProcess: "Personal Interview",
    aboutOrganisation:
      "Founded in 1996 and commencing operations in 1998, when we were initially engaged in manufacturing transmission line towers, we have adapted to market demands and diversified into the solar sector with further plans to foray into newer segments like EV charging infrastructure, green hydrogen, and data centers.",
    website: "https://karamtara.com/",
    organisationSize: "501 – 2,000",
    contactPerson: "Mr. Ankit Sharma Asst. TPO & Dr. Mangesh Bhople",
  },
  {
    id: 2,
    title: "Salesforce Developer Intern",
    company: "Cloudy Wave Technology Pvt. Ltd",
    companyLogo: "CW",
    postedAgo: "12 days ago",
    eligible: true,
    onCampus: false,
    jobType: "Internship",
    positionType: "Technical",
    industry: "IT / ITES",
    salary: "INR 5,000",
    salaryLabel: "Stipend (INR Per Month)",
    locations: ["Pune, Maharashtra, India"],
    jobFunction: "IT",
    registrationClosed: "Registrations closed on 05 Jun, 2026 – 09:00 AM",
    registrationOpens: "Opens: 10:00 AM, 01-Jun-2026",
    registrationCloses: "Closes: 09:00 AM, 05-Jun-2026",
    registrationDetails: "Apply on POD",
    description:
      "We are looking for a passionate Salesforce Developer Intern to join our team. You will work on real-world Salesforce projects, gaining hands-on experience with Apex, Lightning Web Components, and Salesforce administration. This is a great opportunity for students who want to build their career in the Salesforce ecosystem.",
    otherDetails:
      "This is a non-technical job opportunity. Technical students who wish to apply are requested to read the Job Description (JD) carefully before submitting their application. Once you apply, you will be considered interested in the role, and opting out later may not be possible. Please apply only if the job profile aligns with your career interests.",
    otherBenefits: "Certificate of completion and potential full-time offer based on performance.",
    bondDetails: "N/A",
    eligibleCourses: [
      "B.Sc. – Computer Science",
      "B.B.A. – Computer Applications",
      "M.Sc. – Data Science",
    ],
    eligibilityCriteria: "UG and PG Students with basic programming knowledge",
    selectionProcess: "Online Assessment + Technical Interview",
    aboutOrganisation:
      "Cloudy Wave Technology is a leading Salesforce consulting partner based in Pune, specializing in CRM solutions, cloud implementations, and digital transformation for businesses across various industries.",
    website: "https://cloudywave.com/",
    organisationSize: "51 – 200",
    contactPerson: "Mr. Ankit Sharma Asst. TPO",
  },
];

export const POPULAR_TAGS = [
  "It / Computers - Software",
  "Technology",
  "It",
  "Technical",
  "It / Ites",
  "Information Technology",
  "E-Learning / Edtech",
  "Non Technical",
  "Advertising / Events",
  "Communication Skills",
];
