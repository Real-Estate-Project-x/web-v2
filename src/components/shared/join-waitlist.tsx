"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Save } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { ApiRequests } from "@/lib/api.request";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  setIsModalOpen: (isOpen: boolean) => void;
}

export function JoinWaitlist({ setIsModalOpen }: Props) {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    const result = await new ApiRequests().joinWaitlist(email);
    if (result?.success) {
      setEmail("");
      setIsModalOpen(false);
      toast(result.message, { dismissible: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-80">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent>
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Join Waitlist
            </h2>
            <p className="mb-6 text-center">
              We'll let you know when we are live in a location near you 😇🚀.
            </p>
            <p className="mb-6">
              <form onSubmit={handleSubmit}>
                <Input
                  required
                  type="email"
                  value={email}
                  placeholder="Email"
                  className="pl-10 py-6"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  className="mt-5 w-full cursor-pointer bg-black text-white hover:bg-black/90 border-black"
                >
                  <Save /> Submit
                </Button>
              </form>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
