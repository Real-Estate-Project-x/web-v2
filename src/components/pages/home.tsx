"use client";
import React, { useEffect } from "react";
//import { CTA } from "./Home/CTA";
import { FeaturedProperties } from "./Home/Featured-properties";
import Footer from "./Home/Footer";
import Hero from "./Home/Hero";
import Navbar from "./Home/Nav";
import PopularLocations from "./Home/Popular-locations";
import Services from "./Home/Services";
import Testimonials from "./Home/Testimonials";
import axios from "axios";
import LoadingCard, { LoaderCardPopularLocations, TestimonialsLoaderCard } from "../shared/loader-cards";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in the environment variables."
  );
}

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

const LandingPage = () => {
  // This component serves as the main landing page for the application.
  // It includes the Navbar, Hero section, Featured Properties, Popular Locations,
  //[POST] /search/for-properties

  const [top_agents, setTopAgents] = React.useState<any>([]);
  const [featured_properties, setFeaturedProperties] = React.useState<any>([]);
  const [popular_locations, setPopularLocations] = React.useState<any>([]);

  useEffect(() => {
    axios
      .all([
        axios.get(
          `${API_BASE_URL}agency/list/top-agents?longitude=010.02020&latitude=029.92920`,
          { headers }
        ),
        axios.get(
          `${API_BASE_URL}property/customer-listings/featured-properties?pageSize=3&pageNumber=1&longitude=010.02020&latitude=029.92920`,
          { headers }
        ),
        axios.get(
          `${API_BASE_URL}property/customer-listings/popular-locations?longitude=7.520633&latitude=6.412773`,
          { headers }
        ),
        // Add more API calls as needed {/property/list/popular-locations}
      ])
      .then(
        axios.spread((top_agent, property_list, popular_locations) => {
          setPopularLocations(popular_locations.data.data);
          setFeaturedProperties(property_list.data.data);
          setTopAgents(top_agent.data.data);
        })
      )
      .catch((err) => {
        console.error("One or more requests failed:", err);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProperties data={featured_properties} />
      <PopularLocations data={popular_locations} />
      {/* {!popular_locations || popular_locations.length === 0 ? (
        <LoaderCardPopularLocations/>
      ) : (
        <PopularLocations data={popular_locations} />
      )} */}
      <Services />
      <Testimonials _data_for_TopAgents={top_agents} />
      {/* {!top_agents || top_agents.length === 0 ? (
      <TestimonialsLoaderCard/>
      ) : (
        <Testimonials _data_for_TopAgents={top_agents} />
      )} */}
      {/* <CTA /> */}
      <Footer />
    </div>
  );
};

export default LandingPage;
