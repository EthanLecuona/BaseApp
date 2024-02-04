import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to my home!</p>
    </div>
    
  );
}
