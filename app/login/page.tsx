import { redirect } from "next/navigation";
import { AuthForm } from "@/components/account/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");
  return <AuthForm />;
}
