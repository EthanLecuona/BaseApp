"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type Product } from "@/lib/types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "price",
        header: "Price $"
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorKey: "reviews",
        header: "Reviews"
    },
]
