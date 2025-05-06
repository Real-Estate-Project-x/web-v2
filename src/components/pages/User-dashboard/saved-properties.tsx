import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardFavorites = () => {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Saved Properties</h1>
        <p className="text-gray-500 mb-6">You have saved 12 properties</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="overflow-hidden p-0">
              <div className="h-64 bg-gray-200"></div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">123 Main St, Unit {item}</CardTitle>
                <CardDescription>$550,000</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">3 beds • 2 baths • 1,500 sqft</p>
            
              </CardContent>

              <CardFooter className="p-4 border-t flex justify-between">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="ghost" size="sm">Remove</Button>
              </CardFooter>
             
            </Card>
          ))}
        </div>
      </div>
    );
  };