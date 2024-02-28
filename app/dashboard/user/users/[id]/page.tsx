import FollowButton from '../components/FollowingButton';
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
import { User } from '@/lib/types';


//Supposed to be able to do this... Instead of just rewriting fetches, have a single function that does it for us through the page
// const getUser = async (id: any) => {
//     const user = await fetch(`http://localhost:3000/api/users?targetUserId=${id}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         cache: 'no-store'
        
//     })
//     .then((res) => res.json());
//     return user
// }

interface Props {
    params: {
        id: string;
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const user = await fetch(`http://localhost:3000/api/users?targetUserId=${params.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store'
        
    })
    .then((res) => res.json());
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