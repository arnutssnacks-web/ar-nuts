import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import type { CartItem, Product } from '../backend';

interface WhatsAppOrderButtonProps {
  cartItems: CartItem[];
  products: Product[];
  totalAmount: number;
}

export default function WhatsAppOrderButton({ cartItems, products, totalAmount }: WhatsAppOrderButtonProps) {
  const handleWhatsAppOrder = () => {
    let message = 'Hello! I would like to place an order:\n\n';
    
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        message += `${product.name} - ${Number(item.weight)}g x ${Number(item.quantity)}\n`;
      }
    });
    
    message += `\nTotal Amount: ₹${totalAmount}`;
    
    const phoneNumber = '919345285169';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppOrder}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      size="lg"
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Order via WhatsApp
    </Button>
  );
}
