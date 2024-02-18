'use client';
import { useRouter } from "next/navigation";
import { toast } from "../../../components/ui/use-toast";
import { Button } from "../../../components/ui/button";
import { Trash2 } from "lucide-react";

export default async function DeleteBlogPostButton({postId}: any) {
    const router = useRouter();
    const handleDelete = async () => {
        const handleSuccess = () => {
            toast({
                title: 'Successfully deleted post',
                content: new Date().toISOString()
            })
            router.push('/blog')
            router.refresh()
        }
        const handleError = () => {
            toast({
                title: 'Failed to delete post',
                content: new Date().toISOString()
            })
        }
        try {
            await fetch(`http://localhost:3000/api/posts?targetPostId=${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((data) => {
                if(data){
                    handleSuccess()
                } else {
                    handleError()
                }
            })
        } catch (error) {
            handleError()
        }
    }
    return (
        <Button onClick={handleDelete} className="w-full mt-6"><Trash2 size={16} />Delete Post</Button>
    )
}