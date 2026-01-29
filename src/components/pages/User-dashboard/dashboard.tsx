"use client";

import { useState } from "react";
import { DashboardAgents } from "./Agent/agents";
import { AgentMessages } from "./Agent/message-agent";
import { AgentProperties } from "./Agent/properties";
import DashboardLayout from "./layout";
import { DashboardOverview } from "./overview";
import { DashboardFavorites } from "./saved-properties";
import { DashboardSchedule } from "./scheduled-viewings";
import { DashboardSettings } from "./settings";
import { Agent, Message } from "../../../../utils/interfaces";
import { DashboardSavedSearch } from "./saved-searches";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setActiveSection("agent-properties");
  };

  const handleSendMessage = (agentName: string) => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      agentName,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      isFromAgent: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />;
      case "favorites":
        return <DashboardFavorites />;
      case "settings":
        return <DashboardSettings />;
      case "schedule":
        return <DashboardSchedule />;
      case "saved-searches":
        return <DashboardSavedSearch />;
      case "agents":
        return <DashboardAgents onSelectAgent={handleSelectAgent} />;
      case "agent-properties":
        return selectedAgent ? (
          <AgentProperties
            onMessageClick={() => setActiveSection("messages")}
            propertiesPerPage={5}
          />
        ) : (
          <div>No agent selected</div>
        );
      case "messages":
        return selectedAgent ? (
          <AgentMessages
            agent={selectedAgent}
            messages={messages}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={() => handleSendMessage(selectedAgent.name)}
          />
        ) : (
          <div>No agent selected</div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
