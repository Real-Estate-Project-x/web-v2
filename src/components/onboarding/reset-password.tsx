'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from 'sonner';
import { Key, Eye, EyeOff, KeyRound } from "lucide-react";
import { axiosInstance } from "@/lib/axios-interceptor";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [form, setForm] = useState({
      otp : "",
      password: "",
      confirm: "",
    });
  
    const router = useRouter();
    const [submitting, setSubmitting] = useState<boolean>(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value ?? "",
      });
    }

   const handleSubmit = async (
      e: React.SyntheticEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      setSubmitting(true);

      if (
        !form.otp ||
        !form.password ||
        !form.confirm
      ) {
        toast.info("Please fill out all fields.");
        setSubmitting(false);
        return;
      }

      if (form.password !== form.confirm) {
        toast.error("Passwords do not match.");
        setSubmitting(false);
        return;
      }
      await axiosInstance
        .post(`user/verification/change-password`,{
          verificationCode: form.otp,
          newPassword: form.password
        })
        .then((response) => {
          if (response.data.success) {
            setSubmitting(false);
            setTimeout(() => {
              toast.success(response.data.message ?? "Password successfully Reset!");
              setSubmitting(false);
            }, 2000);
            router.push("/login");
          } else {
            toast.error("Process failed. Please try again.");
          }
        })
        .catch((error) => {
          setSubmitting(false);
          setTimeout(() => {
            toast(
              error.response?.data?.message ||
                "An error occurred. Please try again."
            )},3000);
          
        });
    };

  return (
    <div className="max-w-lg bg-white p-6 lg:px-12 rounded-xl">
        <form
          className="flex flex-col gap-4 animate-fade-in"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
        <h2 className="text-2xl md:text-2xl font-playfair text-realestatenavy font-semibold mb-4 text-left">Reset your Password</h2>
        
        <div className="relative mb-2">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              className="pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            />
            <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
        
        <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirm Password"
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onChange={handleChange}
              className="pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
            >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
         <div className="relative mb-2">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              name="otp"
              placeholder="Enter code sent to your email"
              required
              maxLength={6}
              onChange={handleChange}
              className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            />
        </div>
        <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white font-semibold rounded-lg mt-2 hover:bg-primary/90 shadow-realestate transition py-2"
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
                Submitting...
            </span>
            ) : (
            "Reset Password"
            )}
        </Button>
        </form>
    </div>
  );
}
