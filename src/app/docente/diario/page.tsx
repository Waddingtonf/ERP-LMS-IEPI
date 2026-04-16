import DiarioClient from "./_components/DiarioClient";
import { getAuthContext } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function DiarioClassePage() {
  const user = await getAuthContext();

  // Fallback if testing without proper session logic 
  const instrutorId = user?.userId ?? "instrutor-1";

  return <DiarioClient instrutorId={instrutorId} />;
}
