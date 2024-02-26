'use client';

import { BellIcon, Cookie, CreditCard, Inbox, MessageSquare, Settings, User, LogOut, Box, Users, Book, FlameKindling } from "lucide-react";
import UserDetail from "./UserDetail";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { signOut } from "next-auth/react";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const menuList = [
    {
      group: "General",
      items: [
        {
          link: "inventory",
          icon: <Box />,
          text: "Inventory"
        },
        {
          link: "orders",
          icon: <FlameKindling />,
          text: "Orders"
        },
        {
          link: "/blog",
          icon: <Book />,
          text: "Blogs"
        },
        // {
        //   link: "/",
        //   icon: <BellIcon />,
        //   text: "Notifications"
        // }
      ]
    },
    {
      group: "Settings",
      items: [
        {
          link: "/settings/profile",
          icon: <Settings />,
          text: "General Settings"
        },
        {
          link: "/",
          icon: <MessageSquare />,
          text: "Logs"
        }
        // {
        //   link: "/",
        //   icon: <Cookie />,
        //   text: "Privacy"
        // },
      ]
    }
  ]
  const router = useRouter()
  const [open, setOpen ] = useState(false)
  const handleSignOut = async () => {
    await signOut()
    redirect('/sign-in')
  }
  return (
    <div className="fixed flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4 ">
      <div>
        <UserDetail />
      </div>
      <div className="grow">
        <Command  style={{ overflow: 'visible' }}>
          <CommandList style={{ overflow: 'visible' }}>
            {menuList.map((menu: any, key: number) => (
              <CommandGroup key={key} heading={menu.group}>
                {menu.items.map((option: any, optionKey: number) =>
                  <Link href={option.link} key={optionKey}>
                    <CommandItem className="flex gap-2 cursor-pointer">
                        {option.icon}
                        {option.text}
                    </CommandItem>
                  </Link> 
                )}
              </CommandGroup>
            ))}
            <CommandGroup key={menuList.length + 1} heading="Logout">
              <CommandItem key={100} className="flex gap-2 cursor-pointer"><LogOut/><Button className="w-full h-full flex flex-col items-start p-0" onClick={() => setOpen(true)} variant="ghost">Logout</Button></CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to signin again in order to continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleSignOut()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Our Base Project
          </div>
    </div>    
  );
}