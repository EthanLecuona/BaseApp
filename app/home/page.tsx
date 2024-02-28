import General from "@/components/Charts/General";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {

    return (
        <div className="mt-[67px]">
            <h1>Home!</h1>
        </div>
    )
}
