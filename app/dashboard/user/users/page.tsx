import UserCard from './components/UserCard';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/authOptions";
import { redirect } from 'next/navigation';


export default async function Users() {
    const session = await getServerSession(authOptions);
    if(!session) {
        redirect('api/auth/signin')
    } else{

        const users = await fetch('http://localhost:3000/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })
        .then((res) => res.json())

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
                {users.map((user: any) => {
                    return <UserCard key={user.id} user={user}/>;
                })}
            </div>
        )
    }

}