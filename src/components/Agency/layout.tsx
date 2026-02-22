'use client';
import {FC, useEffect, useState} from "react";
import { AgentSidebar } from "../shared/sideBar";
import { SidebarProvider } from "../ui/sidebar";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Mail, MapPin, MessageCircle, Phone, Star, User } from "lucide-react";
import { setLocalStorageField } from "../../../utils/helpers";
import { axiosInstance } from "@/lib/axios-interceptor";


const AgentLayout = ({ children }: { children: React.ReactNode }) => {

  const [activeSection, setActiveSection] = useState("overview");   
  const [agent, setAgent] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const userProfileResponse = await axiosInstance.get('/user/profile');
        //save agent id to local storage
        setAgent(userProfileResponse?.data?.data);
        setLocalStorageField('agentId', userProfileResponse?.data?.data?.agenciesCreated?.[0]?.id);
      }
      fetchData();
    },[]);
  
    return <SidebarProvider>
        <div className="w-full flex min-h-screen bg-background">
          <AgentSidebar activeSection={activeSection} setActiveSection={setActiveSection}/>
          <div className="flex-1">
            <div>
              <AgentProfileHeader agent={agent}/>
              {children}
            </div>
          </div>
        </div>
    </SidebarProvider>;   
}

export default AgentLayout;

type AgentData = {
    agent : any;
}
const AgentProfileHeader : FC<AgentData> = ({agent}) => {

    if(!agent){
        return null;
    }
    const agentData = agent;
    return(
        <div className="w-full overflow-x-hidden mb-8 p-4">
        {/* Agent Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <AvatarImage src={agentData?.profileImage?.image?.url} alt={agentData?.agenciesCreated?.[0].name} />
                  <AvatarFallback>
                    <User/>
                 </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="mx-auto md:mx-0">
                      <h1 className="text-3xl font-bold uppercase text-center md:text-start">{agentData?.agenciesCreated?.[0].name}</h1>
                      <p className="text-lg text-muted-foreground capitalize text-center md:text-start">{agentData?.agenciesCreated?.[0]?.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 mx-auto md:mx-0">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{agentData?.agenciesCreated?.[0]?.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                  <section className="flex flex-col items-start md:flex-row md:items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {agentData?.agenciesCreated?.[0]?.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {agentData?.agenciesCreated?.[0]?.agencyPhoneNumber}
                    </div>
                  </section>
                <section className="flex flex-col items-start md:flex-row md:items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {agentData?.agenciesCreated?.[0]?.whatsappNumber}
                    </div>
                    <div className="flex items-center gap-1 capitalize">
                        <MapPin className="h-4 w-4" />
                        {agentData?.agenciesCreated?.[0]?.address}
                    </div>
                </section>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    )
}