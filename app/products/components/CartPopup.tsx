"use client";
import { type Cart } from "@/lib/types";
import { useCart, setCart } from "@/store/store";
import { useDispatch } from "react-redux";

export default function CartPopup({ clearCartAction }: { clearCartAction: () => Promise<Cart>; }) {
  const cart = useCart()
  const dispatch = useDispatch();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center justify-center w-1/2 p-4 bg-white rounded-lg">

        <h2 className="mb-4 text-2xl font-bold leading-10 text-gray-800">
          Your Cart
        </h2>
        {cart.items.length === 0 && (
          <p className="mb-4 text-lg leading-7 text-gray-600">
            You have 0 items in your cart.
          </p>
        )}

        {cart.items.length > 0 && (
          <>
            {cart.items.map((item, index) => (
              <div
                key={index}
                className="flex text-black w-full justify-between"
              >
                <div className="font-bold">{item.product.name}</div>
                <div className="">
                  {item.product.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="flex justify-between w-full">
          <button
            className="mt-6 px-4 py-2 text-lg font-bold text-white bg-green-800 rounded-lg"
            onClick={async () => {
              dispatch(setCart(await clearCartAction()));
            }}
          >
            Clear Cart
          </button>

          <button className="mt-6 px-4 py-2 text-lg font-bold text-white bg-blue-800 rounded-lg">
            Checkout
          </button>
        </div>


      </div>
    </div>
  );
}
