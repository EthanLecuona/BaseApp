import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email!;
    const { targetUserId } = await request.json();

    const currentUserId = await prisma.user
    .findUnique({ where: { email: currentUserEmail}})
    .then((user) => user?.id!);

    const record = await prisma.follows.create({
        data: {
            followerId: currentUserId,
            followingId: targetUserId,
        },
    });

    return NextResponse.json(record);
}

//Use NextRequest to get Id from URL
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email!;
    const targetUserId = request.nextUrl.searchParams.get('targetUserId');

    const currentUserId = await prisma.user
    .findUnique({where : { email: currentUserEmail}})
    .then((user) => user?.id!);

    const record = await prisma.follows.delete({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId!,
            },
        },
    });

    return NextResponse.json(record);
}