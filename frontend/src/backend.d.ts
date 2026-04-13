import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    inStock: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: Category;
    price: bigint;
    weightOptions: Array<WeightOption>;
}
export interface WeightOption {
    weight: bigint;
    price: bigint;
}
export interface CartItem {
    weight: bigint;
    productId: bigint;
    quantity: bigint;
}
export interface Review {
    content: string;
    authorEmail: string;
    productId: bigint;
    author: string;
    rating: bigint;
}
export interface WishlistItem {
    weight: bigint;
    productId: bigint;
}
export enum Category {
    nuts = "nuts",
    dryFruits = "dryFruits",
    seeds = "seeds"
}
export interface backendInterface {
    addToCart(productId: bigint, weight: bigint, quantity: bigint): Promise<void>;
    addToWishlist(productId: bigint, weight: bigint): Promise<void>;
    clearCart(): Promise<void>;
    filterProductsByCategory(category: Category): Promise<Array<Product>>;
    filterProductsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Product>>;
    filterProductsByWeight(weight: bigint): Promise<Array<Product>>;
    getCart(): Promise<Array<CartItem>>;
    getCategories(): Promise<Array<Category>>;
    getOverallReviews(): Promise<Array<Review>>;
    getProductDetails(productId: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getReviews(productId: bigint): Promise<Array<Review>>;
    getWishlist(): Promise<Array<WishlistItem>>;
    removeFromWishlist(productId: bigint, weight: bigint): Promise<void>;
    searchProducts(searchText: string): Promise<Array<Product>>;
}
