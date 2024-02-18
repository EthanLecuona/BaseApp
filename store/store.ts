import { type Cart, type Review } from '@/lib/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';


//Reviews
export interface ReviewsState {
    reviews: Review[] | null
}

const initialReviews: ReviewsState = {
    reviews: null
}

const reviewsSlice = createSlice({
    name: "reviews",
    initialState: initialReviews,
    reducers: {
        setReviews: (state, action: PayloadAction<Review[]>) => {
            state.reviews = action.payload;
        },
    },
});




//Cart
export interface CartState {
    cart: Cart;
}

const initialState: CartState = {
    cart: {
        items: [],
        userId: "",
        id: ""
    },
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<Cart>) => {
            state.cart = action.payload;
        }
    }
});




//Store
export const createStore = () =>
configureStore({
    reducer: {
        cart: cartSlice.reducer,
        reviews: reviewsSlice.reducer,
    },
});

export const { setCart } = cartSlice.actions;
export const { setReviews } = reviewsSlice.actions;

export type StoreType = ReturnType<typeof createStore>;
export type RootState = ReturnType<StoreType["getState"]>;
export type AppDispatch = StoreType["dispatch"];

export const useCart = () => useSelector((state: RootState) => state.cart.cart);
export const useReviews = () => useSelector((state: RootState) => state.reviews.reviews);