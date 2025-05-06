import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardSettings = () => {
    
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                  <input
                    id="first-name"
                    className="w-full p-2 border rounded"
                    defaultValue="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                  <input
                    id="last-name"
                    className="w-full p-2 border rounded"
                    defaultValue="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  className="w-full p-2 border rounded"
                  defaultValue="john.doe@example.com"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Property Updates</p>
                <p className="text-sm text-gray-500">Get updates about properties you've saved</p>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Price Alerts</p>
                <p className="text-sm text-gray-500">Notify me about price changes</p>
              </div>
              <div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-gray-500">Receive our weekly newsletter</p>
              </div>
              <div>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  