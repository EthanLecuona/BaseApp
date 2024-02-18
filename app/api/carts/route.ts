import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(request: NextRequest) {
    const data = await request.json();
    const productId = data.productId;
    const quantity = data.quantity;
    const email = data.email;
    try{
        const currentUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if(!currentUser) {
            return new Response(JSON.stringify({ error: "You must be logged in to add a product to your cart" }), { status: 401 });
        }

       

        let cart = await prisma.cart.findUnique({
            where: {
                userId: currentUser.id
            }
        })
        if (cart == null || cart == undefined) {
            cart = await prisma.cart.create({
                data: {
                    userId: currentUser.id,
                    items: {
                        create: [{
                            quantity: quantity,
                            product: {
                                connect: {
                                    id: productId
                                }
                            }
                        }],
                        
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        } 
        else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id, 
                    quantity: quantity,
                    productId: productId,
                },
            });
            
            cart = await prisma.cart.findUnique({
                where: {
                    id: cart.id,
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        }
        
        return NextResponse.json(cart);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product to your cart" }), { status: 500 }); 
    }
}

export async function GET(request: NextRequest) {
    const email = request.nextUrl.searchParams.get('email');
    if(!email) {
        return new Response(JSON.stringify({ error: "No email was provided." }), { status: 401 });
    }

    try{
        const currentUser = await prisma.user.findUnique({
            where: {
                email: email
            },
        }); 
        if(!currentUser) {
            return new Response(JSON.stringify({ error: "You must be logged in." }), { status: 401 });
        }

        const cart = await prisma.cart.findUnique({
            where: {
                userId: currentUser.id
            },
            include: {
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        return NextResponse.json(cart);
      
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product to your cart" }), { status: 500 }); 
    }
}


export async function DELETE(request: NextRequest) {
    const data = await request.json()
    const email = data.email;
    const cleaAll: boolean = data.clearAll;
    const clearItemId = request.nextUrl.searchParams.get('clearItem');
    if(!email) {
        return new Response(JSON.stringify({ error: "No email was provided." }), { status: 401 });
    }
    const currentUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if(!currentUser) {
        return new Response(JSON.stringify({ error: "Cannot find user." }), { status: 401 });
    }

    try {
        let cart = await prisma.cart.findUnique({
            where: {
                userId: currentUser.id
            }
        })
        if(!cart) {
            return new Response(JSON.stringify({ error: "No cart found." }), { status: 401 });
        }
        if(cleaAll) {
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart?.id
                }
            })
        }
        if(clearItemId) {
            await prisma.cartItem.delete({
                where: {
                    id: clearItemId
                }
            })
        }
        cart = await prisma.cart.findUnique({
            where: {
                userId: currentUser.id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return NextResponse.json(cart);
    }
    catch(error) {
        return new Response(JSON.stringify({ error: "An error occurred while adding the product to your cart" }), { status: 500 }); 
    }
}

// export async function PUT(request: NextRequest) {

//     const targetProductId = request.nextUrl.searchParams.get('targetProductId');
//     if(!targetProductId) {
//         return new Response(JSON.stringify({ error: "No product id was provided" }), { status: 400 });
//     }

//     try {
//         const data = await request.json();
//         if(!data){
//             return new Response(JSON.stringify({ error: "No data was provided" }), { status: 400 });
//         }
//         const product = await prisma.product.update({
//             where: {
//                 id: targetProductId
//             },
//             data
//         });
//         return NextResponse.json(product);
//     }
//     catch(error) {
//         return new Response(JSON.stringify({ error: "An error occurred while adding the product to your cart" }), { status: 500 }); 
//     }
// }



 // let test = await prisma.cart.upsert({
        //     where: {
        //         userId: currentUser.id
        //     },
        //     create: {
        //         userId: currentUser.id,
        //         items: {
        //             create: [{
        //                 quantity: quantity,
        //                 product: {
        //                     connect: {
        //                         id: productId
        //                     }
        //                 }
        //             }],

        //         },
        //     },
        //     update: {
        //         items: {
        //             upsert: [{
        //                 where: {
        //                     productId: productId,
                            
        //                 },
        //                 create: {
        //                     quantity: quantity,
        //                     product: {
        //                         connect: {
        //                             id: productId
        //                         }
        //                     }
        //                 }, 
        //                 update: {
        //                     quantity: {
        //                         increment: quantity
        //                     }
        //                 }
        //             }]
        //         },
        //     },
        // })