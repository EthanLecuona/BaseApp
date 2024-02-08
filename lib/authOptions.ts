import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import  CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt-ts';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET!,
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
    ],
    callbacks: {
        async jwt({token, user, session, account, profile}) {
            // console.log("jwt callback", {token, user, session, account, profile});
            if(user) {
                token.email = user.email;
                token.picture = user.image;
                token.name = user.name;
            } else if(token.email) {
                const refreshUser = await prisma.user.findUnique({
                    where: {
                        email: token.email
                    }
                })
                if(refreshUser) {
                    token.picture = refreshUser.image;
                }
            }
            return token;
        },
        async session({session, token }) {
            if(session.user){
                session.user.image = token.picture;
            }
            return session
        }

    }
};