import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import  CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt-ts';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in',
    },
    providers : [
        GithubProvider({
            id: 'github',
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            id: 'prisma',
            type: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'email', placeholder: 'ethanlecuona@gmail.com'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password) {
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })
                if(!user?.password){
                    return null
                }
                if(!await compare(credentials.password, user.password)){
                    return null
                }
                if(!user) {
                    return null;
                }
                return user;
            },
        })
        
    ]
};

export async function GET(req: any, res: any) {
    return NextAuth(req, res, authOptions);
}
export async function POST(req: any, res: any) {
    return NextAuth(req, res, authOptions);
}