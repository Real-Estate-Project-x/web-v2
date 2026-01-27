import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

export const DashboardFavorites = () => {
  const [loading, setLoading] = useState(false);
  const [totalFavs, setTotalFavs] = useState(0);
  const [favProperties, setFavProperties] = useState([]);

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async (pageNumber = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const url = `favourite-property?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      const result = await axiosInstance.get(url);
      if (result?.data?.success) {
        console.log({ result, rest: result.data.data });
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

  const removeFavProperty = async (propertyId: string) => {
    const url = "/favourite-property";

    try {
      const response = await axiosInstance.delete(url, {
        data: { propertyIds: [propertyId] },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSavedProperties();
      }
      toast.info("Property removed from favorites");
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Saved Properties</h1>
      <p className="text-gray-500 mb-6">
        You have saved {totalFavs} properties
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favProperties.map(({ property }: any) => (
          <Card key={property.id} className="overflow-hidden p-0">
            <div className="h-60 overflow-hidden bg-gray-200">
              <img
                src={property.propertyImages[0]?.image.url}
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
              <Button
                onClick={() => removeFavProperty(property.id)}
                variant="ghost"
                size="sm"
              >
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
