import Hero                    from "@/components/sections/Hero";
import TickerSection           from "@/components/sections/TickerSection";
import PainSection             from "@/components/sections/PainSection";
import SolutionSection         from "@/components/sections/SolutionSection";
import LevelsSection           from "@/components/sections/LevelsSection";
import RankAchievementsSection from "@/components/sections/RankAchievementsSection";
import FounderSection          from "@/components/sections/FounderSection";
import GameArenaSection        from "@/components/sections/GameArenaSection";
import ComparisonSection       from "@/components/sections/ComparisonSection";
import TestimonialsSection     from "@/components/sections/TestimonialsSection";
import FeaturedEbooks          from "@/components/sections/FeaturedEbooks";
import FinalCTASection         from "@/components/sections/FinalCTASection";
import Footer                  from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <TickerSection />
      <PainSection />
      <SolutionSection />
      <LevelsSection />
      <RankAchievementsSection />
      <FounderSection />
      <GameArenaSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FeaturedEbooks />
      <FinalCTASection />
      <Footer />
    </>
  );
}
