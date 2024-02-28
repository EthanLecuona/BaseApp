'use client';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Inventory } from "@/lib/types"
import Image from "next/image"
import { useState } from "react"
 
interface ViewProductButtonProps {
    inventory: Inventory;
}

export default function ViewProductButton({inventory}: ViewProductButtonProps) {
    const [open, setOpen ] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">View Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Product</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 items-center justify-center">
          <div className="flex flex-col justify-center items-center p-2">
            <Image 
                src={inventory.product.image}
                alt={inventory.product.name}
                height={250}
                width={250}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={inventory.product.name}
              disabled={true}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="username"
              defaultValue={inventory.product.description}
              disabled={true}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              price
            </Label>
            <Input
              id="username"
              defaultValue={inventory.product.price}
              disabled={true}
              type="number"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Quantity
            </Label>
            <Input
              id="username"
              defaultValue={inventory.quantity}
              disabled={true}
              type="number"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col justify-center items-center">
          <Button onClick={() => setOpen(false)} type="submit">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}