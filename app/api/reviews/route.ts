import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const data = await request.json();
    const productId = data.productId;
    const text = data.text;
    const rating = data.rating;
    console.log(data)
    try {
        await prisma.review.create({
            data: {
                productId: productId,
                text: text,
                rating: rating,
            }
        })
        const reviews = await prisma.review.findMany({
            where: {
                productId: productId
            }
        })
        return NextResponse.json(reviews);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product to your cart" }), { status: 500 }); 
    }
}