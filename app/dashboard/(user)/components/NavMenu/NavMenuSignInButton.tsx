'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function SignInButton({ user }: any) {
    const { data: session, status } = useSession();
    
    if(status === 'authenticated'){
        return (
            <Link href={`/dashboard`}>
                <Avatar>
                {
                    session.user?.image ? <AvatarImage src={session.user.image} /> 
                    : <Skeleton  className="h-12 w-12 rounded-full"/>
                    }
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>
            
        );
    }

    if(status === 'unauthenticated'){
        return <Button onClick={() => signIn()}>Sign In</Button>
    }

}

export function SignOutButton() {
    return <Button onClick={() => signOut()}>Sign Out</Button>
}