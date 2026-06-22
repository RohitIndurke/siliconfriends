"use server";

import { db } from "@/db";
import { job } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { getTypedSession } from "@/lib/session";

/**
 * S-03: Server-side auth & role check before any DB write.
 * S-08: Raw DB error messages are never returned to the client.
 * S-11: userId is always read from the server-side session — never trusted from the client.
 */
export async function createJobAction(data: any) {
  // 1. Verify the caller is authenticated
  const session = await getTypedSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Enforce admin-only access
  if (session.user.role !== "admin") {
    return { success: false, error: "Forbidden" };
  }

  try {
    await db.insert(job).values({
      id: crypto.randomUUID(),
      ...data,
      createdBy: session.user.id, // Always use server-side userId — never trust client
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    // S-08: Log full error server-side, return generic message to client
    console.error("Error creating job:", error);
    return { success: false, error: "Failed to create job. Please try again." };
  }
}

export async function updateJobAction(jobId: string, data: any) {
  const session = await getTypedSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (session.user.role !== "admin") {
    return { success: false, error: "Forbidden" };
  }

  try {
    // Use require context mapping or direct drizzle update
    const { eq } = await import("drizzle-orm");
    await db.update(job).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(job.id, jobId));

    revalidatePath("/admin");
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, error: "Failed to update job. Please try again." };
  }
}
