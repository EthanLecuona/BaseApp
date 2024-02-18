import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session?.user.role);
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to my home!</p>
    </div>
    
  );
}
