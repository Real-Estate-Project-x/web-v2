import { Button } from "@/components/ui/button";
import { Agent, Message } from "../../../../../utils/interfaces";
import { MessageSquare } from "lucide-react";

export const AgentMessages = ({ 
    agent, 
    messages, 
    newMessage, 
    onNewMessageChange, 
    onSendMessage 
  }: { 
    agent: Agent; 
    messages: Message[]; 
    newMessage: string; 
    onNewMessageChange: (message: string) => void; 
    onSendMessage: () => void;
  }) => {
    return (
      <div className="h-[calc(100vh-12rem)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Chat with {agent.name}</h1>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto mb-4 space-y-4 p-4 border rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromAgent ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isFromAgent
                      ? 'bg-gray-100'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 p-4 border rounded-lg">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => onNewMessageChange(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded"
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            />
            <Button onClick={onSendMessage}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  };
  