import Link from 'next/link';
import Image from 'next/image';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { differenceInYears } from 'date-fns';

interface Props {
    user: {
        id: string;
        bio: string | null;
        email: string;
        name: string | null;
        dob: Date;
        image: string | null;
    }
  }


export default function UserCard({ user } : any){
    return (
        <Card className="w-[200px] flex flex-col items-center">
            <CardHeader className='flex flex-col items-center'>
                <Image
                    src={user.image || '/next.svg'}
                    alt='Image'
                    width={200}
                    height={200}
                />
                <CardTitle><Link href={`/users/${user.id}`}>{user.name}</Link></CardTitle>
            </CardHeader>
            <CardContent>
                Age: {differenceInYears(new Date(), new Date(user.dob))}
            </CardContent>
            <CardFooter>{user.bio}</CardFooter>
            <CardDescription>{user.email}</CardDescription>
        </Card>
    )
}