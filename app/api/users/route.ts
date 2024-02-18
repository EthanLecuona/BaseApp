import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from 'next-auth';
import { hashSync } from 'bcrypt-ts'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function GET(request: NextRequest){
    // const session = await getServerSession(authOptions);
    // if(!session) {
    //     return new Response(JSON.stringify({ error: "You must be logged in to add a product to your cart" }), { status: 401 }); 
    // }
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
    // if(!session) {
    //     return new Response(JSON.stringify({ error: "You must be logged in to add a product to your cart" }), { status: 401 }); 
    // }
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
    // const session = await getServerSession(authOptions);
    // if(!session) {
    //     return new Response(JSON.stringify({ error: "You must be logged in to add a product to your cart" }), { status: 401 }); 
    // }
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
                dob: data.dob,
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