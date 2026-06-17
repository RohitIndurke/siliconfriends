import { db } from "@/db";
import { job } from "@/db/schema";
import { generateJobSlug } from "../data";
import JobDetailClient from "./JobDetailClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;
  const allJobs = await db.select().from(job);
  
  const foundJob = allJobs.find((j) => generateJobSlug(j.companyName, j.jobTitle) === slug);
  
  return <JobDetailClient job={foundJob || null} />;
}
