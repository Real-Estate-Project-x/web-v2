'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { agentDashboardData } from "../Agency";
import { usePathname } from "next/navigation";

interface AgentSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}


export function AgentSidebar({ activeSection, setActiveSection }: AgentSidebarProps) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-60"}`}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="bg-white shadow-none">
        <SidebarGroup>
          {/* <SidebarGroupLabel className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {state !== "collapsed" && "Agent Dashboard"}
          </SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              {agentDashboardData.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <a href={item.href}>
                    <SidebarMenuButton 
                      onClick={() => setActiveSection(item.href)}
                      className={`cursor-pointer transition-colors mb-2 capitalize ${
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}