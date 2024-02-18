import { getServerSession } from "next-auth";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/authOptions";
import FollowClient from "./FollowingClient";


interface Props {
    targetUserId: string;
}


export default async function FollowButton({ targetUserId }: Props) {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email!;

    const currentUserId = await prisma.user
    .findUnique({ where : { email: currentUserEmail }})
    .then((user) => user?.id!);


    const isFollowing = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId
          }
        }
    });
      
    // const isFollowing = await prisma.follows
    // .findFirst({ where : { followerId: currentUserId, followingId: targetUserId }});

    return (
        //!! converts to boolean
        <FollowClient targetUserId={targetUserId} isFollowing={!!isFollowing}/>
    )

}