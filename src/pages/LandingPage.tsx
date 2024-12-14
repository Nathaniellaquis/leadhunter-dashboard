
import { Hero } from "../components/Hero.tsx";
import { Sponsors } from "../components/Sponsors.tsx";
import { About } from "../components/About";
import { HowItWorks } from "../components/HowItWorks.tsx";
import { Features } from "../components/Features";
import { Services } from "../components/Services.tsx";
import { Testimonials } from "../components/Testimonials";
import { Team } from "../components/Team";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer.tsx";

export default function LandingPage() {
  return (
    <div className="w-screen min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* <Navbar /> */}
        <Hero />
        <Sponsors />
        <About />
        <HowItWorks />
        <Features />
        <Services />
        <Testimonials />
        <Team />
        <Pricing />
        {/* <Newsletter /> */}
        <FAQ />
        <Footer />
        {/* <ScrollToTop /> */}
      </div>
    </div>
  );
}
