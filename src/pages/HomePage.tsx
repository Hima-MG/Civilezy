import { Helmet } from "react-helmet-async";
import Hero from "@/components/sections/Hero";
import AppDownloadSection from "@/components/sections/AppDownloadSection";
import TickerSection from "@/components/sections/TickerSection";
import PainSection from "@/components/sections/PainSection";
import SolutionSection from "@/components/sections/SolutionSection";
import LevelsSection from "@/components/sections/LevelsSection";
import GameArenaSection from "@/components/sections/GameArenaSection";
import QuizModesSection from "@/components/sections/QuizModesSection";
import ComparisonSection from "@/components/sections/Comparisonsection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Civilezy | Kerala's #1 Civil Engineering PSC Platform</title>
      </Helmet>
      <Hero />
      <AppDownloadSection />
      <TickerSection />
      <PainSection />
      <SolutionSection />
      <LevelsSection />
      <GameArenaSection />
      <QuizModesSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </>
  );
}
