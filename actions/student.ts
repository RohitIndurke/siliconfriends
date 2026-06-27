"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getTypedSession } from "@/lib/session";

export async function getStudentsAction() {
  const session = await getTypedSession();
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "Unauthorized", data: [] };
  }

  try {
    const students = await db
      .select()
      .from(user)
      .where(eq(user.role, "student"))
      .orderBy(desc(user.createdAt));

    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: "Failed to fetch students", data: [] };
  }
}

export async function updateStudentProfileAction(data: {
  rollNumber?: string;
  department?: string;
  cgpa?: number;
  skills?: string[];
  placementStatus?: string;
}) {
  const session = await getTypedSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await db
      .update(user)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    revalidatePath("/profile");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating student profile:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}
