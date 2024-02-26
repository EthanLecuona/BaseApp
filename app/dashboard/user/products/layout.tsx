import { getServerSession } from "next-auth";
import Header from "./components/Header";
import { authOptions } from "@/lib/authOptions";
// import StoreProvider from "@/lib/store/StoreProvider";
import { redirect } from "next/navigation";
import { type Cart } from "@/lib/types";
import CartProvider from "@/lib/store/CartProvider";
import CartReviewProvider from "@/lib/store/CartProvider";

interface ProductsLayoutProps {
  children: React.ReactNode
}

export default async function ProductsLayout({ children }: ProductsLayoutProps) {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect('api/auth/sign-in');
  }
  
  const clearCartAction = async () => {
    "use server";
    const data = {
      email: session?.user?.email,  
      clearAll: true  
    }
    return await fetch(`http://localhost:3000/api/carts?email=${session?.user?.email}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        // "Authorization": `Bearer ${session.accessToken}`
      },
      body: JSON.stringify(data)
    })
    .then((res) => res.json())
  }

  let cart: Cart = await fetch(`http://localhost:3000/api/carts?email=${session?.user?.email}`, {
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
  })
  .then((res) => res.json());
  
  if(cart == null || cart == undefined) {
    cart = {
      id: "",
      userId: "",
      items: []
    }
  }

  return (
    <CartProvider cart={cart}>
      <div>
        <Header clearCartAction={clearCartAction}/>
        {children}
      </div>  
    </CartProvider>

  )
  
}
