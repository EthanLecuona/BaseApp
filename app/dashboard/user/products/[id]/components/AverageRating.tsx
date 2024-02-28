"use client";
import { useReviews } from "@/lib/store/ReviewProvider";


export default function AverageRating() {
  const reviews = useReviews()!((state: any) => state.reviews);
  return (
    <>
      {reviews && reviews?.length && (
        <div className="mt-4 font-light">
          Average Rating:{" "}
          {(
            reviews?.reduce((a: any, b: any) => a + b.rating, 0) / reviews?.length
          ).toFixed(1)}
        </div>
      )}
    </>
  );
}
