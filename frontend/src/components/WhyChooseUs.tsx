import { Card, CardContent } from '@/components/ui/card';

const benefits = [
  {
    title: 'Fresh Stock',
    description: 'We source and deliver only the freshest premium quality products',
    icon: '/assets/generated/icon-fresh.dim_128x128.png',
  },
  {
    title: 'Affordable Price',
    description: 'Best prices in the market without compromising on quality',
    icon: '/assets/generated/icon-price.dim_128x128.png',
  },
  {
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery right to your doorstep',
    icon: '/assets/generated/icon-delivery.dim_128x128.png',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-2 hover:border-gold transition-colors">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <img src={benefit.icon} alt={benefit.title} className="h-20 w-20" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
