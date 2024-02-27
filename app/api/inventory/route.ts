import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const data = await request.json();
    if(!data) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product to the inventory" }), { status: 500 }); 
    }
    try{
        const record = await prisma.inventory.create({
            data: {
                quantity: Number(data.quantity),
                product: {
                    create: {
                        name: data.name,
                        description: data.description,
                        price: Number(data.price),
                        image: data.image
                    }
                }
            },
            include: {
                product: true
            }
        })
        return NextResponse.json(record);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "!!An error occurred while adding the product to the inventory" }), { status: 500 }); 
    }
}

export async function GET(request: NextRequest) {
    try{
        const inventory = await prisma.inventory.findMany({
            orderBy: {
                id: 'asc'
            },
            include: {
                product: {
                    include: {
                        reviews: true
                    }
                }
            }
        });
        return NextResponse.json(inventory);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product" }), { status: 500 }); 
    }
}


export async function PUT(request: NextRequest) {
    const data = await request.json();
    if(!data) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product to the inventory" }), { status: 500 }); 
    }
    try{
        const record = await prisma.inventory.update({
            where: {
                id: data.id
            },
            data: {
                quantity: Number(data.quantity),
                product: {
                    update: {
                        name: data.name,
                        description: data.description,
                        price: Number(data.price),
                        image: data.image
                    }
                }
            },
            include: {
                product: true
            }
        })
        return NextResponse.json(record);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "!!An error occurred while adding the product to the inventory" }), { status: 500 }); 
    }
}

export async function DELETE(request: NextRequest) {
    const data = await request.json();
    if(!data) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product to the inventory" }), { status: 500 }); 
    }
    
    try{
        const idsToDelete = data.map((item: any) => item.id);
        const nameToDelete = data.map((item: any) => item.product.name);
        await prisma.inventory.deleteMany({
            where: {
                id: {
                    in: idsToDelete
                }
            },
        })
        return NextResponse.json(nameToDelete);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "!!An error occurred while adding the product to the inventory" }), { status: 500 }); 
    }
}