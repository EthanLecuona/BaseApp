'use client';
import React, { createContext, useState } from 'react';
import { type Review } from '@/lib/types';
import Reviews from './Reviews';

const useReviewsState = (initialReviews: Review[]) => useState<Review[]>(initialReviews);

export const ReviewsContext = createContext<ReturnType<typeof useReviewsState> | null>(null);

export const useReviews = () => {
    const reviews = React.useContext(ReviewsContext);
    if(!reviews){
        throw new Error("useReview must be used within a ReviewProvider")
    }
    return reviews;
}

const ReviewsProvider = ({
    reviews: initialReviews,
    children
}: {
    reviews: Review[];
    children: React.ReactNode;
}) => {
    const [reviews, setReviews] = useReviewsState(initialReviews);
    return (
        <ReviewsContext.Provider value={[reviews, setReviews]}>
            {children}
        </ReviewsContext.Provider>
    )
}

export default ReviewsProvider;