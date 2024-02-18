import FollowButton from '@/app/users/components/FollowingButton';
import { prisma} from '@/lib/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
import { differenceInYears } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

interface Props {
    params: {
        id: string;
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const user  = await prisma.user.findUnique({where : { id: params.id}});
    return { title: `User Profile: ${user?.name}`};
}


export default async function UserProfile({ params }: any){

    const user = await fetch(`http://localhost:3000/api/users?targetUserId=${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store'
        
    })
    .then((res) => res.json());
    const { id, name, bio, image, dob } = user ?? {};
    return (
        <Card className="w-[250px] flex flex-col items-center m-8">
            <CardHeader className='flex flex-col items-center'>
                <Image
                    src={image ?? 'next.svg'}
                    alt='Image'
                    
                    width={250}
                    height={250}
                />
                <CardTitle>{name}</CardTitle>
                <CardDescription>Age: {differenceInYears(new Date(), new Date(dob))}</CardDescription>
            </CardHeader>
            <CardContent>
                {bio}
            </CardContent>
            <FollowButton targetUserId={id}/>
        </Card>
    )
}