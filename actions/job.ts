"use server";

import { db } from "@/db";
import { job } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createJobAction(data: any, userId: string) {
  try {
    await db.insert(job).values({
      id: crypto.randomUUID(),
      ...data,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    revalidatePath("/jobs");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating job:", error);
    return { success: false, error: error.message };
  }
}
