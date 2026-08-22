import { redirect } from "next/navigation";
import AdminApp from "./admin-app";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const ADMIN_EMAIL = "e.ganier@gmail.com";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) redirect("/auth/denied");

  return <AdminApp />;
}
