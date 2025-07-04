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
import { axiosInstance } from "@/lib/axios-interceptor";
import { getUserIp, returnHeaders } from "@/lib/utils";
import { setCookie } from "@/lib/helpers";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in the environment variables."
  );
}

const setAlert = () => {
  alert("Please Turn on Geolocation in your Browser Settings for better Access to Properties.");
}

const getUserIpAddress = async (setState : Function) => {
  await getUserIp().then((ip) => {
    setState(ip);
  }).catch((error) => {
    console.error("Error fetching user IP address:", error);
  })
}


const LandingPage = () => {
  // This component serves as the main landing page for the application.
  // It includes the Navbar, Hero section, Featured Properties, Popular Locations,
  //[POST] /search/for-properties

  const [top_agents, setTopAgents] = React.useState<any>([]);
  const [featured_properties, setFeaturedProperties] = React.useState<any>([]);
  const [popular_locations, setPopularLocations] = React.useState<any>([]);
  const [userIp, setUserIp] = React.useState<string>("");

  useEffect(() => {

    getUserIpAddress(setUserIp);

    axios
      .all([
        axios.get(
          `${API_BASE_URL}agency/list/top-agents?longitude=010.02020&latitude=029.92920&ipAddress=104.28.204.233`,
          {headers : returnHeaders(userIp) }
        ),
        axios.get(
          `${API_BASE_URL}property/customer-listings/featured-properties?pageSize=3&pageNumber=1`,
          {headers : returnHeaders(userIp) }
        ),
        axios.get(
          `${API_BASE_URL}property/customer-listings/popular-locations`,
          {headers : returnHeaders(userIp) }
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

  setCookie('user_ip', userIp,);

  setInterval(() => {  
    setAlert();
  }, 100000);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProperties data={featured_properties} />
      <PopularLocations data={popular_locations} />
      <Services />
      <Testimonials _data_for_TopAgents={top_agents} />
      {/* <CTA /> */}
      <Footer />
    </div>
  );
};

export default LandingPage;
