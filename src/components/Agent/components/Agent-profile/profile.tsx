'use client';


import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Home,
  TrendingUp,
  Award,
  Users,
  MessageCircle,
  Edit,
  Share
} from "lucide-react";
import Navbar from "@/components/pages/Home/Nav";
import { agentDashboardData } from "../..";
import { useSearchParams } from "next/navigation";

const AgentProfile = () => {

  const searchParams = useSearchParams();
    const id = searchParams.get("id") || "1"; // Default to agent with ID 1 if no ID is provided

  // Mock agent data - in a real app, this would be fetched based on the ID
  const agentData = {
    id: parseInt(id || "1"),
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Senior Real Estate Agent",
    email: "sarah.johnson@realestate.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Los Angeles, CA 90210",
    specialization: "Luxury Properties",
    avatar: "/placeholder.svg",
    rating: 4.9,
    totalReviews: 147,
    yearsExperience: 8,
    licenseNumber: "DRE #01234567",
    languages: ["English", "Spanish", "French"],
    totalSales: 2847000,
    propertiesSold: 45,
    activeListings: 12,
    clientsSatisfied: 132,
    commissionRate: 6.5,
    joined: "2020-03-15",
    bio: "With over 8 years of experience in luxury real estate, Sarah has built a reputation for exceptional service and deep market knowledge. She specializes in high-end properties and has consistently been a top performer in the Los Angeles market.",
    certifications: [
      "Certified Residential Specialist (CRS)",
      "Accredited Buyer's Representative (ABR)",
      "Luxury Home Marketing Specialist"
    ],
    recentSales: [
      { address: "456 Beverly Hills Dr", price: 2400000, date: "2024-05-15", type: "Luxury Home" },
      { address: "789 Sunset Blvd", price: 1800000, date: "2024-04-22", type: "Condo" },
      { address: "321 Ocean Ave", price: 3200000, date: "2024-03-10", type: "Beachfront" }
    ],
    clientTestimonials: [
      {
        name: "John Smith",
        text: "Sarah made our home buying experience seamless and stress-free. Her expertise and attention to detail are unmatched.",
        rating: 5,
        date: "2024-05-20"
      },
      {
        name: "Maria Garcia",
        text: "Professional, knowledgeable, and always available. Sarah helped us find our dream home!",
        rating: 5,
        date: "2024-04-15"
      }
    ]
  };

  const performanceStats = [
    {
      title: "Total Sales Volume",
      value: `$${(agentData.totalSales / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Properties Sold",
      value: agentData.propertiesSold.toString(),
      icon: Home,
      color: "text-blue-600"
    },
    {
      title: "Active Listings",
      value: agentData.activeListings.toString(),
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Client Rating",
      value: agentData.rating.toString(),
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar data={agentDashboardData} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 mt-16">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={agentData.avatar} alt={`${agentData.firstName} ${agentData.lastName}`} />
                  <AvatarFallback className="text-2xl">{agentData.firstName[0]}{agentData.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Button size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  {/* <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button> */}
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{agentData.firstName} {agentData.lastName}</h1>
                    <p className="text-xl text-muted-foreground">{agentData.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{agentData.rating}</span>
                        <span className="text-muted-foreground">({agentData.totalReviews} reviews)</span>
                      </div>
                      <Badge variant="secondary">{agentData.yearsExperience} years experience</Badge>
                      <Badge>{agentData.specialization}</Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agentData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agentData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agentData.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Licensed since {new Date(agentData.joined).getFullYear()}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground">{agentData.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Recent Sales</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Number:</span>
                    <span className="font-medium">{agentData.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commission Rate:</span>
                    <span className="font-medium">{agentData.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clients Satisfied:</span>
                    <span className="font-medium">{agentData.clientsSatisfied}</span>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground">Languages:</span>
                    <div className="flex gap-2 mt-2">
                      {agentData.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Specialization Areas</h4>
                      <Badge>{agentData.specialization}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Average Sale Price</h4>
                      <p className="text-2xl font-bold text-green-600">
                        ${Math.round(agentData.totalSales / agentData.propertiesSold).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Market Areas</h4>
                      <p className="text-sm text-muted-foreground">
                        Beverly Hills, West Hollywood, Santa Monica, Malibu, Manhattan Beach
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Properties sold in the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentData.recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{sale.address}</h4>
                        <p className="text-sm text-muted-foreground">{sale.type}</p>
                        <p className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${sale.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Testimonials</CardTitle>
                <CardDescription>What clients say about working with {agentData.firstName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {agentData.clientTestimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-medium">{testimonial.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(testimonial.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>Ready to work with {agentData.firstName}?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {agentData.phone}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agentData.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agentData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{agentData.email}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentProfile;