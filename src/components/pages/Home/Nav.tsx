'use client';

import { useState, useEffect, FC } from "react";
import { Button } from "@/components/ui/button";
import { Home, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavDataInterface } from "../../../../utils/interfaces";

type NavData = {
  data ?: NavDataInterface[]
  
}

  const defaultNavData =[
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/agents", label: "Agents" },
    { href: "/contact", label: "Contact" },
  ]
const Navbar :FC<NavData> = ({data = defaultNavData}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Handle scroll events to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.7; // Approximately when the hero section ends
      if (window.scrollY > heroHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 shadow-sm ${
        pathname === "/" ?
        scrolled 
          ? "bg-white border-gray-200 text-gray-800 " 
          : "bg-transparent border-transparent text-white"

          :"bg-white border-gray-200 text-gray-800"
      }`}
    >
      {/* container */}
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <Home className={`h-8 w-8 mr-2 ${pathname === "/" ? scrolled ? "text-gray-800" : "text-gray-200" :"text-black"}`} />
          <h1 className={`text-2xl font-medium hidden sm:inline-block font-serif ${pathname === "/" ? scrolled ? "text-gray-800" : "text-gray-200" :"text-black"}`}>
            Blupodd
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Map through defaultNavData to create links */}
          {data.map((navItem) => (
            <Link 
              key={navItem.href}
              href={navItem.href} 
              className={`hover:text-real-300 transition-colors ${
                pathname === "/" ? scrolled ? "text-[#1E3A8A] font-normal" : "text-gray-200" : pathname === navItem.href ? "text-[#1E3A8A] font-semibold text-shadow-lg" : "text-black"
              }`}
            >
              {navItem.label}
            </Link>
          ))}
          <Link href={"/properties/search"}>
            <Search size={18} className={`${pathname === "/" ? scrolled ? "text-gray-800" : "text-gray-200" :"text-[#1E3A8A]"}`}/>
          </Link>
          <Link href="/login" className={pathname.includes("/agent-dashboard") ? "hidden" : "inline-block"}>
            <Button variant="default" size="sm" className="ml-4 font-normal cursor-pointer bg-gradient-to-r from-[#1E3A8A] to-[#0253CC]">Sign&nbsp;In</Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className={scrolled ? "text-gray-800" : "text-slate-200"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden shadow-lg animate-fade-in border-t ${
          pathname === "/" ?
          scrolled 
            ? "bg-white border-gray-200" 
            : "bg-black bg-opacity-80 backdrop-blur-md border-gray-700"
          : "bg-white border-gray-200"
        }`}>
          <div className="container mx-auto px-4 py-3 space-y-3">
            {data.map((navItem) => (
              <Link 
                key={navItem.href}
                href={navItem.href} 
                className={`block py-2 hover:text-real-300 transition-colors border-b border-slate-200 font-light ${
                pathname === "/" ? scrolled ? "text-gray-800" : "text-gray-200" :"text-black"
              }`}
              >
                {navItem.label}
              </Link>
            ))}

           <Link href={"/properties/search"}>
              <Search size={18} className="text-black"/>
           </Link>

            <Link href="/login">
              <Button className="w-full mt-2 hover:bg-blue-800 bg-[#1E3A8A] text-white">
                Sign&nbsp;In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Home, Menu, X } from "lucide-react";
// import { useRouter } from "next/navigation";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const router = useRouter();
//   return (
//     <nav className="bg-white border border-b-slate-300 sticky top-0 z-50">
//       <div className="container mx-auto px-4 flex items-center justify-between h-16">
//         <div className="flex items-center">
//           <Home className="h-8 w-8 text-[#1E3A8A] mr-2" />
//           <h1 className="text-3xl font-light bg-gradient-to-r from-[#1E3A8A] to-[#0253CC] bg-clip-text text-transparent font-serif">Blupodd</h1>
//             {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0253CC] to-[#00A6FB] bg-clip-text text-transparent">
//                 Blupodd
//             </h1> */}
//         </div>
        
//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-8">
//           <a href="/" className="text-navy-800 hover:text-[#0253CC] hover:font-normal font-light">Home</a>
//           <a href="/properties" className="text-navy-800 hover:text-[#0253CC] hover:font-normal font-light">All&nbsp;Properties</a>
//           <a href="/buy" className="text-navy-800 hover:text-[#0253CC] hover:font-normal font-light">Buy</a>
//           <a href="/rent" className="text-navy-800 hover:text-[#0253CC] hover:font-normal font-light">Rent</a>
//           {/* <a href="#" className="text-navy-800 hover:text-[#0253CC] hover:font-normal font-light">Agents</a> */}
//           <a href="/contact" className="text-navy-800 hover:text-[#0253CC] hover:font-normal font-light">Contact</a>
//           <Button variant="default" size="sm" className="ml-4 font-light cursor-pointer bg-gradient-to-r from-[#1E3A8A] to-[#0253CC]"  onClick={() => router.push('/login')}>Sign&nbsp;In</Button>
//         </div>
        
//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </Button>
//         </div>
//       </div>
      
//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden bg-white shadow-lg animate-fade-in">
//           <div className="container mx-auto px-4 py-3 space-y-3">
//             <a href="/" className="block py-2 text-navy-800 hover:text-real-600 font-medium">Home</a>
//             <a href="/properties" className="block py-2 text-navy-800 hover:text-real-600 font-medium">All&nbsp;Properties</a>
//             <a href="/buy" className="block py-2 text-navy-800 hover:text-real-600 font-medium">Buy</a>
//             <a href="/rent" className="block py-2 text-navy-800 hover:text-real-600 font-medium">Rent</a>
//             <a href="/contact" className="block py-2 text-navy-800 hover:text-real-600 font-medium">Contact</a>
//             <Button className="w-full mt-2 bg-blue-50 bg-[#1E3A8A]" onClick={() => router.push('/login')}>Sign&nbsp;In</Button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
