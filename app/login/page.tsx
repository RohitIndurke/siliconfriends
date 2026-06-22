import { getTypedSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  // S-04: Use typed session helper — no more (session.user as any).role
  const session = await getTypedSession();

  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/profile");
    }
  }

  return <LoginClient />;
}
