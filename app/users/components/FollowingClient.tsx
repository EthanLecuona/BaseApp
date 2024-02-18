"use client"
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '../../../components/ui/button';

interface Props {
    targetUserId: string;
    isFollowing: boolean;
}

export default function FollowClient({ targetUserId, isFollowing } : Props) {
   
    const router = useRouter();
    //Special hook to see if we still have a loading state that is pending
    const [isPending, startTransition] = useTransition();
    //If we are waiting for the server to respond
    const [isFetching, setIsFetching] = useState(false);
    //a derived state by combing the two together
    const isMutating = isFetching || isPending;

    const follow = async () => {
        setIsFetching(true);
        const res = await fetch('http://localhost:3000/api/follow', {
            method: 'POST',
            body: JSON.stringify({ targetUserId}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setIsFetching(false);

        startTransition(() => {
            // Refresh the current route:
            // - Makes a new request to the server for the route
            // - Re-fetches data requests and re-renders Server Components
            // - Sends the updated React Server Component payload to the client
            // - The client merges the payload without losing unaffected
            //   client-side React state or browser state
            router.refresh();
        });
    }

    const unfollow = async () => {
        setIsFetching(true);

        const res = await fetch(`http://localhost:3000/api/follow?targetUserId=${targetUserId}`, {
            method: 'DELETE', 
        });
        setIsFetching(false);
        startTransition(() => router.refresh());
    }

    //isMutating show different text on button depending if an update is in progress
    //Optimistic updates
    if(isFollowing){
        return (
            <Button variant="outline" onClick={unfollow}>
                {!isMutating ? 'Unfollow' : '...'}
            </Button>
        )
    }

    if(!isFollowing){
        return (
            <Button variant="outline" onClick={follow}>
                {!isMutating ? 'follow' : '...'}
            </Button>
        )
    }
}