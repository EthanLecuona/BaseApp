'use client';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton } from './NavMenuSignInButton';
import AuthCheck from '@/app/(auth)/components/AuthCheck';
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
import { NavMenuDropDown } from './NavMenuDropDown';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';



export default function NavMenu() {
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
                    <Separator orientation="vertical" className='h-10 bg-slate-300'/>
                    <NavigationMenuItem>
                        <Link href="/dashboard/blog" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Blog
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <Separator orientation="vertical" className='h-10 bg-slate-300'/>
                    <NavigationMenuItem>
                        <Link href="/dashboard/users" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Users
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <Separator orientation="vertical" className='h-10 bg-slate-300'/>
                    <NavigationMenuItem>
                        <Link href="/dashboard/products" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Products
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <Separator orientation="vertical" className='h-10 bg-slate-300'/>
                </div>
                <div className='flex flex-row items-center space-x-4'>
                    <Separator orientation="vertical" className='h-10 bg-slate-300'/>
                    <NavigationMenuItem className="space-x-4">
                        <ModeToggle/>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="space-x-4">
                            <SignInButton />
                    </NavigationMenuItem>
                    <AuthCheck>
                        <NavigationMenuItem className="space-x-4">
                            <NavMenuDropDown/>
                        </NavigationMenuItem>
                    </AuthCheck>
                </div>
            </NavigationMenuList>
        </NavigationMenu>


       
    )
}