import React from 'react';

import { Hero } from "../components/Hero";
import { Sponsors } from "../components/Sponsors";
import { About } from "../components/About";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Features";
import { Services } from "../components/Services";
import { Testimonials } from "../components/Testimonials";
import { Team } from "../components/Team";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";

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
