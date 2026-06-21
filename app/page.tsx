import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    if ((session.user as any).role === "admin") {
      redirect("/admin");
    } else {
      redirect("/profile");
    }
  } else {
    redirect("/login");
  }
}
