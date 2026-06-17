import { db } from "@/db";
import { job } from "@/db/schema";
import { desc } from "drizzle-orm";
import JobsClient from "./JobsClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function JobsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const jobs = await db.select().from(job).orderBy(desc(job.createdAt));
  return <JobsClient initialJobs={jobs} />;
}
