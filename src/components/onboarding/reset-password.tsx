'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from 'sonner';
import { Key, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Login Successful",);
    }, 1100);
  }

  return (
    <div className="max-w-lg bg-white p-6 lg:px-12 rounded-xl">
        <form
        className="flex flex-col gap-4 animate-fade-in"
        onSubmit={onSubmit}
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
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Confirm Password"
            required
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

        <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold rounded-lg mt-2 hover:bg-primary/90 shadow-realestate transition py-2"
        >
            {loading ? (
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
                Logging in...
            </span>
            ) : (
            "Reset Password"
            )}
        </Button>
        </form>
    </div>
  );
}
