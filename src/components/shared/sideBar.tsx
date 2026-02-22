"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { agentDashboardData } from "../Agency";
import { usePathname, useRouter } from "next/navigation";
import { removeStoredKeys } from "../../../utils/helpers";
import { LogoComponent } from "../pages/Home/Nav";

interface AgentSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function AgentSidebar({
  activeSection,
  setActiveSection,
}: AgentSidebarProps) {
  const router = useRouter();
  const { state } = useSidebar();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const logout = () => {
    removeStoredKeys();
    router.push("/login");
  };

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-80"} h-screen hidden xl:flex`}
      collapsible="icon">
      <section className="flex justify-between items-center ">
        <LogoComponent/>
        <SidebarTrigger className="m-2 self-end" />
      </section>
      

      <SidebarContent className="bg-white shadow-none flex flex-col h-full">
        
        {/* SCROLLABLE MENU AREA */}
        <div className="flex-1 overflow-y-auto px-2">
          <SidebarMenu className="flex flex-col gap-1">
            {agentDashboardData.map((item) => (
              <SidebarMenuItem key={item.id}>
                <a href={item.href}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.href)}
                    className={`cursor-pointer transition-colors capitalize ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {state !== "collapsed" && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* LOGOUT SECTION (ALWAYS AT BOTTOM) */}
        <div className="border-t p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors capitalize"
              >
                <LogOut className="h-4 w-4" />
                {state !== "collapsed" && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
