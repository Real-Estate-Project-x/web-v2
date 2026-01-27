import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-interceptor";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const DashboardFavorites = () => {
  const [loading, setLoading] = useState(false);
  const [totalFavs, setTotalFavs] = useState(0);
  const [favProperties, setFavProperties] = useState([]);

  useEffect(() => {
    const fetchSavedProperties = async (pageNumber = 1, pageSize = 10) => {
      try {
        setLoading(true);
        const url = `favourite-property?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        const result = await axiosInstance.get(url);
        if (result?.data?.success) {
          const { data, paginationControl } = result.data;
          setFavProperties(data);
          setTotalFavs(paginationControl.totalCount);
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Saved Properties</h1>
      <p className="text-gray-500 mb-6">
        You have saved {totalFavs} properties
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favProperties.map(({ property }: any) => (
          <Card key={property} className="overflow-hidden p-0">
            <div className="h-60 overflow-hidden bg-gray-200">
              <img
                src={property.propertyImages[0].url}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <CardDescription>₦{property.price}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm">
                {`For: ${property.upFor}`} • {property?.state?.name}{" "}
                {property.squareFeet &&
                  ` • ${property.sizeInSquareFeet.toLocaleString()} sqft`}
              </p>
            </CardContent>

            <CardFooter className="p-4 border-t flex justify-between">
              <Link
                style={{
                  borderRadius: "10px",
                  padding: "7px 10px",
                  border: "1px solid #ccc",
                }}
                href={`properties/view?id=${property.slug}`}
                target="_blank"
              >
                View Details
              </Link>
              <Button onClick={() => {}} variant="ghost" size="sm">
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}

        {[0, 1].map(({ property }: any) => (
          <Card key={property} className="overflow-hidden p-0">
            <div className="h-60 overflow-hidden bg-gray-200">
              <img
                src="https://images.pexels.com/photos/14352080/pexels-photo-14352080.jpeg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">3 Bedroom flat</CardTitle>
              <CardDescription>₦500,000</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm">
                For sale • 3 bedrooms • 2 bathrooms • 2 cars • 2 garages
              </p>
            </CardContent>

            <CardFooter className="p-4 border-t flex justify-between">
              <Link
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "7px 10px",
                }}
                href={`properties/view?id=${property?.slug}`}
                target="_blank"
              >
                View Details
              </Link>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
