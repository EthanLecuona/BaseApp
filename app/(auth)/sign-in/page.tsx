import SignInForm from '@/components/form/SignInForm';
import Link from 'next/link';
import { cn } from "@/lib/utils"
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await getServerSession(authOptions);
  if(session) {
    redirect('/');
  }

  return (
    <>
    <div className="container relative bg-muted hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
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
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
          <p className="text-lg">
            {`Hey there, fellow dreamer! Did you know this project isn't just about bits and bytes? 
            It's a love letter, a shared dream between me and a very special girl. We've decided to embark on this coding journey together, making this project the bedrock of all our future creations. 
            Think of it as our digital diary, where each line of code is a memory, every function a shared experience, and all the bugs... well, let's just say they're our little adventures.`}
          </p>
            <footer className="text-sm">Ethan Lecuona | Maseeha Mohamed Ibrahim</footer>
          </blockquote>
        </div>
      </div>
      <div className="bg-muted lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to Sign In
            </p>
          </div>
          <SignInForm/>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  </>

    // <div className='w-full'>
    //   <SignInForm />
    // </div>
  );
};