"use server";

import { db } from "@/db";
import { interviewSession, userResume, job, interviewQuestionBank } from "@/db/schema";
import { getTypedSession } from "@/lib/session";
import { eq, and, desc, inArray, or } from "drizzle-orm";
import crypto from "crypto";

export type InterviewQuestion = {
  category: string;
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
  source: "resume" | "category" | "position";
};

export type GenerateInterviewResult =
  | { questions: InterviewQuestion[]; fromCache: boolean }
  | { error: string; questions?: InterviewQuestion[]; fromCache?: boolean };

const CATEGORY_TOPICS: Record<string, string> = {
  "Coding / DSA":
    "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, Sorting & Searching, Coding round problems",
  "Core CS":
    "Operating Systems (processes, threads, memory management), Database Management Systems (SQL, normalization, indexing, transactions), Computer Networks (TCP/IP, HTTP, DNS, OSI model), Object-Oriented Programming (SOLID, design patterns, inheritance, polymorphism)",
  "Development / Tech Stack":
    "React, Node.js, Python, Java, REST APIs, GraphQL, web frameworks, state management, authentication, testing",
  "System Design":
    "High-Level Design (HLD), Low-Level Design (LLD), scalability, load balancing, caching, databases at scale, Microservices architecture, event-driven systems",
  "DevOps / Cloud":
    "Docker, Kubernetes, CI/CD pipelines, AWS services (EC2, S3, Lambda, RDS), monitoring & alerting, infrastructure as code",
  Behavioral:
    "Teamwork & collaboration, leadership examples, conflict resolution, self-introduction, strengths & weaknesses, salary negotiation, career goals & motivation, situational questions (STAR format)",
};

