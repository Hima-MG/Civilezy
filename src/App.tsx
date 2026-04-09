import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StickyCTA from "@/components/sections/StickyCTA";
import HomePage from "@/pages/HomePage";
import BlogListPage from "@/pages/BlogListPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import GameArenaPage from "@/pages/GameArenaPage";
import PricingPage from "@/pages/PricingPage";
import RedirectPage from "@/pages/RedirectPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function App() {
  return (
    <>
      <Navbar />
      <main
        className="overflow-x-hidden"
        style={{ paddingTop: "70px", paddingBottom: "96px" }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/game-arena" element={<GameArenaPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<RedirectPage url={EXTERNAL_URLS.about} />} />
          <Route path="/login" element={<RedirectPage url={EXTERNAL_URLS.login} />} />
          <Route path="/terms" element={<RedirectPage url={EXTERNAL_URLS.terms} />} />
          <Route path="/privacy-policy" element={<RedirectPage url={EXTERNAL_URLS.privacy} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <StickyCTA />
    </>
  );
}
