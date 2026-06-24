"use server";

import { db } from "@/db";
import { userResume } from "@/db/schema";
import { getTypedSession } from "@/lib/session";
import { desc, eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function getRecentResumes() {
  try {
    const session = await getTypedSession();
    if (!session?.user?.id) return [];

    const resumes = await db.select({
      id: userResume.id,
      fileName: userResume.fileName,
      createdAt: userResume.createdAt,
    }).from(userResume)
      .where(eq(userResume.userId, session.user.id))
      .orderBy(desc(userResume.createdAt))
      .limit(5);
    
    return resumes;
  } catch (err) {
    console.error("Failed to get recent resumes", err);
    return [];
  }
}

export async function deleteRecentResume(resumeId: string) {
  try {
    const session = await getTypedSession();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await db.delete(userResume)
      .where(
        and(
          eq(userResume.id, resumeId),
          eq(userResume.userId, session.user.id)
        )
      );
    
    return { success: true };
  } catch (err) {
    console.error("Failed to delete recent resume", err);
    return { error: "Failed to delete resume" };
  }
}

export async function parseResumeAndCompare(formData: FormData) {
  try {
    const file = formData.get("resume") as File | null;
    const resumeId = formData.get("resumeId") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file && !resumeId) {
      throw new Error("No resume provided");
    }

    if (!jobDescription) {
      throw new Error("No job description provided");
    }

    // Parse PDF text
    let resumeText = "";
    let fileName = "";
    if (file) {
      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.toLowerCase().endsWith(".pdf")) {
        resumeText = await new Promise<string>((resolve, reject) => {
          const PDFParser = require("pdf2json");
          const pdfParser = new PDFParser(null, 1);
          
          pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError?.message || "PDF parsing failed")));
          pdfParser.on("pdfParser_dataReady", () => {
              resolve(pdfParser.getRawTextContent());
          });
          
          pdfParser.parseBuffer(buffer);
        });
      } else {
        resumeText = buffer.toString("utf-8");
      }

      // Save to database
      const session = await getTypedSession();
      if (session?.user?.id) {
        // Check for exact duplicate
        const existingResume = await db.select().from(userResume).where(
          and(
            eq(userResume.userId, session.user.id),
            eq(userResume.fileName, fileName),
            eq(userResume.resumeText, resumeText)
          )
        ).get();

        if (existingResume) {
          // Move to top of recently used
          await db.update(userResume)
            .set({ createdAt: new Date(), updatedAt: new Date() })
            .where(eq(userResume.id, existingResume.id));
        } else {
          await db.insert(userResume).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            fileName: fileName,
            resumeText: resumeText,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } else if (resumeId) {
      const session = await getTypedSession();
      if (!session?.user?.id) {
        throw new Error("Unauthorized to access saved resume");
      }
      const existingResume = await db.select().from(userResume).where(eq(userResume.id, resumeId)).get();
      if (!existingResume || existingResume.userId !== session.user.id) {
        throw new Error("Resume not found");
      }
      resumeText = existingResume.resumeText;
      fileName = existingResume.fileName;
    }

    // Call OpenRouter API
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      throw new Error("OpenRouter API Key is not configured. Please add OPENROUTER_API_KEY to your environment variables.");
    }

    const openRouterModel = (process.env.OPENROUTER_AI_MODEL || "openrouter/free").trim();

    const prompt = `
Role: You are an expert ATS (Applicant Tracking System) Strategist and Professional Resume Writer. Your goal is to maximize the likelihood of a candidate's resume passing automated screenings and resonating with human recruiters.

Task: Analyze the provided "User Experience" against the target "Job Description" (JD) and rewrite the resume for maximum relevance and ATS compatibility.

Phase 1: Deep Keyword Analysis
Extract the top 10 "hard skills," "tools," and "industry-specific keywords" from the Target Job Description.
Identify the 3 most important "Job Requirements" (the core responsibilities the employer values most).

Phase 2: Semantic Rewriting (Mandatory Constraints)
Action + Metric: Every bullet point in the "Experience" section must follow this format: [Power Verb] + [The Task] + [The Result/Metric].
Example: "Engineered a scalable dashboard using Next.js, reducing load times by 40% and improving user retention."
Keyword Weaving: Naturally incorporate the keywords extracted in Phase 1 into the "Professional Summary" and "Experience" bullet points. Do not "stuff" keywords—they must sound professional and contextually relevant.
Reverse-Chronological & Standardized: Use only standard headers: "Professional Summary," "Skills," "Professional Experience," "Education," and "Projects."

Phase 3: ATS Score Validation
Check the drafted resume against the Target Job Description.
Explicitly state any "Missing High-Priority Skills" that the user should add to their resume to reach a 100% match.

Respond ONLY with a valid JSON object in the exact format below, with no markdown code blocks or extra text:
{
  "name": "Extracted full name",
  "email": "Extracted email address",
  "phone": "Extracted phone number or empty",
  "location": "Extracted location (City, State) or empty",
  "socials": "Extracted social URLs like LinkedIn, GitHub, Portfolio (comma separated, or empty if none)",
  "education": [
    {
      "institution": "Highest Degree Institution (e.g., University Name)",
      "degree": "Degree Name (e.g., B.Sc. Computer Science)",
      "duration": "YYYY - YYYY",
      "score": "CGPA/Percentage if available, else empty"
    },
    {
      "institution": "Previous Institution (e.g., High School/Junior College)",
      "degree": "HSC / SSC / Diploma",
      "duration": "YYYY",
      "score": "CGPA/Percentage if available"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "duration": "YYYY",
      "techStack": "Technologies used",
      "description": ["Bullet point 1", "Bullet point 2"]
    }
  ],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "YYYY - YYYY",
      "description": ["Bullet point 1", "Bullet point 2"]
    }
  ],
  "atsKeywordSummary": ["Keyword 1", "Keyword 2", "... up to 10"],
  "executiveSummary": "Professional Summary incorporating keywords (Max 4 lines).",
  "categorizedSkills": {
    "languages": ["lang1"],
    "frontend": ["f1"],
    "backend": ["b1"],
    "databases": ["d1"],
    "tools": ["t1"]
  },
  "activities": ["Activity or Achievement 1", "Activity 2"],
  "interests": ["Interest 1", "Interest 2"],
  "missingGapAnalysis": ["Missing High-Priority Skill 1", "Missing High-Priority Skill 2"]
}

Constraints:
NEVER use tables, columns, or graphical icons (these break ATS parsers).
NEVER use the placeholder [Quantifiable Metric]. Instead, infer a realistic quantifiable metric from context or write a strong, general impact statement.
Ensure you extract ALL education history provided in the resume (including SSC, HSC, Diplomas, Bachelor's, Master's, PhD) as separate objects in the education array.
Ensure the tone is authoritative and result-oriented.
Do not invent experience. If the user doesn't have a skill, identify the gap, do not fabricate it.

--- JOB DESCRIPTION ---
${jobDescription}

--- RESUME TEXT ---
${resumeText}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.BETTER_AUTH_URL || "http://localhost:3000",
        "X-Title": "Silicon Friends",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: [
          { role: "user", content: prompt }
        ],
        // Force JSON output if the model supports it, but since it's Gemma, we rely on the prompt instructing to output raw JSON
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(`OpenRouter Error: ${errorJson.error?.message || errorText}`);
      } catch (e) {
        throw new Error(`OpenRouter Error: ${errorText || "Failed to analyze resume"}`);
      }
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content || "{}";

    // Clean up potential markdown formatting from the response
    let cleanJsonText = resultText.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Extract just the JSON object from the text in case the model added conversational filler
    const firstBrace = cleanJsonText.indexOf('{');
    const lastBrace = cleanJsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      cleanJsonText = cleanJsonText.substring(firstBrace, lastBrace + 1);
    } else {
      throw new Error("Model failed to return a valid JSON format. It may have been interrupted or blocked. Please try generating again.");
    }

    return JSON.parse(cleanJsonText);
  } catch (error: any) {
    console.error("Error in parseResumeAndCompare:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
