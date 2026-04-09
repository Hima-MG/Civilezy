import { Helmet } from "react-helmet-async";
import PricingSection from "@/components/sections/PricingSection";

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing — Kerala PSC Civil Engineering Courses | Civilezy</title>
        <meta
          name="description"
          content="Course-based pricing for Kerala PSC Civil Engineering preparation. ITI, Diploma, BTech/AE and Surveyor plans. Monthly and annual options with installments."
        />
      </Helmet>
      <PricingSection />
    </>
  );
}
