
//import { CTA } from "./Home/CTA";
import { FeaturedProperties } from "./Home/Featured-properties";
import Footer from "./Home/Footer";
import Hero from "./Home/Hero";
import Navbar from "./Home/Nav";
import PopularLocations from "./Home/Popular-locations";
import Services from "./Home/Services";
import Testimonials from "./Home/Testimonials";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <PopularLocations/>
      <Services />
      <Testimonials />
      {/* <CTA /> */}
      <Footer />
    </div>
  );
};

export default LandingPage;