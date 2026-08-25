import AuthenticatedAdminPage from "../authenticated-admin-page";

export const dynamic = "force-dynamic";
export default function Page() { return <AuthenticatedAdminPage section="supplies"/>; }
