'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { title } from "process";
import { useRouter } from 'next/navigation';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useState } from "react";
import { Pen } from "lucide-react";


const FormSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    content: z.string().min(1),
})

export function CreatePostForm({user}: any) {
    const [open, setOpen ] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: '',
            content: ''
        }
    });
    const createPost =  async (values: z.infer<typeof FormSchema>) => {
        const handleSuccess = () => {
            toast({
                title: 'Post Created!',
                description: new Date().toISOString()
            });
            router.refresh();
            setOpen(false);
            form.reset();
        }
        const handleError = () => {
            toast({
                title: 'Post Failed!',
                description: new Date().toISOString()
            });
        }

        const body = {
            title: values.title,
            content: values.content,
            userId: user.id,
            date: new Date().toISOString()
        };

        await fetch('/api/posts',
        {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data){
                handleSuccess()
            } else {
                handleError()
            }
        })

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-fit my-2"><Pen size={16} className="mx-1"/>Create Post</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] flex flex-col justify-center items-center">
          <DialogHeader className="items-center">
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
                <form onSubmit={form.handleSubmit(createPost)} className="w-fit my-2">   
                    <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="title">Title</Label>
                                <FormControl>
                                    <Input id="title" placeholder="Title of my Post" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="content">Content</Label>
                                <FormControl>
                                    <Textarea {...field} id="content" placeholder="Conent of post!"/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    </div>
                    <Button className="w-full mt-6" type="submit">Create Post!</Button>
                </form>
            </Form>
            </DialogContent>
      </Dialog>
    )
}





export function EditPostForm({user, post} : any) {
    const [open, setOpen ] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: post.title,
            content: post.content
        }
    });

    const updatePost = async (values: z.infer<typeof FormSchema>) => {
        const handleSuccess = () => {
            toast({
                title: 'Successfully updated ',
                content: new Date().toISOString()
            })
            setOpen(false)
            router.refresh()
        }
        const handleError = () => {
            toast({
                title: 'Unsuccessfully updated ',
                content: new Date().toISOString()
            })
        }
        const body = {
            id: post.id,
            title: values.title,
            content: values.content,
            userId: user.id,
            date: new Date().toISOString()
        };

        await fetch('/api/posts',
        {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data){
                handleSuccess()
            } else {
                handleError()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className="w-full mt-6"><Pen size={16}/> Edit Post</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] flex flex-col justify-center items-center">
            <DialogHeader className="items-center">
                <DialogTitle>Edit Post</DialogTitle>
                <DialogDescription>
                    Make changes to your post here.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(updatePost)} className="w-fit">   
                    <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="title">Title</Label>
                                <FormControl>
                                    <Input id="title"{...field}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="content">Content</Label>
                                <FormControl>
                                <Textarea {...field} id="content"/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    </div>
                    <Button className="w-full mt-6" type="submit">Edit Post</Button>
                </form>
            </Form>
            </DialogContent>
      </Dialog>
       
    )
}