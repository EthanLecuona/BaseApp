'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from '@/components/ThemeToggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { signIn, useSession } from 'next-auth/react';

export default function DefaultNav() {
    const {data: session} = useSession()
    if(!session) {
        return (
            <NavigationMenu className="fixed inset-x-0 top-0 z-10 bg-zinc-300 bg-opacity-50 backdrop-blur-md">
                <NavigationMenuList className="flex flex-row justify-between items-center w-screen px-5 py-3">
                    <div className='flex space-x-2'>
                        <NavigationMenuItem>
                            <Link href={'/'} passHref>
                                <Image 
                                    src="/next.svg"
                                    alt='My Space Logo'
                                    width={216}
                                    height={43.88}
                                />
                            </Link>
                        </NavigationMenuItem>
                
                    </div>
                    <div className='flex space-x-2'>
                        <NavigationMenuItem>
                            <Link href="/home" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Home
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <Separator orientation="vertical" className='h-10 bg-slate-300'/>
                        <NavigationMenuItem>
                            <Link href="/about" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    About
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </div>
                    <div className='flex flex-row items-center space-x-4'>
                        <Separator orientation="vertical" className='h-10 bg-slate-300'/>
                        <NavigationMenuItem className="space-x-4">
                            <ModeToggle/>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="space-x-4">
                            <Button onClick={() => signIn()}>Sign In</Button>
                        </NavigationMenuItem>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        ) 
    }

}