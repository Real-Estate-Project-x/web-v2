'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Shield, Palette, Globe, CreditCard, Settings as SettingsIcon } from "lucide-react";


const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    security: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: "English",
    currency: "USD",
    timezone: "UTC",
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-sm text-gray-600">john.doe@example.com</p>
                    <Badge variant="secondary">Premium Agent</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Change Photo</Button>
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(value) => handleNotificationChange("email", value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(value) => handleNotificationChange("push", value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Communications</h4>
                    <p className="text-sm text-gray-600">Receive updates about new features and offers</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(value) => handleNotificationChange("marketing", value)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Security Alerts</h4>
                    <p className="text-sm text-gray-600">Receive important security notifications</p>
                  </div>
                  <Switch
                    checked={notifications.security}
                    onCheckedChange={(value) => handleNotificationChange("security", value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                  <Switch
                    checked={preferences.darkMode}
                    onCheckedChange={(value) => handlePreferenceChange("darkMode", value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Configure your location and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>UTC</option>
                      <option>EST</option>
                      <option>PST</option>
                      <option>GMT</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                  <Button variant="outline">Change Password</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Active Sessions</h4>
                  <p className="text-sm text-gray-600">Manage devices that are signed in to your account</p>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Plan</h4>
                    <p className="text-sm text-gray-600">Premium Agent - $29/month</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">View Billing History</Button>
                  <Button variant="outline">Update Payment Method</Button>
                  <Button variant="outline">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Changes */}
            <div className="flex justify-end">
              <Button className="w-full sm:w-auto">Save Changes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
