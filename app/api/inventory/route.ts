import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
    const data = await request.json();
    const productId = data.productId;
    const quantity = data.quantity;

    try{
        const record = await prisma.inventory.create({
            data: {
                productId: productId,
                quantity: quantity,
            },
            include: {
                product: true
            }
        })
        return NextResponse.json(record);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product" }), { status: 500 }); 
    }
}

export async function GET(request: NextRequest) {
    const inventoryId = request.nextUrl.searchParams.get('inventoryId');
    try{
        if(inventoryId) {
            const inventoryItem = await prisma.inventory.findUnique({
                where: {
                    id: inventoryId
                },
                include: {
                    product: true
                }
            });
            return NextResponse.json(inventoryItem);
        } else {
            const inventory = await prisma.inventory.findMany();
            return NextResponse.json(inventory);
        }
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product" }), { status: 500 }); 
    }
}