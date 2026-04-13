import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    name: 'Nuts',
    image: '/assets/generated/category-nuts.dim_300x300.png',
    value: 'nuts',
  },
  {
    name: 'Dry Fruits',
    image: '/assets/generated/category-dryfruits.dim_300x300.png',
    value: 'dryFruits',
  },
  {
    name: 'Seeds',
    image: '/assets/generated/category-seeds.dim_300x300.png',
    value: 'seeds',
  },
];

export default function CategorySection() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate({ to: '/products', search: { category } });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.value}
              className="cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-gold"
              onClick={() => handleCategoryClick(category.value)}
            >
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-white text-2xl font-bold p-6">{category.name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
