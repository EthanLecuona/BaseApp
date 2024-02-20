"use client";
import { useState } from "react";
import Link from "next/link";

import CartPopup from "./CartPopup";
import { type Cart } from "@/lib/types";
import { useCart } from "@/store/store";
import { ShoppingCart } from "lucide-react";

export default function Header({
  clearCartAction,
}: {
  clearCartAction: () => Promise<Cart>;
}) {
  const cart = useCart();
  const [showCart, setShowCart] = useState(false);
  
  return (
    <header className="mt-[67px] fixed top-0 left-0 right-0 z-10 mx-2 flex items-center justify-between p-4 bg-zinc-800 bg-opacity-90 mb-10 shadow-sm shadow-black rounded-b-2xl">
      <Link href="/">
        <h1 className="text-3xl font-bold leading-10 text-gray-100">
          BaseApp Store
        </h1>
      </Link>

      <div
        className="flex items-center justify-center w-10 h-10 bg-stone-700 rounded-full"
        onClick={() => {
          setShowCart(!showCart);
        }}
      >
        <span className="text-xl font-bold leading-10 text-gray-100 flex flex-row justify-center items-center">
        <ShoppingCart size={20} className="m-1"/>{cart?.items?.length ?? 0}
        </span>
        {showCart && (<CartPopup clearCartAction={clearCartAction} />)}
      </div>
    </header>
  );
}
