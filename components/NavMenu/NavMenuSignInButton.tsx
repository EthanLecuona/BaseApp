'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function SignInButton({ user }: any) {
    const { data: session, status } = useSession();
    
    if(status === 'authenticated'){
        return (
            <Link href={`/dashboard`}>
                <Avatar>
                    <AvatarImage src={session.user?.image || '/next.svg'}/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {/* <Image
                    src={session.user?.image || '/next.svg'}
                    width={50}
                    height={50}
                    alt="Your Name"
                /> */}
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