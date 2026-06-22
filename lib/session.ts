import { auth } from "./auth";
import { headers } from "next/headers";

export type UserRole = "student" | "admin";

export type TypedUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role: UserRole;
};

/**
 * Returns the current session with a fully typed user object (including `role`).
 * Use this in all Server Components and Server Actions instead of
 * raw `auth.api.getSession()` + `(session.user as any).role`.
 */
export async function getTypedSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return {
    ...session,
    user: session.user as TypedUser,
  };
}
