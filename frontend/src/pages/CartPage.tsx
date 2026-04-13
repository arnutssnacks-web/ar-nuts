import { useNavigate } from '@tanstack/react-router';
import { useCart, useProducts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import WhatsAppOrderButton from '../components/WhatsAppOrderButton';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading: isLoadingCart, clearCart, isClearingCart } = useCart();
  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const isLoading = isLoadingCart || isLoadingProducts;

  const cartWithProducts = cart.map((item) => {
    const product = products?.find((p) => p.id === item.productId);
    const weightOption = product?.weightOptions.find((opt) => opt.weight === item.weight);
    return {
      ...item,
      product,
      price: weightOption?.price || product?.price || BigInt(0),
    };
  });

  const totalAmount = cartWithProducts.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some delicious nuts, dry fruits, and seeds to get started!
          </p>
          <Button onClick={() => navigate({ to: '/products' })} className="bg-gold hover:bg-gold/90">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map((item) => (
            <Card key={`${item.productId}-${item.weight}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.imageUrl || '/assets/generated/category-nuts.dim_300x300.png'}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product?.name}</h3>
                    <p className="text-sm text-muted-foreground">Weight: {Number(item.weight)}g</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-gold">₹{Number(item.price)}</span>
                      <span className="text-muted-foreground">Qty: {Number(item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => clearCart()}
            disabled={isClearingCart}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isClearingCart ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-gold">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-gold hover:bg-gold/90"
                size="lg"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
              </Button>
              <WhatsAppOrderButton
                cartItems={cart}
                products={products || []}
                totalAmount={totalAmount}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
