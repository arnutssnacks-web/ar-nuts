import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useProducts, useProductsByCategory, useSearchProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Category } from '../backend';

export default function ProductsPage() {
  const search = useSearch({ strict: false }) as { category?: string; q?: string };
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(search.category || 'all');

  const { data: allProducts, isLoading: isLoadingAll } = useProducts();
  const { data: categoryProducts, isLoading: isLoadingCategory } = useProductsByCategory(
    selectedCategory !== 'all' ? (selectedCategory as Category) : null
  );
  const { data: searchResults, isLoading: isSearching } = useSearchProducts(search.q || '');

  useEffect(() => {
    if (search.category) {
      setSelectedCategory(search.category);
    }
  }, [search.category]);

  const isLoading = isLoadingAll || isLoadingCategory || isSearching;

  let displayProducts = allProducts || [];

  if (search.q) {
    displayProducts = searchResults || [];
  } else if (selectedCategory !== 'all') {
    displayProducts = categoryProducts || [];
  }

  // Apply filters
  displayProducts = displayProducts.filter((product) => {
    const price = Number(product.price);
    if (price < priceRange[0] || price > priceRange[1]) return false;

    if (selectedWeights.length > 0) {
      const hasMatchingWeight = product.weightOptions.some((opt) =>
        selectedWeights.includes(Number(opt.weight))
      );
      if (!hasMatchingWeight) return false;
    }

    return true;
  });

  const handleWeightToggle = (weight: number) => {
    setSelectedWeights((prev) =>
      prev.includes(weight) ? prev.filter((w) => w !== weight) : [...prev, weight]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {search.q ? `Search Results for "${search.q}"` : 'Our Products'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Category</h3>
                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Products</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nuts" id="nuts" />
                    <Label htmlFor="nuts">Nuts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dryFruits" id="dryFruits" />
                    <Label htmlFor="dryFruits">Dry Fruits</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="seeds" id="seeds" />
                    <Label htmlFor="seeds">Seeds</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider
                  min={0}
                  max={2000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Weight</h3>
                <div className="space-y-2">
                  {[200, 250, 500].map((weight) => (
                    <div key={weight} className="flex items-center space-x-2">
                      <Checkbox
                        id={`weight-${weight}`}
                        checked={selectedWeights.includes(weight)}
                        onCheckedChange={() => handleWeightToggle(weight)}
                      />
                      <Label htmlFor={`weight-${weight}`}>{weight}g</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[400px]" />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
