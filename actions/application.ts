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
        appliedAt: jobApplication.appliedAt,
      })
      .from(jobApplication)
      .innerJoin(job, eq(jobApplication.jobId, job.id));

    const totalStudents = allStudents.length;
    const selectedUserIds = new Set(allApps.filter(a => a.status === "Selected").map(a => a.userId));
    const placedStudents = allStudents.filter((s) => s.placementStatus === "Placed" || selectedUserIds.has(s.id)).length;

    const activeJobsList = allJobs.filter(j => !j.status || !j.status.toLowerCase().includes("closed"));
    const activeJobs = activeJobsList.length;
    const uniqueCompanies = new Set(allJobs.map(j => j.companyName)).size;

    const interviewingUserIds = new Set(
      allApps
        .filter(a => (a.status === "Interview" || a.status === "Shortlisted") && !selectedUserIds.has(a.userId))
        .map(a => a.userId)
    );
    const interviewingStudents = allStudents.filter(s => interviewingUserIds.has(s.id) && s.placementStatus !== "Placed").length;
    const activeStudents = Math.max(0, totalStudents - placedStudents - interviewingStudents);

    const companyDrivesMap: Record<string, { id: string; companyName: string; dateStr: string; roleCount: number }> = {};
    activeJobsList.forEach(j => {
      if (!companyDrivesMap[j.companyName]) {
        let dateStr = "Recently";
        try {
          const d = j.opensAt || j.closesAt || j.createdAt;
          if (d) dateStr = new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } catch (e) {}
        companyDrivesMap[j.companyName] = { id: j.id, companyName: j.companyName, dateStr, roleCount: 0 };
      }
      companyDrivesMap[j.companyName].roleCount += 1;
    });
    const upcomingDrives = Object.values(companyDrivesMap).slice(0, 5);

    // 1. Highest & Avg Package calculation from jobs in DB
    const jobsWithSalary = allJobs.filter(j => (j.ctcFixedLpa && j.ctcFixedLpa > 0) || (j.stipendMonthly && j.stipendMonthly > 0));
    
    let highestPackage = "N/A";
    let highestPackageDetail = "No CTC recorded yet";
    let avgPackage = "N/A";
    let avgPackageDetail = "No CTC recorded yet";

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

    const totalDeptStudents = sortedDepts.reduce((sum, d) => sum + d.count, 0);
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
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

    const maxCompanyVal = companyPlacements.length > 0 ? Math.max(...companyPlacements.map(c => c.value), 5) : 10;

    // 4. Monthly Trend (Last 5 months)
    const months: string[] = [];
    const now = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleDateString("en-US", { month: "short" }));
    }
    const appCounts = [0, 0, 0, 0, 0];
    const placedCounts = [0, 0, 0, 0, 0];

    allApps.forEach(a => {
      if (a.appliedAt) {
        const d = new Date(a.appliedAt);
        const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        if (diffMonths >= 0 && diffMonths < 5) {
          const idx = 4 - diffMonths;
          appCounts[idx]++;
          if (a.status === "Selected") {
            placedCounts[idx]++;
          }
        }
      }
    });

    const maxMonthlyVal = Math.max(...appCounts, ...placedCounts, 5);
    const monthlyTrend = {
      labels: months,
      applications: appCounts,
      placements: placedCounts,
      maxVal: maxMonthlyVal,
    };

    return {
      success: true,
      data: {
        totalStudents,
        placedStudents,
        activeJobs,
        uniqueCompanies,
        interviewingStudents,
        activeStudents,
        upcomingDrives,
        highestPackage,
        highestPackageDetail,
        avgPackage,
        avgPackageDetail,
        departmentDistribution,
        companyPlacements,
        maxCompanyVal,
        monthlyTrend,
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

export async function adminCreateStudentAction(data: { name: string; email: string; password?: string }) {
  const session = await getTypedSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { auth } = await import("@/lib/auth");
    const res = await auth.api.signUpEmail({
      body: {
        email: data.email.trim(),
        password: data.password || "mitalandi",
        name: data.name.trim(),
        role: "student",
      },
    });

    if (res?.user?.id) {
      await db.delete(sessionTable).where(eq(sessionTable.userId, res.user.id));
    }

    revalidatePath("/admin");
    return { success: true, data: res?.user };
  } catch (error: any) {
    console.error("Error creating student server-side:", error);
    return { success: false, error: error?.message || "Failed to create student account." };
  }
}
