import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const targetPostId = request.nextUrl.searchParams.get('targetPostId');
    const userId = request.nextUrl.searchParams.get('userId');
    try {
        if(targetPostId){
            const post = await prisma.post.findUnique({
                where: {
                    id: targetPostId
                }
            });
            return NextResponse.json(post);
        } 
        if(userId) {
            const posts = await prisma.post.findMany({
                where: {
                    userId: userId
                }
            })
            return NextResponse.json(posts);
        }
        else {
            const posts = await prisma.post.findMany();
            return NextResponse.json(posts);
        }
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while retrieving post(s)" }), { status: 500 });
    }

}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    // const currentUserEmail = session?.user?.email!;
    const data = await request.json();
    console.log(data);

    const post = await prisma.post.update({
        where: {
            id: data.id,
        },
        data
    });
    return NextResponse.json(post);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email!;
    const data = await request.json();
    const currentUserId = await prisma.user
    .findUnique({
        where : {
            email: currentUserEmail
        }
    })
    .then((user) => user?.id!);
    
    const record = await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            userId: currentUserId,
            date: new Date()
        },
    });
    return NextResponse.json(record);
}


export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const targetPostId = request.nextUrl.searchParams.get('targetPostId');

    if (targetPostId === null) {
        return new Response(JSON.stringify({ error: "Post ID is required" }), { status: 400 });
    }

    const res = await prisma.post.delete({
        where : {
            id: targetPostId,
        },
    });

    return NextResponse.json(res);
}