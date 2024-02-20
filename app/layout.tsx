import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import NavMenu from "../components/NavMenu/NavMenu";
import AuthProvider from "./AuthProvider";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import SideBar from "@/components/SideBar/SideBar";
import Header from "@/components/SideBar/Header";

export const metadata: Metadata = {
  title: "Base App",
  description: "Generated by create next app",
};

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
})


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  if(session?.user.role === 'admin') {
    return (
      <AuthProvider>
      <html lang="en">
        <body className={cn(
          "min-h-screen font-sans antialiased" 
        )}>
          <main >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
                <div>
                    <SideBar />
                    <div className="pl-[300px]">
                      <Header/>
                    </div>
                    <div className="pl-[300px] pt-[80px] h-full">
                      {children}  
                    </div>
                </div>
            </ThemeProvider>
          </main>
          <Toaster/>
        </body>
      </html>
    </AuthProvider>  
    )
  } else {
    return (
      <AuthProvider>
        <html lang="en">
          <body className={cn(
            "min-h-screen font-sans antialiased" 
          )}>
            <main >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>
                  <NavMenu/>
                  <div className="pt-[67px]">
                    {children}  
                  </div>
              </ThemeProvider>
            </main>
            <Toaster/>
          </body>
        </html>
      </AuthProvider>
    );
  }
}
