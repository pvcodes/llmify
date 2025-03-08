'use client'
import { About } from "./About";
import { Cta } from "./Cta";
import { FAQ } from "./FAQ";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Navbar } from "./Navbar";
// import { Newsletter } from "./Newsletter";
import { Pricing } from "./Pricing";
import { ScrollToTop } from "./ScrollToTop";
import { Services } from "./Services";
// import { Sponsors } from "./Sponsors";
// import { Team } from "./Team";
import { Testimonials } from "./Testimonials";

function Landing() {
  return (
    <div className="flex flex-col justify-center items-center px-2">
      <Navbar />
      <Hero />
      {/* <Sponsors /> */}
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      {/* <Testimonials /> */}
      {/* <Team /> */}
      <Pricing />
      {/* <Newsletter /> */}
      <FAQ />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Landing;
