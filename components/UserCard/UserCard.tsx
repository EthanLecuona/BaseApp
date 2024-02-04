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

interface Props {
    id: string;
    name: string | null;
    age: number | null;
    image: string | null;
  }


export default function UserCard({id, name, age, image} : Props){
    return (
        <Card className="w-[200px] flex flex-col items-center">
            <CardHeader className='flex flex-col items-center'>
                <Image
                    src={image || '/next.svg'}
                    alt='Image'
                    
                    width={250}
                    height={250}
                />
                <CardTitle><Link href={`/users/${id}`}>{name}</Link></CardTitle>
            </CardHeader>
            <CardContent>
                Age: {age}
            </CardContent>
        </Card>
    )
}