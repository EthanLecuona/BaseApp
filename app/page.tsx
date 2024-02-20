import General from "@/components/Charts/General";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if(session?.user.role === 'admin') {
    return (
      <div>
        <General/>
      </div>  
    )
  } else {
    return (
      <div>
        <h1>Home!</h1>
        <p>Welcome!</p>
      </div>
    )
  }
}
