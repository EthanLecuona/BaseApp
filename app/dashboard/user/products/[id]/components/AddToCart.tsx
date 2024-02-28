"use client";
import { type Cart } from "@/lib/types";
import { useCart } from "@/lib/store/CartProvider";
// import { useDispatch } from "react-redux";

export default function AddToCart({
  addToCartAction,
}: {
  addToCartAction: () => Promise<Cart>;
}) {
  // const dispatch = useDispatch();
  const setCart = useCart()!((state) => state.setCart)
  
  return (
    <button
      className="mt-6 px-8 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg"
      onClick={async () => {
        setCart(await addToCartAction());
      }}
    >
      Add To Cart
    </button>
  );
}
