import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart, useWishlist } from '../hooks/useQueries';
import type { Product } from '../backend';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedWeight, setSelectedWeight] = useState(
    product.weightOptions[0]?.weight.toString() || ''
  );

  const isInWishlist = wishlist.some(
    (item) => item.productId === product.id && item.weight.toString() === selectedWeight
  );

  const selectedWeightOption = product.weightOptions.find(
    (opt) => opt.weight.toString() === selectedWeight
  );

  const handleAddToCart = () => {
    if (!selectedWeight) {
      toast.error('Please select a weight');
      return;
    }
    addToCart(
      {
        productId: product.id,
        weight: BigInt(selectedWeight),
        quantity: BigInt(1),
      },
      {
        onSuccess: () => {
          toast.success('Added to cart!');
        },
        onError: () => {
          toast.error('Failed to add to cart');
        },
      }
    );
  };

  const handleToggleWishlist = () => {
    if (!selectedWeight) {
      toast.error('Please select a weight');
      return;
    }
    if (isInWishlist) {
      removeFromWishlist(
        { productId: product.id, weight: BigInt(selectedWeight) },
        {
          onSuccess: () => {
            toast.success('Removed from wishlist');
          },
        }
      );
    } else {
      addToWishlist(
        { productId: product.id, weight: BigInt(selectedWeight) },
        {
          onSuccess: () => {
            toast.success('Added to wishlist!');
          },
        }
      );
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-muted">
          <img
            src={product.imageUrl || '/assets/generated/category-nuts.dim_300x300.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </Button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <div className="w-full">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="text-2xl font-bold text-gold">
            ₹{selectedWeightOption ? Number(selectedWeightOption.price) : Number(product.price)}
          </div>
          <Select value={selectedWeight} onValueChange={setSelectedWeight}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Weight" />
            </SelectTrigger>
            <SelectContent>
              {product.weightOptions.map((option) => (
                <SelectItem key={option.weight.toString()} value={option.weight.toString()}>
                  {Number(option.weight)}g
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full bg-gold hover:bg-gold/90 text-white"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
