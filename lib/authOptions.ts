import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import  CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { compare } from 'bcrypt-ts';
import "next-auth";
import { DefaultJWT } from 'next-auth/jwt';

declare module "next-auth" {
  interface User {
    role?: string | null;
  }
}
declare module "next-auth" {
    interface Session {
      user: {
        /** Extending the built-in session user type */
        id?: string| null;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string| null; // Add role as an optional property
      }
    }
  }
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string | null;
  }
}
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
                token.role = user.role;
                
            } else if(token.email) {
                const refreshUser = await prisma.user.findUnique({
                    where: {
                        email: token.email
                    }
                })
                // console.log(refreshUser?.role)
                if(refreshUser) {
                    token.picture = refreshUser.image;
                    token.name = refreshUser.name;
                    token.role = refreshUser.role;
                    token.email = refreshUser.email;
                }
            }
            return token;
        },
        async session({session, token, user }) {
            session.user.role = token.role;
            session.user.image = token.picture;
            return session
        }
    }
};