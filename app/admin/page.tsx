import { db } from "@/db";
import { job } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminClient from "./AdminClient";
import { getTypedSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  // S-04: Use typed session helper — no more (session.user as any).role
  const session = await getTypedSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/profile");
  }

  const jobs = await db.select().from(job).orderBy(desc(job.createdAt));
  return <AdminClient initialJobs={jobs} />;
}
