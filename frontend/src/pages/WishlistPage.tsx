import { useNavigate } from '@tanstack/react-router';
import { useWishlist, useProducts, useCart } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, isLoading: isLoadingWishlist, removeFromWishlist } = useWishlist();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { addToCart } = useCart();

  const isLoading = isLoadingWishlist || isLoadingProducts;

  const wishlistWithProducts = wishlist.map((item) => {
    const product = products?.find((p) => p.id === item.productId);
    const weightOption = product?.weightOptions.find((opt) => opt.weight === item.weight);
    return {
      ...item,
      product,
      price: weightOption?.price || product?.price || BigInt(0),
    };
  });

  const handleMoveToCart = (productId: bigint, weight: bigint) => {
    addToCart(
      { productId, weight, quantity: BigInt(1) },
      {
        onSuccess: () => {
          removeFromWishlist({ productId, weight });
          toast.success('Moved to cart!');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Save your favorite products to buy them later!
          </p>
          <Button onClick={() => navigate({ to: '/products' })} className="bg-gold hover:bg-gold/90">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistWithProducts.map((item) => (
          <Card key={`${item.productId}-${item.weight}`}>
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={item.product?.imageUrl || '/assets/generated/category-nuts.dim_300x300.png'}
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{item.product?.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">Weight: {Number(item.weight)}g</p>
              <div className="text-xl font-bold text-gold mb-4">₹{Number(item.price)}</div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gold hover:bg-gold/90"
                  onClick={() => handleMoveToCart(item.productId, item.weight)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFromWishlist({ productId: item.productId, weight: item.weight })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
