//Always fetches the latest data 
//export const dynamic = 'force-dynamic';

import { authOptions } from "@/lib/authOptions";
import BlogCard from "@/app/blog/components/BlogCard";
import DeleteBlogPostButton from "@/app/blog/components/BlogDeletePostButton";
import { EditPostForm } from "@/app/blog/components/BlogPostDrawer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Pen } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

//Updates cache very n seconds
//export const revalidate = 420;

interface Post {
    title: string;
    id: string;
    content: string;
    userId: string;
    date: string;
}


interface Props {
    params: {
        id: string;
    };
}

//When you have dynamic data that doesn't change much and preloads it. -> generateStaticParams()
//Add revalidate = n for extra for incremental static regeneration
//Best of both worlds with performance and data stays fresh
// export async function generateStaticParams() {
//     const posts: Post[] = await fetch('http://localhost:3000/api/content').then(
//         (res) => res.json()
//     );

//     return posts.map((post) => ({
//         slug: post.slug,
//     }));
// }

export default async function BlogPostPage({params}: Props) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false
            }
        }
    }
    const post = await fetch(`http://localhost:3000/api/posts?targetPostId=${params.id}`, {cache: 'no-store'})
    .then((res) => res.json());
    const author = await fetch(`http://localhost:3000/api/users?targetUserId=${post.userId}`)
    .then((res) => res.json());
    const currentUser = await await fetch(`http://localhost:3000/api/users?targetUserEmail=${session.user?.email}`, {cache: 'no-store'})
    .then((res) => res.json());

    const isAuthor = author.id === currentUser.id 

    return (
        <div className="grid-rows-2">
            {isAuthor ? 
                <div>
                    <EditPostForm user={currentUser} post={post}></EditPostForm>
                    <DeleteBlogPostButton postId={post.id}/>
                </div> 
                : null
            }
            <div>
                <BlogCard key={post} {...post}/>
            </div>
        </div>
    );
}