export async function generateInterviewQuestions(
  formData: FormData
): Promise<GenerateInterviewResult> {
  try {
    const session = await getTypedSession();
    if (!session?.user?.id) {
      return { error: "You must be logged in to generate interview questions." };
    }
    const userId = session.user.id;

    const jobId = formData.get("jobId") as string;
    const categoriesRaw = formData.get("categories") as string;
    const resumeId = formData.get("resumeId") as string | null;
    const file = formData.get("resume") as File | null;
    const forceRegenerate = formData.get("forceRegenerate") === "true";

    if (!jobId) return { error: "No job selected." };
    if (!categoriesRaw) return { error: "No categories selected." };

    const categories: string[] = JSON.parse(categoriesRaw);
    if (categories.length === 0) return { error: "Select at least one question category." };

    // ── 1. Check DB cache ─────────────────────────────────────────────────────
    if (!forceRegenerate) {
      const existing = await db
        .select()
        .from(interviewSession)
        .where(
          and(
            eq(interviewSession.userId, userId),
            eq(interviewSession.jobId, jobId)
          )
        )
        .orderBy(desc(interviewSession.createdAt))
        .limit(1);

      if (existing.length > 0) {
        const cached = existing[0];
        const cachedCats = cached.categories as string[];
        const sameCategories =
          categories.length === cachedCats.length &&
          categories.every((c) => cachedCats.includes(c));

        if (sameCategories && (cached.questions as InterviewQuestion[]).length >= 30) {
          return {
            questions: cached.questions as InterviewQuestion[],
            fromCache: true,
          };
        }
      }
    }

    // ── 1.5. Rate Limit Check (15 minutes) ────────────────────────────────────
    const lastSession = await db
      .select({ createdAt: interviewSession.createdAt })
      .from(interviewSession)
      .where(eq(interviewSession.userId, userId))
      .orderBy(desc(interviewSession.createdAt))
      .limit(1);

    if (lastSession.length > 0) {
      const lastGenerationTime = new Date(lastSession[0].createdAt).getTime();
      const now = new Date().getTime();
      const diffMinutes = (now - lastGenerationTime) / (1000 * 60);

      if (diffMinutes < 1) {
        const remaining = Math.ceil(1 - diffMinutes);
        return { error: `Please wait ${remaining} minute${remaining > 1 ? 's' : ''} before generating new questions to prevent AI rate limiting.` };
      }
    }

    // ── 2. Load job details ───────────────────────────────────────────────────
    const jobRecord = await db
      .select()
      .from(job)
      .where(eq(job.id, jobId))
      .get();

    if (!jobRecord) return { error: "Selected job not found." };

    const jobDescription = `
Job Title: ${jobRecord.jobTitle}
Company: ${jobRecord.companyName}
Industry: ${jobRecord.industry}
Employment Type: ${jobRecord.employmentType}
Job Function: ${jobRecord.jobFunction}
Description: ${jobRecord.description}
Required Skills: ${jobRecord.requiredSkills}
Good-to-have Skills: ${jobRecord.goodToHaveSkills}
Selection Process: ${jobRecord.selectionProcess}
    `.trim();

    // ── 3. Load / parse resume ────────────────────────────────────────────────
    let resumeText = "";
    let fileName = "";

    if (file && file.size > 0) {
      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.toLowerCase().endsWith(".pdf")) {
        resumeText = await new Promise<string>((resolve, reject) => {
          const PDFParser = require("pdf2json");
          const pdfParser = new PDFParser(null, 1);
          pdfParser.on("pdfParser_dataError", (errData: any) =>
            reject(new Error(errData.parserError?.message || "PDF parsing failed"))
          );
          pdfParser.on("pdfParser_dataReady", () =>
            resolve(pdfParser.getRawTextContent())
          );
          pdfParser.parseBuffer(buffer);
        });
      } else {
        resumeText = buffer.toString("utf-8");
      }

      // Check for exact duplicate
      const existingResume = await db.select().from(userResume).where(
        and(
          eq(userResume.userId, userId),
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
        // Save new resume to userResume table
        await db.insert(userResume).values({
          id: crypto.randomUUID(),
          userId,
          fileName,
          resumeText,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } else if (resumeId) {
      const savedResume = await db
        .select()
        .from(userResume)
        .where(and(eq(userResume.id, resumeId), eq(userResume.userId, userId)))
        .get();

      if (!savedResume) return { error: "Saved resume not found." };
      resumeText = savedResume.resumeText;
      fileName = savedResume.fileName;
    }

    // ── 3.5. Retrieve unseen DB Questions ─────────────────────────────────────
    const pastSessions = await db.select({ questions: interviewSession.questions })
      .from(interviewSession)
      .where(eq(interviewSession.userId, userId));
    const seenQuestions = new Set<string>();
    pastSessions.forEach(s => {
      if (s.questions) {
        (s.questions as InterviewQuestion[]).forEach(q => seenQuestions.add(q.question));
      }
    });

    const poolQuestions = await db.select().from(interviewQuestionBank).where(
      or(
        inArray(interviewQuestionBank.category, categories),
        eq(interviewQuestionBank.jobId, jobId)
      )
    );
    const unseenPoolQuestions = poolQuestions.filter(q => !seenQuestions.has(q.question));
    const shuffledPool = unseenPoolQuestions.sort(() => 0.5 - Math.random());
    const selectedDbQuestions = shuffledPool.slice(0, 10).map(q => ({
      category: q.category,
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty as "Easy" | "Medium" | "Hard",
      source: q.source as "category" | "position"
    }));

    const deficit = 10 - selectedDbQuestions.length;
    const totalAiQuestions = 20 + deficit;

    // ── 4. Call OpenRouter AI ─────────────────────────────────────────────────
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return { error: "OpenRouter API key is not configured." };
    }
    const model = (process.env.OPENROUTER_AI_MODEL || "openrouter/free").trim();

    const selectedTopics = categories
      .map((cat) => `- ${cat}: ${CATEGORY_TOPICS[cat] || cat}`)
      .join("\n");

    const hasResume = resumeText.trim().length > 0;
    const resumeCount = hasResume ? 5 : 0;
    const positionCount = 2;
    const categoryCount = totalAiQuestions - resumeCount - positionCount;

    const prompt = `You are an expert technical interviewer with 15+ years of experience at top tech companies. Your task is to generate exactly ${totalAiQuestions} high-quality interview questions for a candidate.

=== TARGET JOB ===
${jobDescription}

=== CANDIDATE RESUME ===
${hasResume ? resumeText.substring(0, 4000) : "No resume provided — generate role-based questions only."}

=== SELECTED QUESTION CATEGORIES ===
${selectedTopics}

=== GENERATION RULES ===
You MUST generate exactly ${totalAiQuestions} questions distributed as follows:
1. SOURCE "resume": Generate exactly ${resumeCount} questions that directly reference specific items from the candidate's resume (their projects, technologies they listed, roles they held, or skills they mentioned). These should feel personalized and make the candidate reflect on their actual experience.
2. SOURCE "category": Generate exactly ${categoryCount} questions distributed across the selected categories above, weighted toward what the JD emphasizes most. Each selected category must have at least 1 question.
3. SOURCE "position": Generate exactly ${positionCount} questions that are highly specific to the job title/domain (e.g., for a web dev role: advanced React or API design questions; for a data role: ML pipelines or data modeling).

For difficulty:
- 30% Easy (fundamentals, definitions)
- 50% Medium (application, problem-solving)
- 20% Hard (design, optimization, edge cases)

For answers: provide detailed, structured model answers (3-6 sentences or bullet points) that a strong candidate would give. Include specific examples, terminology, and depth.

RESPOND ONLY with a valid JSON object in this exact format (no markdown, no code blocks, no extra text):
{
  "questions": [
    {
      "category": "exact category name from the list above, or 'Resume-Based' for resume questions, or 'Position-Specific' for position questions",
      "question": "The interview question text",
      "answer": "Detailed model answer",
      "difficulty": "Easy" or "Medium" or "Hard",
      "source": "resume" or "category" or "position"
    }
  ]
}`;

    let cachedFallback: InterviewQuestion[] | null = null;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.BETTER_AUTH_URL || "http://localhost:3000",
          "X-Title": "Silicon Friends",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errMsg = errText;
        try {
          errMsg = JSON.parse(errText)?.error?.message || errText;
        } catch { }
        throw new Error(`OpenRouter Error: ${errMsg}`);
      }

      const data = await response.json();
      let raw = data.choices?.[0]?.message?.content || "{}";

      // Strip markdown fences if model wraps in them
      raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const first = raw.indexOf("{");
      const last = raw.lastIndexOf("}");
      if (first === -1 || last === -1) {
        throw new Error("AI returned an invalid response format. Please try again.");
      }
      raw = raw.substring(first, last + 1);

      const parsed = JSON.parse(raw);
      let aiQuestions: InterviewQuestion[] = parsed.questions || [];

      if (aiQuestions.length === 0) {
        throw new Error("AI returned no questions. Please try again.");
      }

      // Add new non-resume questions to the global pool
      const newPoolQuestions = aiQuestions.filter(q => q.source !== "resume");
      if (newPoolQuestions.length > 0) {
        const bankInserts = newPoolQuestions.map(q => ({
          id: crypto.randomUUID(),
          jobId: q.source === "position" ? jobId : null,
          category: q.category,
          question: q.question,
          answer: q.answer,
          difficulty: q.difficulty,
          source: q.source,
          createdAt: new Date()
        }));
        await db.insert(interviewQuestionBank).values(bankInserts);
      }

      // Combine AI questions with selected DB questions
      const finalQuestions = [...aiQuestions, ...selectedDbQuestions];

      // ── 5. Save to DB ──────────────────────────────────────────────────────
      await db.insert(interviewSession).values({
        id: crypto.randomUUID(),
        userId,
        jobId,
        categories,
        questions: finalQuestions,
        createdAt: new Date(),
      });

      return { questions: finalQuestions, fromCache: false };
    } catch (aiError: any) {
      console.error("AI generation failed:", aiError);

      // Try to return any cached session as fallback
      const fallback = await db
        .select()
        .from(interviewSession)
        .where(
          and(
            eq(interviewSession.userId, userId),
            eq(interviewSession.jobId, jobId)
          )
        )
        .orderBy(desc(interviewSession.createdAt))
        .limit(1);

      if (fallback.length > 0) {
        cachedFallback = fallback[0].questions as InterviewQuestion[];
        return {
          questions: cachedFallback,
          fromCache: true,
          error: `AI is unavailable — showing your last saved questions. (${aiError.message})`,
        };
      }

      return { error: aiError.message || "Failed to generate questions." };
    }
  } catch (error: any) {
    console.error("generateInterviewQuestions error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function getInterviewSessions() {
  try {
    const session = await getTypedSession();
    if (!session?.user?.id) return [];

    const sessions = await db
      .select({
        id: interviewSession.id,
        jobId: interviewSession.jobId,
        categories: interviewSession.categories,
        questionCount: interviewSession.questions,
        createdAt: interviewSession.createdAt,
      })
      .from(interviewSession)
      .where(eq(interviewSession.userId, session.user.id))
      .orderBy(desc(interviewSession.createdAt))
      .limit(10);

    return sessions;
  } catch {
    return [];
  }
}

// Check rate limit quickly without triggering full generation
export async function checkInterviewRateLimit() {
  const session = await getTypedSession();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const lastSession = await db
    .select({ createdAt: interviewSession.createdAt })
    .from(interviewSession)
    .where(eq(interviewSession.userId, session.user.id))
    .orderBy(desc(interviewSession.createdAt))
    .limit(1);

  if (lastSession.length > 0) {
    const lastGenerationTime = new Date(lastSession[0].createdAt).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - lastGenerationTime) / (1000 * 60);

    if (diffMinutes < 15) {
      const remaining = Math.ceil(15 - diffMinutes);
      return { error: `Please wait ${remaining} minute${remaining > 1 ? 's' : ''} before generating new questions to prevent AI rate limiting.` };
    }
  }
  
  return { ok: true };
}
