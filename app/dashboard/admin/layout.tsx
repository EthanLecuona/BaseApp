import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
// import "@/app/global.css";
import SideBar from "./components/SideBar/SideBar";
import Header from "./components/SideBar/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, useRouter } from "next/navigation";


export const metadata: Metadata = {
  title: "Base App",
  description: "Generated by create next app",
};

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
})


export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  // const router = useRouter()
  if(!session || session.user.role !== 'admin') {
    redirect('/sign-in')
  }
    
    return (
        <div>
            <SideBar />
            <div className="pl-[300px]">
                <Header/>
            </div>
            <div className="pl-[300px] pt-[80px] h-full">
                {children}  
            </div>
        </div>
    )
}
