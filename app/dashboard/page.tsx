import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if(session) {
    redirect('/dashboard')
  }
  else {
    redirect('/sign-in')
  }
}
