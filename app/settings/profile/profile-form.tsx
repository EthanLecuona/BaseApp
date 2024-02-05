'use client';

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";


const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z
    .string()
    .max(160)
    .min(4),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})


export function ProfileForm({ user } : any) {
  const router = useRouter()
  const [ isLocked, setIsLocked ] = useState(true)
  const [ showAlert, setShowAlert ] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio ?? '',
      dob: new Date(user.dob),
    },
    mode: "onChange",
  })


  const handleEditClick = () => {
    if (isLocked) {
      setIsLocked(false);
    } else {
      setShowAlert(true);
    }
  };

  
  const handleConfirmChanges = async () => {
    setShowAlert(false); 
    setIsLocked(true); 
    await onSubmit(form.getValues())
  };

  const handleCancelChanges = async () => {
    setShowAlert(false);
    setIsLocked(true);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const handleSuccess = (data: any) => {
        toast({
          title: `Updated Successfully ${data.email}`,
          description: new Date().toISOString()
        });
    }
    const handleError = (error: any) => {
      toast({
        title: error,
        description: new Date().toISOString()
      });
    }

    const body = {
      name: values.name,
      email: values.email,
      bio: values.bio,
      dob: values.dob,
    };

    await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })
    .then((res) => res.json())
    .then((data) => {
      if(data){
        handleSuccess(data)
        router.refresh()
        
      } else {
        handleError('User Update Failed.')
      }
    })
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isLocked} placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                    <Input id="email" disabled={true} {...field}/>
                </FormControl>
                <FormDescription>
                Email addresses are used to log in to your account.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  disabled={isLocked}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={isLocked}
                    variant={"outline"}
                    className={cn("w-[240px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className=" w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={field.value}
                    onSelect={field.onChange}
                    fromYear={1920}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={handleEditClick}>
          {isLocked ? 'Edit Profile' : 'Save Changes'}
        </Button>
      </form>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Happy with your changes?</AlertDialogTitle>
            <AlertDialogDescription>
              These changes will be permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleCancelChanges()}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmChanges()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>

  )
}