"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Building2, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios-interceptor";

const heroImages = [
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchText, setSearchText] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<{total : number, totalForRent : number, totalForSale : number}>({
    total: 0,
    totalForRent: 0,
    totalForSale: 0,
  });

  useEffect(() => {
    axiosInstance.get("/property/customer-listings/metrics/highlights")
    .then((response) => {
      setHighlights({
        total: response.data.data.total,
        totalForRent: response.data.data.totalForRent,
        totalForSale: response.data.data.totalForSale,
      });
    }).catch((error) => { 
      console.error("Error fetching highlights:", error);
    });

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push(
      `/properties/search?query=${encodeURIComponent(
        searchText
      )}&filter=${encodeURIComponent(category)}`
    );
  };

  const quickSearchOptions = [
    { icon: Home, label: "Homes for Sale", count: highlights.totalForSale },
    { icon: Building2, label: "Properties for Rent", count: highlights.totalForRent },
    { icon: TrendingUp, label: "Total Properties", count: highlights.total },
  ];

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Background Images with Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-2000 ease-in-out"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: index === currentImageIndex ? 1 : 0,
              filter: "brightness(0.4) saturate(1.1)",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/80 via-[#1E3A8A]/60 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 relative mt-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <span className="text-sm text-white font-medium">
                🏡 Over 15,000+ Properties Available
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Find Your Perfect
                {/* <span className="block text-real-300 font-serif italic">Home Sweet Home</span> */}
                <span className="bg-gradient-to-r from-[#0253CC] to-[#00A6FB] bg-clip-text text-transparent block text-real-300 font-serif italic">
                  Home Sweet Home
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg leading-relaxed">
                Discover exceptional properties with personalized
                recommendations and expert guidance every step of the way.
              </p>
            </div>

            {/* Quick Stats */}
            {/* <div className="flex flex-wrap gap-8 text-white/90">
              <div className="text-center">
                <div className="text-3xl font-bold text-real-300">15K+</div>
                <div className="text-sm uppercase tracking-wider">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-real-300">98%</div>
                <div className="text-sm uppercase tracking-wider">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-real-300">500+</div>
                <div className="text-sm uppercase tracking-wider">Agents</div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Search Form */}
          <div className="lg:justify-self-end w-full max-w-lg">
            <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
              <div className="space-y-6">
                {/* Filter Tabs */}
                {/* <div className="flex flex-wrap gap-2">
                  {["Rent", "Sale"].map((filter) => (
                    <Button
                      key={filter}
                      type="button"
                      variant={activeFilter === filter ? "default" : "ghost"}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "text-sm font-medium px-6 py-3 rounded-full transition-all duration-300",
                        activeFilter === filter
                          ? "bg-[#0253CC] text-white shadow-lg hover:bg-[#00A6FB]"
                          : "text-navy-700 hover:bg-real-50"
                      )}
                    >
                      {filter}
                    </Button>
                  ))}
                </div> */}

                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Property Type Input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      ref={searchRef}
                      type="text"
                      placeholder="Property type (I.E Flat, Duplex, Warehouse)..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="pl-12 h-14 bg-white border-gray-200 text-navy-800 rounded-xl focus-visible:ring-blue-100 text-base"
                    />
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Select
                    onValueChange={(value) => setCategory(value)}>
                      <SelectTrigger className="w-full pl-12 py-6.5 bg-white border-gray-200 text-navy-800 rounded-xl focus-visible:ring-blue-100 text-base placeholder:text-xs">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="RENT">Rent</SelectItem>
                      <SelectItem value="SALE">Sale</SelectItem>
          
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Button */}
                  <Button type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-[#0253CC] hover:bg-real-700 text-white text-lg font-normal rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? "Searching..." : "Search Properties"}
                  </Button>
                </form>

                {/* Quick Search Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600">
                    Popular Searches
                  </p>
                  <div className="grid gap-2">
                    {quickSearchOptions.map((option, index) => (
                      <button
                        key={index}
                        className="flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className="h-4 w-4 text-real-600" />
                          <span className="text-sm font-medium text-navy-700">
                            {option.label}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {option.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div
          className="flex flex-col items-center gap-2 cursor-pointer animate-bounce"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight - 100,
              behavior: "smooth",
            })
          }
        >
          <span className="text-white/70 text-sm font-medium">
            Scroll to explore
          </span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
