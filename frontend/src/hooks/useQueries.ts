import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, CartItem, WishlistItem, Review, Category } from '../backend';

export function useProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.filterProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useSearchProducts(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchText],
    queryFn: async () => {
      if (!actor || !searchText) return [];
      return actor.searchProducts(searchText);
    },
    enabled: !!actor && !isFetching && searchText.length > 0,
  });
}

export function useCart() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const cartQuery = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, weight, quantity }: { productId: bigint; weight: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addToCart(productId, weight, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    cart: cartQuery.data || [],
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    clearCart: clearCartMutation.mutate,
    isClearingCart: clearCartMutation.isPending,
  };
}

export function useWishlist() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWishlist();
    },
    enabled: !!actor && !isFetching,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async ({ productId, weight }: { productId: bigint; weight: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addToWishlist(productId, weight);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async ({ productId, weight }: { productId: bigint; weight: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.removeFromWishlist(productId, weight);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return {
    wishlist: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
}

export function useReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', 'overall'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOverallReviews();
    },
    enabled: !!actor && !isFetching,
  });
}
