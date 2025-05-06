'use client';

import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {toast} from 'sonner';

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Basic validation (customize as needed)
    if (!form.fullname || !form.email || !form.password || !form.confirm) {
      toast("Please fill out all fields.");
      setSubmitting(false);
      return;
    }
    if (form.password !== form.confirm) {
      toast("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    // Simulate network request
    setTimeout(() => {
      toast("Sign Up successful!");
      setSubmitting(false);
    }, 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6 min-w-[340px] animate-fade-in-up w-full max-w-sm md:max-w-md"
      style={{ boxShadow: "0 8px 32px rgba(155,135,245,0.15)" }}
    >
      <h2 className="text-3xl font-playfair font-semibold text-primary mb-1">
        Create your account
      </h2>

      <div>
        <Label htmlFor="fullname" className="text-gray-700 font-medium">
          Full Name
        </Label>
        <div className="relative mt-1">
          <Input
            id="fullname"
            name="fullname"
            placeholder="e.g. Alex Smith"
            type="text"
            value={form.fullname}
            onChange={handleChange}
            className="pl-10"
            autoComplete="name"
            required
            disabled={submitting}
          />
          <User size={20} className="absolute left-3 top-[10px] text-purple-400" />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-gray-700 font-medium">
          Email Address
        </Label>
        <div className="relative mt-1">
          <Input
            id="email"
            name="email"
            placeholder="you@email.com"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="pl-10"
            autoComplete="email"
            required
            disabled={submitting}
          />
          <Mail size={20} className="absolute left-3 top-[10px] text-purple-400" />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-gray-700 font-medium">
          Password
        </Label>
        <div className="relative mt-1">
          <Input
            id="password"
            name="password"
            placeholder="Enter password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            className="pl-10 pr-10"
            autoComplete="new-password"
            required
            disabled={submitting}
          />
          <Lock size={20} className="absolute left-3 top-[10px] text-purple-400" />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[8px] text-gray-500 hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirm" className="text-gray-700 font-medium">
          Confirm Password
        </Label>
        <div className="relative mt-1">
          <Input
            id="confirm"
            name="confirm"
            placeholder="Re-enter password"
            type={showConfirm ? "text" : "password"}
            value={form.confirm}
            onChange={handleChange}
            className="pl-10 pr-10"
            autoComplete="new-password"
            required
            disabled={submitting}
          />
          <Lock size={20} className="absolute left-3 top-[10px] text-purple-400" />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-[8px] text-gray-500 hover:text-primary"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="bg-primary hover:bg-purple-dark transition-all text-white font-semibold py-2 mt-2 rounded-lg shadow-md hover:scale-105"
        disabled={submitting}
      >
        {submitting ? "Signing Up..." : "Sign Up"}
      </Button>

      <p className="mt-2 text-center text-gray-500 text-[15px]">
        Already have an account?{" "}
        <a href="/login" className="text-[16px] text-magenta-pink hover:underline font-medium transition-all">
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignUpForm;