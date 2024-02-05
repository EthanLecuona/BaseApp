import BlogCard from "@/components/BlogCard/BlogCard";
import { CreatePostForm } from "@/components/BlogCard/BlogPostDrawer";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area";



export default async function BlogPage(){
    const session = await getServerSession(authOptions);
    if(!session) {
        redirect('api/auth/signin');
    }
    const allPosts = await fetch('http://localhost:3000/api/posts', {cache: 'no-store'})
    .then((res) => res.json());

    const currentUser = await fetch(`http://localhost:3000/api/users?targetUserEmail=${session.user?.email}`, {cache: 'no-store'})
    .then((res) => res.json());

    const myPosts = await fetch(`http://localhost:3000/api/posts?userId=${currentUser.id}`, {cache: 'no-store'})
    .then((res) => res.json());


    if(allPosts == null || allPosts == undefined || allPosts.length == 0){
        return (
            
            <Tabs defaultValue="allPosts">
                <TabsList className="grid w-screen grid-cols-2">
                    <TabsTrigger value="allPosts">All Posts</TabsTrigger>
                    <TabsTrigger value="myPosts">My Posts</TabsTrigger>
                </TabsList>
                <div className="w-screen flex justify-center my-2">
                    <CreatePostForm user={currentUser}/>
                </div>
            
                <TabsContent value="allPosts">
                
                    <div className="w-screen">
                        <h1>There are no posts yet!</h1>
                    </div>
                </TabsContent>
                <TabsContent value="myPosts">
                    <div className="w-screen">
                        <h1>There are no posts yet!</h1>
                    </div>
                </TabsContent>
            </Tabs>
        )
    }
    
    return (
        <Tabs defaultValue="allPosts">
            <TabsList className="grid w-screen grid-cols-2">
                <TabsTrigger value="allPosts">All Posts</TabsTrigger>
                <TabsTrigger value="myPosts">My Posts</TabsTrigger>
            </TabsList>
            <div className="w-auto flex justify-center my-2">
                <CreatePostForm user={currentUser}/>
            </div>
            <TabsContent value="allPosts">
            <div className="flex justify-center items-center w-full h-[700px]">
                <ScrollArea className="w-11/12 h-full rounded-md border">
                    <div className="grid grid-cols-4 gap-2 justify-items-center py-4">
                        {allPosts.map((post : any) => {
                            return <BlogCard key={post.id} {...post}/>
                        })}
                    </div>
                </ScrollArea>
            </div>
            </TabsContent>
            <TabsContent value="myPosts">
                <div className="flex justify-center items-center w-full h-[700px]">
                    <ScrollArea className="w-11/12 h-full rounded-md border">
                        <div className="w-full">
                            <div className="grid grid-cols-4 gap-2 justify-items-center py-8">
                                {myPosts.map((post : any) => {
                                    return <BlogCard key={post.id} {...post}/>
                                })}
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </TabsContent>

        </Tabs>
    )
}