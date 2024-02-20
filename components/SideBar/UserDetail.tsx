'use client';
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export default function UserDetail() {
  const user = useSession().data?.user;
  return <div className="flex items-center justify-between gap-2 border rounded-[8px] p-2">
    <Avatar>
      <AvatarImage src={user?.image || './next.svg'}/>
      <AvatarFallback>{user?.name}</AvatarFallback>
    </Avatar>
    <div className="grow">
      <p className="text-[16px] font-bold">{user?.name}</p>
      <p className="text-[12px] text-neutral-500">{user?.email}</p>
    </div>
  </div>;
}