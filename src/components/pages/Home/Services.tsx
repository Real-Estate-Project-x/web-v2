'use client';
import { Home, Building, MapPin } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Buy a Home",
    description: "Find your place with an immersive photo experience and the most listings, including things you won't find anywhere else."
  },
  {
    icon: Building,
    title: "Rent an Apartment",
    description: "Whether you sell with new Abode technology or take a more traditional approach, we'll help you navigate the path to a successful sale."
  },
  // {
  //   icon: Users,
  //   title: "Expert Agents",
  //   description: "Our top-rated real estate agents are local experts and are ready to help you with all your housing needs."
  // },
  {
    icon: MapPin,
    title: "Explore Popular Locations",
    description: "Get essential info about the neighborhood, like schools, nearby public transport, and monthly expenses."
  }
];

const Services = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-navy-900 mb-4">How We Can Help</h2>
          <p className="text-navy-600 max-w-2xl mx-auto font-light">
            We provide a complete service for the sale, purchase or rental of real estate, and guide you through every step.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-real-50 rounded-lg flex items-center justify-center mb-5">
                <service.icon className="h-6 w-6 text-[#0253CC]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#1E3A8A] to-[#0253CC] bg-clip-text text-transparent ">{service.title}</h3>
              <p className="text-navy-600 font-light">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
