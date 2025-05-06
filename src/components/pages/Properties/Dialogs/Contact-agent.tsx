'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

const ContactAgentModal = ({ isOpen, onClose, propertyTitle }: ContactAgentModalProps) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message sent");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Contact Agent</DialogTitle>
          <DialogDescription>
            Send a message about {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </DialogFooter>
        </form>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>(555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>agent@realestate.com</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactAgentModal;
