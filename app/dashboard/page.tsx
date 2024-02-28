import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect('/sign-in')
  }
  if(session.user.role === 'admin'){
    redirect('dashboard/admin/inventory')
  } else {
    redirect('dashboard/user/blog')
  }
}
