import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { hashSync } from 'bcrypt-ts'

export async function GET(request: NextRequest){
    const targetUserId = request.nextUrl.searchParams.get('targetUserId');
    const targetUserEmail = request.nextUrl.searchParams.get('targetUserEmail');
    try {
        if(targetUserId) {
            const user = await prisma.user.findUnique({
                where: {
                    id: targetUserId,
                }
            });
            return NextResponse.json(user);
        }
        if(targetUserEmail) {
            const user = await prisma.user.findUnique({
                where: {
                    email: targetUserEmail,
                }
            });
            return NextResponse.json(user);
        }
        else {
            const users = await prisma.user.findMany();
            return NextResponse.json(users);
        }
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while retrieving user(s)" }), { status: 500 });
    }

    
}


export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email!;
    const data = await request.json();
    if(data.email != currentUserEmail) {
        return new Response(JSON.stringify({ error: "Naughty, Naughty!" }), { status: 500 });
    }

    const user = await prisma.user.update({
        where: {
            email: currentUserEmail,
        },
        data,
    });
    return NextResponse.json(user);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const checkUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if(checkUser?.email!){
            return NextResponse.json({
                user: null,
                message: 'User already exists.'
            }, {status: 409});
        }
        
        const hashPass = hashSync(data.password, 10);
        const user = await prisma.user.create({
            data: {
                name: data.name,
                bio: data.bio,
                age: data.age,
                email: data.email,
                password: hashPass
            }
        });
    
        return NextResponse.json(user)
    }
    catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
        });
    }

}