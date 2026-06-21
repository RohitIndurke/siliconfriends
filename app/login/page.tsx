import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    if ((session.user as any).role === "admin") {
      redirect("/admin");
    } else {
      redirect("/profile");
    }
  }

  return <LoginClient />;
}
