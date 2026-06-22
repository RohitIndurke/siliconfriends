import { redirect } from "next/navigation";
import { getTypedSession } from "@/lib/session";

export default async function Home() {
  // S-04: Use typed session helper — no more (session.user as any).role
  const session = await getTypedSession();

  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/profile");
    }
  } else {
    redirect("/login");
  }
}
