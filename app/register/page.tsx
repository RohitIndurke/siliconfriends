import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RegisterClient from "./RegisterClient";

export default async function RegisterPage() {
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

  return <RegisterClient />;
}
