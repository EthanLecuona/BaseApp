import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'



export async function GET(req: any, res: any) {
    return NextAuth(req, res, authOptions);
}
export async function POST(req: any, res: any) {
    return NextAuth(req, res, authOptions);
}