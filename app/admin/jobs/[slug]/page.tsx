import { db } from "@/db";
import { job } from "@/db/schema";
import { generateJobSlug } from "../../../components/data";
import JobDetailClient from "./JobDetailClient";
import { getTypedSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // S-04: Use typed session helper — no more (session.user as any).role
  const session = await getTypedSession();

  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;

  if (session.user.role !== "admin") {
    redirect(`/profile/jobs/${slug}`);
  }

  const allJobs = await db.select().from(job);
  
  const foundJob = allJobs.find((j) => generateJobSlug(j.companyName, j.jobTitle) === slug);
  
  return <JobDetailClient job={foundJob || null} />;
}
