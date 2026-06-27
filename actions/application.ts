"use server";

import { db } from "@/db";
import { user, job, jobApplication } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getTypedSession } from "@/lib/session";

export async function applyToJobAction(jobId: string) {
  const session = await getTypedSession();
  if (!session || session.user.role !== "student") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if already applied
    const existing = await db
      .select()
      .from(jobApplication)
      .where(eq(jobApplication.userId, session.user.id));

    const alreadyApplied = existing.some((app) => app.jobId === jobId);
    if (alreadyApplied) {
      return { success: false, error: "You have already applied for this job." };
    }

    await db.insert(jobApplication).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      jobId: jobId,
      status: "Applied",
      appliedAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/profile");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error applying to job:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}

export async function getStudentApplicationsAction() {
  const session = await getTypedSession();
  if (!session) {
    return { success: false, data: [] };
  }

  try {
    const apps = await db
      .select({
        id: jobApplication.id,
        status: jobApplication.status,
        appliedAt: jobApplication.appliedAt,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
      })
      .from(jobApplication)
      .innerJoin(job, eq(jobApplication.jobId, job.id))
      .where(eq(jobApplication.userId, session.user.id))
      .orderBy(desc(jobApplication.appliedAt));

    return { success: true, data: apps };
  } catch (error) {
    console.error("Error fetching student applications:", error);
    return { success: false, data: [] };
  }
}

export async function getAdminDashboardDataAction() {
  const session = await getTypedSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, data: null };
  }

  try {
    const allStudents = await db.select().from(user).where(eq(user.role, "student"));
    const allJobs = await db.select().from(job);
    const allApps = await db
      .select({
        id: jobApplication.id,
        status: jobApplication.status,
        appliedAt: jobApplication.appliedAt,
        studentName: user.name,
        rollNumber: user.rollNumber,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
      })
      .from(jobApplication)
      .innerJoin(user, eq(jobApplication.userId, user.id))
      .innerJoin(job, eq(jobApplication.jobId, job.id))
      .orderBy(desc(jobApplication.appliedAt));

    const totalStudents = allStudents.length;
    const placedStudents = allStudents.filter((s) => s.placementStatus === "Placed").length;
    const activeJobs = allJobs.filter((j) => j.status !== "Closed").length;
    const uniqueCompanies = new Set(allJobs.map((j) => j.companyName)).size;

    return {
      success: true,
      data: {
        totalStudents,
        placedStudents,
        activeJobs,
        uniqueCompanies,
        recentApplications: allApps,
        studentsList: allStudents,
      },
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return { success: false, data: null };
  }
}
