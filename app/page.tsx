import General from "@/components/Charts/General";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Landing() {
  const session = await getServerSession(authOptions);
  if(session) {
    if(session.user.role === 'admin') {
      redirect('/dashboard/admin/inventory')
    }
    if(session.user.role === 'user') {
      redirect('/dashboard/user/blog')
    }
  } else {
    redirect('/sign-in')
  }
}
