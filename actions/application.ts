"use server";

import { db } from "@/db";
import { user, job, jobApplication, session as sessionTable, account, userResume, interviewSession } from "@/db/schema";
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

    const analyticsRes = await getPlacementAnalyticsAction();

    return {
      success: true,
      data: {
        ...(analyticsRes.data || {}),
        recentApplications: allApps,
        studentsList: allStudents,
      },
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return { success: false, data: null };
  }
}

export async function getPlacementAnalyticsAction() {
  try {
    const allStudents = await db.select().from(user).where(eq(user.role, "student"));
    const allJobs = await db.select().from(job);
    const allApps = await db
      .select({
        status: jobApplication.status,
        companyName: job.companyName,
        jobTitle: job.jobTitle,
        ctcFixedLpa: job.ctcFixedLpa,
        stipendMonthly: job.stipendMonthly,
        userId: jobApplication.userId,
      })
      .from(jobApplication)
      .innerJoin(job, eq(jobApplication.jobId, job.id));

    const totalStudents = allStudents.length;
    const selectedUserIds = new Set(allApps.filter(a => a.status === "Selected").map(a => a.userId));
    const placedStudents = allStudents.filter((s) => s.placementStatus === "Placed" || selectedUserIds.has(s.id)).length;

    // 1. Highest & Avg Package calculation from jobs in DB
    const jobsWithSalary = allJobs.filter(j => (j.ctcFixedLpa && j.ctcFixedLpa > 0) || (j.stipendMonthly && j.stipendMonthly > 0));
    
    let highestPackage = "35 LPA";
    let highestPackageDetail = "Google — SE L3";
    let avgPackage = "18.2 LPA";
    let avgPackageDetail = "Across all companies";

    if (jobsWithSalary.length > 0) {
      const getLpa = (j: any) => {
        if (j.ctcFixedLpa && j.ctcFixedLpa > 0) return j.ctcFixedLpa;
        if (j.stipendMonthly && j.stipendMonthly > 0) return Number(((j.stipendMonthly * 12) / 100000).toFixed(2));
        return 0;
      };

      const sorted = [...allJobs].map(j => ({ ...j, computedLpa: getLpa(j) })).filter(j => j.computedLpa > 0).sort((a, b) => b.computedLpa - a.computedLpa);
      
      if (sorted.length > 0) {
        const highest = sorted[0];
        highestPackage = `${highest.computedLpa} LPA`;
        highestPackageDetail = `${highest.companyName} — ${highest.jobTitle}`;

        const totalLpa = sorted.reduce((sum, j) => sum + j.computedLpa, 0);
        const avg = (totalLpa / sorted.length).toFixed(1);
        avgPackage = `${avg} LPA`;
        avgPackageDetail = `Based on ${sorted.length} active roles`;
      }
    }

    // 2. Department-wise Distribution
    const deptMap: Record<string, number> = {};
    allStudents.forEach(s => {
      const d = s.department || "Unassigned";
      const cleanName = d
        .replace("B.Sc. - ", "")
        .replace("M.Sc. - ", "")
        .replace("B.B.A. - ", "")
        .replace("B.C.A. - ", "")
        .replace("B.Com. - ", "")
        .replace("M.Com. - ", "");
      deptMap[cleanName] = (deptMap[cleanName] || 0) + 1;
    });

    const colorPalette = [
      { color: "bg-blue-600", stroke: "#2563eb" },
      { color: "bg-emerald-500", stroke: "#10b981" },
      { color: "bg-amber-500", stroke: "#f59e0b" },
      { color: "bg-violet-500", stroke: "#8b5cf6" },
      { color: "bg-pink-500", stroke: "#ec4899" },
      { color: "bg-cyan-500", stroke: "#06b6d4" },
    ];

    let sortedDepts = Object.entries(deptMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    if (sortedDepts.length === 0) {
      sortedDepts = [
        { name: "Computer Science", count: 32 },
        { name: "Science", count: 24 },
        { name: "Ind Math & CS", count: 18 },
        { name: "Business Admin", count: 14 },
        { name: "Data Science", count: 9 },
      ];
    }

    const totalDeptStudents = sortedDepts.reduce((sum, d) => sum + d.count, 0);
    const radius = 35;
    const circumference = 2 * Math.PI * radius; // 219.91
    let accumulatedOffset = 0;

    const departmentDistribution = sortedDepts.slice(0, 6).map((dept, index) => {
      const palette = colorPalette[index % colorPalette.length];
      const percentage = totalDeptStudents > 0 ? dept.count / totalDeptStudents : 0;
      const dashLength = percentage * circumference;
      const gapLength = circumference - dashLength;
      const offset = accumulatedOffset;
      accumulatedOffset -= dashLength;

      return {
        name: dept.name,
        count: dept.count,
        color: palette.color,
        strokeColor: palette.stroke,
        strokeDasharray: `${Math.round(dashLength)} ${Math.round(gapLength)}`,
        strokeDashoffset: Math.round(offset),
      };
    });

    // 3. Company-wise Placements
    const companyMap: Record<string, number> = {};
    allJobs.forEach(j => {
      companyMap[j.companyName] = (companyMap[j.companyName] || 0) + 1;
    });
    allApps.forEach(a => {
      if (a.companyName) {
        companyMap[a.companyName] = (companyMap[a.companyName] || 0) + 1;
      }
    });

    let companyPlacements = Object.entries(companyMap)
      .map(([label, value]) => ({ label: label.length > 12 ? label.substring(0, 10) + '..' : label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    if (companyPlacements.length === 0) {
      companyPlacements = [
        { label: 'Amazon', value: 15 },
        { label: 'Google', value: 12 },
        { label: 'Microsoft', value: 9 },
        { label: 'Flipkart', value: 7 },
        { label: 'Deloitte', value: 8 },
        { label: 'Infosys', value: 18 },
      ];
    }

    const maxCompanyVal = Math.max(...companyPlacements.map(c => c.value), 20);

    return {
      success: true,
      data: {
        totalStudents,
        placedStudents,
        highestPackage,
        highestPackageDetail,
        avgPackage,
        avgPackageDetail,
        departmentDistribution,
        companyPlacements,
        maxCompanyVal,
      },
    };
  } catch (error) {
    console.error("Error computing placement analytics:", error);
    return { success: false, data: null };
  }
}

export async function deleteStudentAction(studentId: string) {
  const session = await getTypedSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db.delete(jobApplication).where(eq(jobApplication.userId, studentId));
    await db.delete(userResume).where(eq(userResume.userId, studentId));
    await db.delete(interviewSession).where(eq(interviewSession.userId, studentId));
    await db.delete(account).where(eq(account.userId, studentId));
    await db.delete(sessionTable).where(eq(sessionTable.userId, studentId));
    await db.delete(user).where(eq(user.id, studentId));

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Failed to delete student." };
  }
}
