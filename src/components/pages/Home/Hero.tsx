'use client';
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Buy");
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchText, "with filter:", activeFilter);
    // In a real app, this would navigate to search results
  };

  const focusSearch = () => {
    if (searchRef.current) searchRef.current.focus();
  };

  return (
    <div className="relative h-[100vh] max-h-[850px] min-h-[670px] flex items-center overflow-hidden pt-0 md:pt-16">
      {/* Background Images with enhanced Parallax Effect */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-1500 ease-in-out"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: index === currentImageIndex ? 1 : 0,
              filter: "brightness(0.65)",
              transform: `scale(${index === currentImageIndex ? "1.05" : "1.15"})`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#102A43]/70 via-[#102A43]/60 to-[#102A43]/80 backdrop-blur-[1px]" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 relative mt-8">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <div className="space-y-5">
            <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
              Find Your <span className="bg-gradient-to-r from-[#0253CC] to-[#00A6FB] bg-clip-text text-transparent italic">Dream</span> Home
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Discover extraordinary properties tailored to your lifestyle from our curated collection.
            </p>
          </div>

          {/* Search Section - Glassmorphic design */}
          <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 transition-all duration-500 hover:bg-white/20">
            <form onSubmit={handleSearch}>
              {/* Filter Tabs - More contemporary styling */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["Buy", "Rent", "Sell", "New Homes"].map((filter) => (
                  <Button
                    key={filter}
                    type="button"
                    variant={activeFilter === filter ? "default" : "outline"}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "border-0 text-sm md:text-base px-5 py-2.5 rounded-full transition-all duration-300 font-normal",
                      activeFilter === filter
                        ? "bg-[#0253CC] text-white hover:bg-real-700"
                        : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    )}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              {/* Search Input - More elegant styling */}
              <div className="relative flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    ref={searchRef}
                    type="text"
                    placeholder="Address, neighborhood, city, or ZIP..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-12 h-12 bg-white/90 backdrop-blur-sm border-0 text-navy-800 rounded-xl
                             focus-visible:ring-real-500 text-lg shadow-inner placeholder:text-gray-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-[#0253CC] hover:bg-real-700 text-white text-base font-normal rounded-full
                  transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Search
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Stats - Enhanced with animations */}
          <div className="flex flex-wrap gap-x-6 sm:gap-x-8 md:gap-x-16 gap-y-6 text-white/90 mt-12">
            <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="text-xl md:text-3xl lg:text-4xl font-bold text-real-300">15k+</span>
              <span className="text-sm uppercase tracking-wider">Properties</span>
            </div>
            <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <span className="text-xl md:text-3xl lg:text-4xl font-bold text-real-300">10k+</span>
              <span className="text-sm uppercase tracking-wider">Happy Clients</span>
            </div>
            <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <span className="text-xl md:text-3xl lg:text-4xl font-bold text-real-300">500+</span>
              <span className="text-sm uppercase tracking-wider">Premium Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator - Enhanced with animation */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer animate-bounce hover:animate-none"
           onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/80 text-sm tracking-wider">Explore More</span>
          <div className="h-10 w-10 rounded-full border-2 border-white/50 flex items-center justify-center">
            <ArrowDown className="h-5 w-5 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// const heroImages = [
//   "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80",
//   "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
//   "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
// ];

// const Hero = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative min-h-[600px] md:min-h-[700px] flex items-center">
//       {/* Background Images Slider */}
//       <div className="absolute inset-0 z-0">
//         {heroImages.map((image, index) => (
//           <div
//             key={index}
//             className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
//             style={{
//               backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${image})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               opacity: index === currentImageIndex ? 1 : 0,
//             }}
//           />
//         ))}
//       </div>

//       {/* Hero Content */}
//       <div className="container mx-auto px-4 z-10">
//         <div className="max-w-3xl animate-fade-in">
//           <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-navy-900">Find Your Dream Home</h1>
//           <p className="text-lg md:text-xl mb-8 text-navy-800">
//             Discover a place you'll love to live. We have the most comprehensive
//             property listings to help you find the perfect home.
//           </p>

//           {/* Search Bar */}
//           <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl">
//             <div className="flex flex-col md:flex-row gap-3">
//               <div className="flex-1">
//                 <Input 
//                   type="text" 
//                   placeholder="Enter location, ZIP code, or address" 
//                   className="w-full border-gray-300"
//                 />
//               </div>
//               <Button className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-[#1E3A8A] to-[#0253CC] hover:bg-real-700 text-white">
//                 <Search className="h-5 w-5" />
//                 <span>Search Properties</span>
//               </Button>
//             </div>
            
//             {/* Quick Filter Buttons */}
//             <div className="flex flex-wrap gap-8 mt-4">
//               <Button variant="outline" size="sm" className="bg-white text-navy-800 hover:bg-real-50">Buy</Button>
//               <Button variant="outline" size="sm" className="bg-white text-navy-800 hover:bg-real-50">Rent</Button>
//               <Button variant="outline" size="sm" className="bg-white text-navy-800 hover:bg-real-50">New Homes</Button>
//               <Button variant="outline" size="sm" className="bg-white text-navy-800 hover:bg-real-50">Luxury</Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;
