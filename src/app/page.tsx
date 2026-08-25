import AuthenticatedAdminPage from "./authenticated-admin-page";

export const dynamic = "force-dynamic";
export default async function Home() {
  return <AuthenticatedAdminPage section="home"/>;
}
