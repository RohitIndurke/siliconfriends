const fs = require('fs');

const filePath = 'app/components/tabs/AiResumeBuilderTab.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update resumeData initial state
const new_initial_state = `const [resumeData, setResumeData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    location: "San Francisco, CA",
    socials: "github.com/johndoe, linkedin.com/in/johndoe",
    categorizedSkills: {
      languages: ["JavaScript", "TypeScript"],
      frontend: ["React", "Next.js", "Tailwind CSS"],
      backend: ["Node.js"],
      databases: ["MongoDB", "PostgreSQL"],
      tools: ["Git", "Docker"]
    },
    experience: [
      {
        title: "Frontend Developer",
        company: "TechCorp",
        duration: "2021 - Present",
        description: ["Built responsive UIs improving load time by 20%", "Collaborated with agile teams"]
      }
    ],
    projects: [
      {
        name: "Portfolio Website",
        duration: "2023",
        techStack: "Next.js, Tailwind",
        description: ["Developed personal portfolio with server components"]
      }
    ],
    education: [
      {
        institution: "University of Tech",
        degree: "B.S. in Computer Science",
        duration: "2018 - 2022",
        score: "GPA: 3.8/4.0"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services"
      }
    ],
    activities: ["Hackathon Winner 2022"],
    interests: ["Artificial Intelligence", "Open Source"],
    executiveSummary: "Detail-oriented software engineer with expertise in frontend paradigms. Proven track record in agile team environments building responsive applications.",
  });`;

content = content.replace(/const \[resumeData, setResumeData\] = useState\(\{[\s\S]*?executiveSummary:.*?\n  \}\);/, new_initial_state);

// 2. Update parse extraction function
const new_extraction = `setResumeData({
        name: result.name || "",
        email: result.email || "",
        phone: result.phone || "",
        location: result.location || "",
        socials: Array.isArray(result.socials) ? result.socials.join(', ') : (typeof result.socials === 'string' ? result.socials : ""),
        education: Array.isArray(result.education) ? result.education : [],
        certifications: Array.isArray(result.certifications) ? result.certifications : [],
        projects: Array.isArray(result.projects) ? result.projects : [],
        experience: Array.isArray(result.experience) ? result.experience : [],
        activities: Array.isArray(result.activities) ? result.activities : [],
        interests: Array.isArray(result.interests) ? result.interests : [],
        executiveSummary: result.executiveSummary || "",
        categorizedSkills: {
          languages: Array.isArray(result.categorizedSkills?.languages) ? result.categorizedSkills.languages : [],
          frontend: Array.isArray(result.categorizedSkills?.frontend) ? result.categorizedSkills.frontend : [],
          backend: Array.isArray(result.categorizedSkills?.backend) ? result.categorizedSkills.backend : [],
          databases: Array.isArray(result.categorizedSkills?.databases) ? result.categorizedSkills.databases : [],
          tools: Array.isArray(result.categorizedSkills?.tools) ? result.categorizedSkills.tools : [],
        },
      });`;

// Replace both occurrences of setResumeData in startParsing and handleUseRecentResume
content = content.replace(/setResumeData\(\{[\s\S]*?soft: Array\.isArray\(result\.categorizedSkills\?\.soft\).*?\n        \},\n      \}\);/g, new_extraction);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("State and extraction updated.");
