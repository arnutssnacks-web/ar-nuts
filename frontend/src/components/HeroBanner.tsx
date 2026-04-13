export default function HeroBanner() {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Healthy Snacks,
            <br />
            <span className="text-gold">Premium Quality</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Discover our selection of premium nuts, dry fruits, and seeds for a healthier you.
          </p>
          <a
            href="/products"
            className="inline-block bg-gold hover:bg-gold/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
}
