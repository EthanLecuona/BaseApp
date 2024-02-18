"use client";
import { Review } from "@/lib/types";
import { RootState, setReviews, useReviews } from "@/store/store";
import { useRef } from "react";
import { useStore } from "react-redux";

export default function AverageRating({
  reviews: initialReviews,
}: {
  reviews: Review[]
}) {
  const store = useStore<RootState>();
  const initialized = useRef(false);
  if(!initialized.current){
    store.dispatch(setReviews(initialReviews));
    initialized.current = true;
  }
  const reviews = useReviews();
  return (
    <>
      {reviews && reviews?.length && (
        <div className="mt-4 font-light">
          Average Rating:{" "}
          {(
            reviews?.reduce((a, b) => a + b.rating, 0) / reviews?.length
          ).toFixed(1)}
        </div>
      )}
    </>
  );
}
