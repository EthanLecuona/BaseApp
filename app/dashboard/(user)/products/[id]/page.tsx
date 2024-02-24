import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import Reviews from "./components/Reviews";
import AddToCart from "./components/AddToCart";
import ProductCard from "../components/ProductCard";
import AverageRating from "./components/AverageRating";
import { Cart, Review } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ReviewProvider from "@/lib/store/ReviewProvider";

export const dynamic = "force-dynamic";

export default async function ProductDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect('api/auth/sign-in');
  }

  const product = await fetch(`http://localhost:3000/api/product?id=${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    cache: "force-cache"
  })
  .then((res) => res.json());
  
  const products = await fetch('http://localhost:3000/api/product', {
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    cache: "force-cache"
  })
  .then((res) => res.json());
  
  if (!product) {
    notFound();
  }
  
  const addToCartAction = async () => {
    "use server";
    let body = {
      productId: id,
      quantity: 1,
      email: session?.user?.email
    };
    const response = await fetch('http://localhost:3000/api/carts', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json());
    
    const cart: Cart = await response;
    return cart;
  };


  const addReviewAction = async (text: string, rating: number) => {
    "use server";

    let body = {
      productId: id,
      text: text,
      rating: rating
    }
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    const reviews: Review[] = await response;
    revalidatePath(`/products/${id}`);

    return reviews;
  };

  return (
    <ReviewProvider reviews={product.reviews}>
      <div className="flex flex-col items-center mt-[80px]">
        <div className="flex flex-wrap w-1/2">
          <div className="w-1/2 md:w-1/2">
            <Image
              className="aspect-[2/2] rounded-md object-cover"
              src={product.image ?? ""}
              alt={`${product.name} image`}
              width={500}
              height={500}
            />
          </div>
          <div className="w-full md:w-1/2 p-5">
            <h1 className="text-3xl font-bold leading-10">
              {product.name}
            </h1>
            <div className="my-1 text-md leading-5">
              {product.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div className="mt-1 text-sm leading-5 text-gray-700 font-light italic">
              {product.description}
            </div>
            <AverageRating />
            <div className="flex justify-center">
              <AddToCart addToCartAction={addToCartAction} />
            </div>
          </div>
        </div>
        
        <div className="w-1/2">
          <Reviews addReviewAction={addReviewAction} />
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <h1 className="text-2xl font-bold mt-2 -mb-2">Related Products</h1>
          <ul role="list" className="flex flex-row flex-wrap m-2">
            {products
              .filter((p: any) => p.id !== +id)
              .map((product: any) => (
                <li key={product.id} className="md:w-1/5">
                  <ProductCard {...product} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </ReviewProvider>
  );
}
