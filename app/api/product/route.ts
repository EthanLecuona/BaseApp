import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";


export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    try{
        if(id) {
            const product = await prisma.product.findUnique({
                where: {
                    id: id
                },
                include: {
                    reviews: true
                }
            });
            return NextResponse.json(product);
        }
        else { 
            const products = await prisma.product.findMany();
            return NextResponse.json(products);
        }
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product" }), { status: 500 }); 
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response(JSON.stringify({ error: "You must be logged in to add a product" }), { status: 401 }); 
    }

    const targetProductId = request.nextUrl.searchParams.get('targetProductId');
    if(!targetProductId) {
        return new Response(JSON.stringify({ error: "No product id was provided" }), { status: 400 });
    }

    try {
        const data = await request.json();
        if(!data){
            return new Response(JSON.stringify({ error: "No data was provided" }), { status: 400 });
        }
        const product = await prisma.product.update({
            where: {
                id: targetProductId
            },
            data
        });
        return NextResponse.json(product);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product" }), { status: 500 }); 
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response(JSON.stringify({ error: "You must be logged in to add a product" }), { status: 401 }); 
    }

    const targetProductId = request.nextUrl.searchParams.get('targetProductId');
    if(!targetProductId) {
        return new Response(JSON.stringify({ error: "No product id was provided" }), { status: 400 });
    }

    try {
        const product = await prisma.product.delete({
            where: {
                id: targetProductId
            },
        });
        return NextResponse.json(product);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product" }), { status: 500 }); 
    }
}