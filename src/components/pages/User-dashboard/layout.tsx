"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  //NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  // NavigationMenuTrigger,
  // navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Home,
  Settings,
  User,
  Heart,
  LayoutDashboard,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DashboardLayout = ({
  children,
  activeSection,
  setActiveSection,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile */}
        <aside className="w-64 bg-gray-100 border-r hidden lg:block">
          <div className="p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-[#1E3A8A] to-[#0253CC] bg-clip-text text-transparent">
              Amos&nbsp;Joseph
            </h2>
            <nav className="space-y-1 flex-1">
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                label="Overview"
                isActive={activeSection === "overview"}
                onClick={() => setActiveSection("overview")}
              />
              <SidebarItem
                icon={<Heart size={20} />}
                label="Saved Properties"
                isActive={activeSection === "favorites"}
                onClick={() => setActiveSection("favorites")}
              />
              <SidebarItem
                icon={<Calendar size={20} />}
                label="Scheduled Viewings"
                isActive={activeSection === "schedule"}
                onClick={() => setActiveSection("schedule")}
              />
              <SidebarItem
                icon={<Calendar size={20} />}
                label="Saved Searches"
                isActive={activeSection === "saved-searches"}
                onClick={() => setActiveSection("saved-searches")}
              />
              <SidebarItem
                icon={<Settings size={20} />}
                label="Settings"
                isActive={activeSection === "settings"}
                onClick={() => setActiveSection("settings")}
              />
            </nav>
            <div className="py-4 mt-4 border-t border-gray-200">
              <Link href="/">
                <Button
                  variant="link"
                  className="w-full justify-start font-medium bg-gradient-to-r from-[#1E3A8A] to-[#0253CC] bg-clip-text text-transparent"
                  size="sm"
                >
                  <Home className="mr-1 h-4 w-4 text-blue-900" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation - Shown only on mobile */}
        <div className="lg:hidden w-full border-b sticky top-16 bg-white z-10 overflow-x-auto">
          <NavigationMenu className="mx-auto max-w-full w-full justify-start p-4">
            <NavigationMenuList className="flex space-x-2">
              <NavigationMenuItem>
                <Button
                  variant={activeSection === "overview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection("overview")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant={activeSection === "favorites" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection("favorites")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Saved
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant={activeSection === "schedule" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection("schedule")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Viewings
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant={activeSection === "agents" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection("agents")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Agents
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant={activeSection === "settings" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Main Content - Responsive padding and max-width */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, isActive, onClick }: SidebarItemProps) => {
  return (
    <button
      className={`flex items-center space-x-3 w-full px-2 py-3.5 rounded-md text-sm ${
        isActive
          ? "bg-gradient-to-r from-[#1E3A8A] to-[#0253CC] text-white font-medium"
          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
      }`}
      onClick={onClick}
    >
      <span className={isActive ? "text-white" : "text-gray-500"}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default DashboardLayout;
