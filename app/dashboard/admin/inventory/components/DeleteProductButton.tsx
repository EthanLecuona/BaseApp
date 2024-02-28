'use client';
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useState } from "react";
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
import { toast } from "@/components/ui/use-toast";
import { Inventory } from "@/lib/types";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
    data: Inventory[];
}

export default function DeleteProductButton({data}: DeleteProductButtonProps) {
    const [showAlert, setShowAlert] = useState(false)
    const [isDisabled, setIsDisabled ] = useState()
    const router = useRouter()

    const handleDeleteClick = () => {
        setShowAlert(true)
    }
    const handleCancelDelete = () => {
        setShowAlert(false);
    }
    const handleConfirmDelete = async () => {
        const handleSuccess = (data: any) => {
            toast({
              title: `Updated Successfully: ${data}`,
              description: new Date().toISOString()
            });
        }
        const handleError = (error: any) => {
            toast({
              title: error,
              description: new Date().toISOString()
            });
        }   
        console.log(data)
        await fetch('/api/inventory', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then((data) => {
            if(data) {
                handleSuccess(data)
                router.refresh()
            } else {
                handleError('Failed to delete product(s)')
            }
        })
        
        setShowAlert(false);
    }

    return (
        <div>
            <Button 
            onClick={handleDeleteClick} 
            className="text-center" 
            variant="outline">
                <XCircle className="mr-2"/>
                Delete Product
            </Button>
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently remove products from the inventory.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleCancelDelete()}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleConfirmDelete()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
    )
}