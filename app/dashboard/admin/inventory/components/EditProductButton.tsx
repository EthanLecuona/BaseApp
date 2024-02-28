'use client';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Plus } from "lucide-react"
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Inventory, Product } from "@/lib/types"


const FormSchema = z.object({
    name: z
    .string()
    .min(2, {
        message: 'Product name must be longer than 2 characters.'
    })
    .max(30, {
        message: 'Product name must not be longer than 30 characters.'
    }),
    description: z
    .string()
    .min(2, {
        message: 'Product description must be longer than 2 characters.'
    })
    .max(100, {
        message: 'Product description must be shorter than 30 characters.'
    }),
    price: z
    .number()
    .min(1, {
        message: 'Product price must be greater than 1.'
    }),
    quantity: z
    .number()
    .min(1, {
        message: 'Product quantity must be greater than 1.'
    }),
    image: typeof window === 'undefined' ? z.any() : z.instanceof(File),

})

interface EditProductButtonProps {
    inventory: Inventory;
}

export default function EditProductButton({inventory}: EditProductButtonProps) {
    const router = useRouter()
    const [ showAlert, setShowAlert ] = useState(false);
    const [ imagePreview, setImagePreview ] = useState(inventory.product.image);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: inventory.product.name,
            description: inventory.product.description,
            price: inventory.product.price,
            quantity: inventory.quantity,
            image: undefined
        },
        mode: "onChange"
    })

    const handleAddProductClick = () => {
        setShowAlert(true)
    }

    const handleConfirmProduct = async () => {
        setShowAlert(false);
        await onSubmit(form.getValues())
    }
    const handleCancelProduct = async () => {
        setShowAlert(false);
    }


    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        const handleSuccess = (data: any) => {
            toast({
              title: `Updated Successfully: ${data.product.name}`,
              description: new Date().toISOString()
            });
        }
          const handleError = (error: any) => {
            toast({
              title: error,
              description: new Date().toISOString()
            });
        }

        //Image Upload to Amazon S3 Bucket
        const formFile = new FormData();
        let url: any;
        let body: any
        if(values.image instanceof File){
            formFile.append('file', values.image as File);
            formFile.append('name', values.name as string);
            url = await fetch('http://localhost:3000/api/upload?productImage=true', {
                method: 'POST',
                body: formFile
            })
            .then((res) => res.json())
    
            if(!url){
                return
            }
            body = {
                id: inventory.id,
                image: url,
                name: values.name,
                description: values.description,
                price: values.price,
                quantity: values.quantity
            } 
        } else {

            body = {
                id: inventory.id,
                image: values.image,
                name: values.name,
                description: values.description,
                price: values.price,
                quantity: values.quantity
            }
        }

        //Actual Product to be added to inventory.

        await fetch('/api/inventory', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .then((data) => {
            if(data) {
                console.log(data)
                handleSuccess(data);
                router.refresh();
            } else {
                handleError('Add Product Failed.');
            }
        })
    }

    return (
        <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" >Edit Product</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>
              Edit a product to the inventory.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                        <Avatar>
                            <AvatarImage src={imagePreview} />
                        </Avatar>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                        <Input
                            type="file"
                            accept="image/*"
                            // disabled={isLocked}
                            name="image" // assign name
                            ref={ref} // assign ref
                            onChange={(e) => {
                            // Handle file selection
                            if(e.target.files && e.target.files.length > 0){
                                const file = e.target.files[0];
                                if (file) {
                                onChange(file); // Update react-hook-form state
                                const reader = new FileReader();
                                reader.onload = (e:any) => {
                                    setImagePreview(e.target.result); // Update the local state with the image preview URL
                                };
                                reader.readAsDataURL(file);
                                }
                            }
                            }}
                            onBlur={onBlur} // assign onBlur
                        />
                        </FormControl>
                        <FormDescription>
                            Upload product image.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="name">Name</Label>
                            <FormControl>
                                <Input id="name" placeholder="Product name." {...field}/>
                            </FormControl>
                            <FormDescription>
                            Name of the product.
                        </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Product description."
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            Description of the product.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="price">Price</Label>
                            <FormControl>
                                <Input id="price" type="number" placeholder="0" {...field}/>
                            </FormControl>
                            <FormDescription>
                            Price of the product.
                        </FormDescription>
                        </FormItem>
                    )}
                />
                   <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="quantity">Quantity</Label>
                            <FormControl>
                                <Input id="quantity" type="number" placeholder="0" {...field}/>
                            </FormControl>
                            <FormDescription>
                            Quantity of the product.
                        </FormDescription>
                        </FormItem>
                    )}
                />
            </form>
          </Form>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleAddProductClick}>Save Product</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Happy with the changes?</AlertDialogTitle>
                <AlertDialogDescription>
                    Confirming will save changes to this product and update the inventory.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleCancelProduct()}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleConfirmProduct()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </Sheet> 
    )
}