export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  refresh_token_expires_in?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
}

export interface User {
  id: string;
  name?: string;
  bio?: string;
  dob?: Date;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  accounts: Account[];
  following: Follows[];
  followedBy: Follows[];
  posts: Post[];
  sessions: Session[];
  cart?: Cart;
}

export interface Follows {
  followerId: string;
  followingId: string;
  follower: User;
  following: User;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  date: Date;
  userId: string;
  user: User;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  description: string;
  reviews: Review[];
  inventoryRecords: Inventory[];
  cartItems: CartItem[];
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  productId: string;
  product: Product;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
  cart: Cart;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}
