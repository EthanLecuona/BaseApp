import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import ProductCard from "./components/ProductCard";
import { type Product } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";


export default async function ProductPage() {
    const session = await getServerSession(authOptions)
    if(!session) {
        redirect('api/auth/sign-in');
    }

    const products = await fetch('http://localhost:3000/api/product', {
        method: "GET",
        headers: {
            "content-type": "application/json"
        },
        cache: "no-store"
    })
    .then((res) => res.json());
    if(!products) {
        return (
            <div className="flex flex-col justify-center items-center pt-[80px]">
                <h1 text-center>Product Page</h1>
                <p>Get shirts that you need!</p>
                <ScrollArea className="w-11/12 h-full rounded-md border p-4">
                    <div className="w-full">
                        <div className="grid grid-cols-4 gap-2 justify-items-center py-8">
                            <h1>There are sadly no products yet!</h1>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        )  
    }

    return (
        <div className="flex flex-col justify-center items-center pt-[80px]">
            <h1 className="m-2 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Product Page
            </h1>
            <div className="flex justify-center items-center w-full h-[700px]">
                <ScrollArea className="w-full h-full rounded-md border">
                    <div className="w-full">
                        <div className="grid grid-cols-4 gap-2 justify-items-center py-8">
                            {products.map((product: Product) => {
                                return <ProductCard key={product.id} {...product}/>    
                            })}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}