'use client';
import { useState, createContext, useContext } from "react";
import { create } from "zustand"
import { Review } from "../types";

const createStore = (reviews: Review[]) => 
create<{
    reviews: Review[];
    setReviews: (review: Review[]) => void;
}>((set) => ({
    reviews,
    setReviews(reviews: Review[]) {
        set({reviews});
    },
}));

const ReviewContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useReviews = () => {
    if(!ReviewContext)
        throw new Error("useCart must be used within a CartProvider");
    return useContext(ReviewContext);
};

const ReviewProvider = ({
    reviews,
    children
}: {
    reviews: Review[];
    children: React.ReactNode;
}) => {
    const [store] = useState(() => createStore(reviews))
    return <ReviewContext.Provider value={store}>{children}</ReviewContext.Provider>;
}

export default ReviewProvider;