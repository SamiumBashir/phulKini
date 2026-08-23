import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedBouquets from '@/components/home/FeaturedBouquets';
import OccasionGrid from '@/components/home/OccasionGrid';
import CustomBouquetBanner from '@/components/home/CustomBouquetBanner';
import ExperienceSection from '@/components/home/ExperienceSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategorySection />
      <FeaturedBouquets />
      <CustomBouquetBanner />
      <OccasionGrid />
      <ExperienceSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
