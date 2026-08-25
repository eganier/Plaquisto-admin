import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminApp, { type AppSection } from "./admin-app";

const ADMIN_EMAIL = "e.ganier@gmail.com";

export default async function AuthenticatedAdminPage({section}:{section:AppSection}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) redirect("/auth/denied");

  return <AdminApp section={section}/>;
}
