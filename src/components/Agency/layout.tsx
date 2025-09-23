'use client';
import {useState} from "react";
import { AgentSidebar } from "../shared/sideBar";
import { SidebarProvider } from "../ui/sidebar";

const AgentLayout = ({ children }: { children: React.ReactNode }) => {

  const [activeSection, setActiveSection] = useState("overview");   

    return <SidebarProvider>
        <div className="w-full flex min-h-screen bg-background">
            <AgentSidebar activeSection={activeSection} setActiveSection={setActiveSection}/>
            <div className="flex-1">
                {children}
            </div>
        </div>
    </SidebarProvider>;   
}

export default AgentLayout;