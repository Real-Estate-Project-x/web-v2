"use client";

import React, { use, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios-interceptor";
import {
  checkForRequiredFields,
  encryptData,
  setLocalStorageField,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../../utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const type = useSearchParams().get("type");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitWithDelay = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSubmitting(true);

    const typeLowerCase = type?.toLowerCase();

    const requiredFields = ["firstName", "lastName", "email", "password"];
    if (typeLowerCase === "user") {
      requiredFields.push("phone");
    }
    const requiredFieldsCheck = checkForRequiredFields(requiredFields, form);
    if (requiredFieldsCheck?.errorMessage) {
      toast.info(requiredFieldsCheck.errorMessage);
      setSubmitting(false);
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    if (!validatePassword(form.password)) {
      toast.error(
        " Password must contain at least 8 characters, at least 1 capital letter, 1 number and 1 special character "
      );
      setSubmitting(false);
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    const encryptionKey = String(
      process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY
    );
    const encryptedPassword = encryptData(form.password, encryptionKey);

    try {
      if (typeLowerCase === "user") {
        // Only agents need phone_numbers at sign_up
        if (!isValidPhoneNumber(form.phone)) {
          toast.error("Please enter a valid phone number.");
          setSubmitting(false);
          return;
        }

        const url = "user/sign-up";
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phone,
          email: form.email,
          password: encryptedPassword,
        };

        const result = await axiosInstance.post(url, payload);
        if (result?.data?.success) {
          setLocalStorageField("user_email", form.email);
          setSubmitting(false);
          setTimeout(() => {
            toast.success("Sign Up successful! Please verify your account");
            setSubmitting(false);
          }, 2000);
          router.push("/verify-account");
        } else {
          toast.error("Sign Up failed. Please try again.");
        }
      } else {
        // type == 'agent'
        const url = "agency/create-agency";
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: encryptedPassword,
        };

        const result = await axiosInstance.post(url, payload);
        if (result?.data?.success) {
          setSubmitting(false);
          setTimeout(() => {
            toast.success("Sign Up successful!");
            setSubmitting(false);
          }, 2000);
          router.push(`/profile-agent-signUp?type=AGENT`);
        } else {
          toast.error("Sign Up failed. Please try again.");
        }
      }
    } catch (ex: any) {
      setSubmitting(false);
      toast(
        ex.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmitWithDelay}
      className="flex flex-col gap-6 min-w-[400px] w-full max-w-sm md:max-w-lg"
      // style={{ boxShadow: "0 8px 32px rgba(155,135,245,0.15)" }}
    >
      <h2 className="text-3xl font-playfair font-semibold text-primary mb-1">
        Create your account
      </h2>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullname" className="text-gray-700 font-medium">
            First&nbsp;Name
          </Label>
          <div className="relative mt-1">
            <Input
              id="firstName"
              name="firstName"
              placeholder="e.g.Alex"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              className="pl-10"
              required
              disabled={submitting}
            />
            <User
              size={20}
              className="absolute left-3 top-[10px] text-purple-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="fullname" className="text-gray-700 font-medium">
            Last&nbsp;Name
          </Label>
          <div className="relative mt-1">
            <Input
              id="lastName"
              name="lastName"
              placeholder="e.g.Smith"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              className="pl-10"
              required
              disabled={submitting}
            />
            <User
              size={20}
              className="absolute left-3 top-[10px] text-purple-400"
            />
          </div>
        </div>
      </section>
      {type && type.toLowerCase() === "user" && (
        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Phone&nbsp;Number
          </Label>
          <PhoneInput
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(value: any) => setForm({ ...form, phone: value })}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg mt-1"
            defaultCountry="NG" // You can set a default country
          />
        </div>
      )}
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
          <Mail
            size={20}
            className="absolute left-3 top-[10px] text-purple-400"
          />
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
            onCopy={(e) => e.preventDefault()} // Prevent copy
            onPaste={(e) => e.preventDefault()} // Prevent paste
            className="pl-10 pr-10"
            autoComplete="new-password"
            required
            disabled={submitting}
          />
          <Lock
            size={20}
            className="absolute left-3 top-[10px] text-purple-400"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[8px] text-gray-500 hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            onCopy={(e) => e.preventDefault()} // Prevent copy
            onPaste={(e) => e.preventDefault()} // Prevent paste
            className="pl-10 pr-10"
            autoComplete="new-password"
            required
            disabled={submitting}
          />
          <Lock
            size={20}
            className="absolute left-3 top-[10px] text-purple-400"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-[8px] text-gray-500 hover:text-primary"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {!showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-purple-dark transition-all text-white font-semibold py-2 mt-2 rounded-lg shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={submitting}
      >
        {submitting ? "Signing Up..." : "Sign Up"}
      </button>

      <p className="text-center text-gray-500 text-[15px]">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-[16px] text-magenta-pink hover:underline font-medium transition-all"
        >
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignUpForm;
