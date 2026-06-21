import { db } from "@/db";
import { job } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminClient from "./AdminClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "admin") {
    redirect("/profile");
  }

  const jobs = await db.select().from(job).orderBy(desc(job.createdAt));
  return <AdminClient initialJobs={jobs} />;
}
