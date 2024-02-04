import UserCard from '@/components/UserCard/UserCard';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Users() {
    const session = await getServerSession(authOptions);
    if(!session) {
        console.log('Hi')
        redirect('api/auth/signin')
    } else{

        const users = await prisma.user.findMany();
        if(!users){
            return (
                <div>
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        There are no users!
                        </h2>
                </div>
            )
        }
        return (
            <div className='grid grid-cols-3 gap-4 justify-items-center py-8'>
                {users.map((user) => {
                    return <UserCard key={user.id} {...user}/>;
                })}
            </div>
        )
    }

}