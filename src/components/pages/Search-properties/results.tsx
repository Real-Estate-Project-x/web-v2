'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Heart, Share, Phone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PropertySearchForm from "./search-form";
import Navbar from "../Home/Nav";
import Footer from "../Home/Footer";

const searchResults = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    price: "$1,250,000",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
    location: "Beverly Hills, CA",
    beds: 4,
    baths: 3,
    sqft: "3,500",
    type: "For Sale",
    yearBuilt: 2019,
    description: "Stunning modern villa with panoramic city views, gourmet kitchen, and resort-style backyard.",
    agent: "Sarah Johnson",
    agentPhone: "(555) 123-4567",
    daysOnMarket: 12
  },
  {
    id: 2,
    title: "Downtown Apartment",
    price: "$450,000",
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80",
    location: "Downtown Seattle, WA",
    beds: 2,
    baths: 2,
    sqft: "1,200",
    type: "For Sale",
    yearBuilt: 2020,
    description: "Contemporary apartment in the heart of downtown with floor-to-ceiling windows and city views.",
    agent: "Mike Chen",
    agentPhone: "(555) 987-6543",
    daysOnMarket: 5
  },
  {
    id: 3,
    title: "Suburban Family Home",
    price: "$750,000",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
    location: "Bellevue, WA",
    beds: 4,
    baths: 2.5,
    sqft: "2,800",
    type: "For Sale",
    yearBuilt: 2015,
    description: "Beautiful family home in quiet neighborhood with large backyard and top-rated schools nearby.",
    agent: "Emily Rodriguez",
    agentPhone: "(555) 246-8135",
    daysOnMarket: 20
  },
  {
    id: 4,
    title: "Cozy Townhouse",
    price: "$525,000",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    location: "Portland, OR",
    beds: 3,
    baths: 2.5,
    sqft: "1,800",
    type: "For Sale",
    yearBuilt: 2018,
    description: "Charming townhouse with modern finishes, attached garage, and walking distance to parks.",
    agent: "David Kim",
    agentPhone: "(555) 369-2580",
    daysOnMarket: 8
  }
];

const SearchResultsList = () => {
    const router = useRouter();

  return (
    <div className="space-y-6">
    {searchResults.map((property) => (
        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="md:flex">
            {/* Property Image */}
            <div className="md:w-1/3 relative h-64 md:h-auto">
            <img
                src={property.image}
                alt={property.title}
                className="w-full h-80 object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-real-600">{property.type}</Badge>
                {property.daysOnMarket <= 7 && (
                <Badge className="bg-green-500">New</Badge>
                )}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8">
                <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                <Share className="h-4 w-4" />
                </Button>
            </div>
            </div>

            {/* Property Details */}
            <CardContent className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{property.description}</p>
                </div>
                <div className="text-right">
                <div className="text-2xl font-bold text-real-600">{property.price}</div>
                <div className="text-sm text-gray-600">Built in {property.yearBuilt}</div>
                </div>
            </div>

            {/* Property Stats */}
            <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1 text-gray-600" />
                <span className="text-sm font-medium">{property.beds} beds</span>
                </div>
                <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1 text-gray-600" />
                <span className="text-sm font-medium">{property.baths} baths</span>
                </div>
                <div className="flex items-center">
                <Square className="h-4 w-4 mr-1 text-gray-600" />
                <span className="text-sm font-medium">{property.sqft} sqft</span>
                </div>
                <div className="text-sm text-gray-600">
                {property.daysOnMarket} days on market
                </div>
            </div>

            {/* Agent Info & Actions */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                <div className="font-medium">{property.agent}</div>
                <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {property.agentPhone}
                </div>
                </div>
                <div className="flex gap-2">
                <Button variant="outline" size="sm">
                    Schedule Tour
                </Button>
                <Button 
                    size="sm"
                    className="bg-real-600 hover:bg-real-700"
                    onClick={() => router.push(`/properties/${property.id}`)}
                >
                    View Details
                </Button>
                </div>
            </div>
            </CardContent>
        </div>
        </Card>
    ))}
    </div>
  );
};

export default SearchResultsList;