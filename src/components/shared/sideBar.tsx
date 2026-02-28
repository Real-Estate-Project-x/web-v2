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
import { LogOut, Menu, X } from "lucide-react";
import { agentDashboardData } from "../Agency";
import { usePathname, useRouter } from "next/navigation";
import { removeStoredKeys } from "../../../utils/helpers";
import { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const logout = () => {
    removeStoredKeys();
    router.push("/login");
  };

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setMobileOpen(false);
  };

  const NavItems = () => (
    <>
      <div className="flex-1 overflow-y-auto px-2">
        <SidebarMenu className="flex flex-col gap-1">
          {agentDashboardData.map((item) => (
            <SidebarMenuItem key={item.id}>
              <a href={item.href}>
                <SidebarMenuButton
                  onClick={() => handleNavClick(item.href)}
                  className={`cursor-pointer transition-colors capitalize ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>

      <div className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors capitalize"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="xl:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <LogoComponent/>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={`xl:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-end px-3 py-3 border-b">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <NavItems />
      </div>

      {/* ── Desktop Sidebar ── */}
      <Sidebar
        className={`${state === "collapsed" ? "w-14" : "w-65"} h-screen hidden xl:flex`}
        collapsible="icon"
      >
        <div className="flex justify-between items-center">
          {state === "expanded" && <LogoComponent/>}
          <SidebarTrigger className={`${state !== "collapsed" ? 'm-2' : 'mx-4 my-2'} self-end`} />
        </div>

        <SidebarContent className="bg-white shadow-none flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4">
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
    </>
  );
}


// import {
//   Sidebar,
//   SidebarContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { LogOut } from "lucide-react";
// import { agentDashboardData } from "../Agency";
// import { usePathname, useRouter } from "next/navigation";
// import { removeStoredKeys } from "../../../utils/helpers";
// import { LogoComponent } from "../pages/Home/Nav";

// interface AgentSidebarProps {
//   activeSection: string;
//   setActiveSection: (section: string) => void;
// }

// export function AgentSidebar({
//   activeSection,
//   setActiveSection,
// }: AgentSidebarProps) {
//   const router = useRouter();
//   const { state } = useSidebar();
//   const pathname = usePathname();
//   const isActive = (href: string) => pathname === href;

//   const logout = () => {
//     removeStoredKeys();
//     router.push("/login");
//   };

//   return (
//     <Sidebar
//       className={`${state === "collapsed" ? "w-14" : "w-80"} h-screen hidden xl:flex`}
//       collapsible="icon">
//       <section className="flex justify-between items-center ">
//         <LogoComponent/>
//         <SidebarTrigger className="m-2 self-end" />
//       </section>
      

//       <SidebarContent className="bg-white shadow-none flex flex-col h-full">
        
//         {/* SCROLLABLE MENU AREA */}
//         <div className="flex-1 overflow-y-auto px-2">
//           <SidebarMenu className="flex flex-col gap-1">
//             {agentDashboardData.map((item) => (
//               <SidebarMenuItem key={item.id}>
//                 <a href={item.href}>
//                   <SidebarMenuButton
//                     onClick={() => setActiveSection(item.href)}
//                     className={`cursor-pointer transition-colors capitalize ${
//                       isActive(item.href)
//                         ? "bg-primary text-primary-foreground hover:bg-primary/90"
//                         : "hover:bg-muted"
//                     }`}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {state !== "collapsed" && <span>{item.label}</span>}
//                   </SidebarMenuButton>
//                 </a>
//               </SidebarMenuItem>
//             ))}
//           </SidebarMenu>
//         </div>

//         {/* LOGOUT SECTION (ALWAYS AT BOTTOM) */}
//         <div className="border-t p-2">
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenuButton
//                 onClick={logout}
//                 className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors capitalize"
//               >
//                 <LogOut className="h-4 w-4" />
//                 {state !== "collapsed" && <span>Logout</span>}
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </div>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

