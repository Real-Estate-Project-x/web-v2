'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from 'sonner';
import { Mail } from "lucide-react";
import { validateEmail } from "../../../utils/helpers";
import { axiosInstance } from "@/lib/axios-interceptor";
import { useRouter } from "next/navigation";

export default function ConfirmEmailForm() {

  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value ?? "");
    };
  
    const handleSubmit = async (
      e: React.SyntheticEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      setSubmitting(true);
  
      if (email && !validateEmail(email)) {
        toast.error("Please enter a valid email address.");
        setSubmitting(false);
        return;
      }

      await axiosInstance
        .get(`user/verification/initiate-forgot-password-flow/${email}`)
        .then((response) => {
          if (response.data.success) {
            setSubmitting(false);
            setTimeout(() => {
              toast.success(response.data.message ?? "Email sent successfully!");
              setSubmitting(false);
            }, 2000);
            router.push("/reset-password");
          } else {
            toast.error("Process failed. Please try again.");
          }
        })
        .catch((error) => {
          setSubmitting(false);
          toast(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
        });
    };

  return (
    <div className="max-w-lg bg-white p-6 lg:px-8 rounded-xl">
        <form
        className="flex flex-col gap-4 animate-fade-in"
        onSubmit={handleSubmit}
        autoComplete="off"
        >
        <h2 className="text-2xl md:text-2xl font-playfair text-realestatenavy font-bold mb-4 text-left">Enter email to Reset&nbsp;Password</h2>
        <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              required
              onChange={handleChange}
              className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            />
        </div>
        
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white font-semibold rounded-lg mt-2 hover:bg-primary/90 shadow-realestate transition py-2 disabled:opacity-50 disabled:cursor-not-allowed "
        >
            {submitting ? (
            <span className="flex items-center justify-center gap-1">
                <svg className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#fff"
                    strokeWidth="4"
                    fill="none"
                />
                <path
                    className="opacity-75"
                    fill="#fff"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
                </svg>{" "}
                submitting...
            </span>
            ) : (
            "Submit"
            )}
        </Button>

          <p className="text-center text-gray-500 text-[13px]">
            Don't have an account?{" "}
            <a href="/signUp" className="text-[14px] text-magenta-pink hover:underline font-medium transition-all">
            Sign&nbsp;up
            </a>
          </p>
        </form>
    </div>
  );
}
