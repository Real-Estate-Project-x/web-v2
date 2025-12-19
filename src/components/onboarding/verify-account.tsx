"use client";

import { toast } from "sonner";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios-interceptor";
import {
  deleteLocalStorageField,
  getLocalStorageField,
} from "../../../utils/helpers";

const VerifyAccountForm: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const code = otp.join("");
    console.log("OTP Code:", code);

    const localStorageKey = "user_email";
    const userEmail = getLocalStorageField(localStorageKey);
    if (!userEmail) {
      toast("Could not verify user-email");
      router.push("/select-account");
      return;
    }

    const url = "user/sign-up/verify";
    const payload = {
      otp: code,
      email: userEmail,
    };

    try {
      const result = await axiosInstance.post(url, payload);

      if (result.data.success) {
        setTimeout(() => {
          toast.success("Account verified successfully");
          setSubmitting(false);
        }, 2000);
        deleteLocalStorageField(localStorageKey);
        router.push("/login");
      } else {
        toast.error("Verification failed. Please try again.");
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
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 min-w-[400px] w-full max-w-sm md:max-w-lg"
    >
      <h1 className="text-2xl font-semibold">Verify account</h1>

      <div className="flex gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="h-12 w-12 rounded-lg border border-gray-300 bg-transparent text-center text-xl font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-purple-dark transition-all text-white font-semibold py-2 mt-2 rounded-lg shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={submitting}
      >
        {submitting ? "Verifying..." : "Verify"}
      </button>

      {/* <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition"
      >
        Verify
      </button> */}
    </form>
  );
};

export default VerifyAccountForm;
