import { db } from "@/db";
import { job } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminClient from "./AdminClient";
import { getTypedSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getAdminDashboardDataAction } from "@/actions/application";

export default async function AdminPage() {
  const session = await getTypedSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/profile");
  }

  const jobs = await db.select().from(job).orderBy(desc(job.createdAt));
  const dashboardRes = await getAdminDashboardDataAction();

  return <AdminClient initialJobs={jobs} dashboardData={dashboardRes.data || {}} />;
}
