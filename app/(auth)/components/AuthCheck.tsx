'use client';

import { useSession } from 'next-auth/react';

export default function AuthCheck({ children }: {children: React.ReactNode}) {
    const { data: session, status } = useSession();

    if(status === 'loading'){
        return <>Loading...</>;
    }
    
    if(status === 'authenticated'){
        return <>{children}</>;
    } else {
        return <></>;
    }
}
