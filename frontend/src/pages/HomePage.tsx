import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import BestSellers from '../components/BestSellers';
import CustomerReviews from '../components/CustomerReviews';
import WhyChooseUs from '../components/WhyChooseUs';

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <CategorySection />
      <FeaturedProducts />
      <BestSellers />
      <CustomerReviews />
      <WhyChooseUs />
    </div>
  );
}
