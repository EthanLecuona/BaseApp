import FollowButton from '@/components/FollowingButton/FollowingButton';
import { prisma} from '@/lib/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
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


export default async function UserProfile({params}: Props){

    const user = await prisma.user.findUnique({ where: { id: params.id}});
    const { name, bio, image, age } = user ?? {};

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
                <CardDescription>Age: {age}</CardDescription>
            </CardHeader>
            <CardContent>
                {bio}
            </CardContent>
            <FollowButton targetUserId={params.id}/>
        </Card>
    )
}