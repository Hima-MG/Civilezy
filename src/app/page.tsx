import Hero               from "@/components/sections/Hero";
import Navbar from "@/components/Navbar";
import PainSection         from "@/components/sections/PainSection";
import SolutionSection     from "@/components/sections/SolutionSection";
import LevelsSection       from "@/components/sections/LevelsSection";
import GameArenaSection    from "@/components/sections/GameArenaSection";
import QuizModesSection from "@/components/sections/QuizModesSection";

import FinalCTASection from "@/components/sections/FinalCTASection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ComparisonSection from "@/components/sections/Comparisonsection";
import DepartmentSection from "@/components/sections/Departmentsection";
import Footer from "@/components/sections/Footer";
import TickerSection from "@/components/sections/TickerSection";

import StickyCTA from "@/components/sections/StickyCTA";


export default function Home() {
  return (
    <>
      <Hero />
      <Navbar />
      <TickerSection />
      <PainSection />
      <SolutionSection />
      <LevelsSection />
      <GameArenaSection />
      <QuizModesSection />
      <ComparisonSection />
     
     
      <TestimonialsSection />
      <DepartmentSection />
      <FinalCTASection />
      <Footer />
      
      <StickyCTA />
      
    </>
  );
}