"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { setCookie } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import { axiosInstance } from "@/lib/axios-interceptor";
import {
  encryptData,
  decryptData,
  setLocalStorageField,
  getLocalStorageField,
  deleteLocalStorageField,
} from "../../../utils/helpers";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const encryptionKey = String(
      process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY
    );
    const encryptedPassword = encryptData(form.password, encryptionKey);

    const url = "auth/login/WEB";
    const payload = {
      email: form.email,
      password: encryptedPassword,
    };

    try {
      const result = await axiosInstance.post(url, payload);

      if (result?.data?.success) {
        setLoading(false);

        saveInfoToLocalStorage(result.data, encryptionKey);

        const decryptedResponse = JSON.parse(
          decryptData(result.data.data, encryptionKey)
        );

        setTimeout(() => {
          toast.success("Login Successful!");
          setLoading(false);

          // on:login, pick this last url and navigate there
          const key = "last_tracked_url";
          const lastTrackedUrl = getLocalStorageField(key);
          if (lastTrackedUrl) {
            router.push(lastTrackedUrl.currentUrl);
            deleteLocalStorageField(key);
          } else {
            // Navigate to dashboard based on user role
            switch (decryptedResponse.user.role.name) {
              default:
                router.push("/agent-dashboard/properties");
                break;
              case "customer":
                router.push("/user-dashboard");
                break;
              case "agent":
                router.push("/agent-dashboard/properties");
                break;
              case "subAgent":
                router.push("/agent-dashboard/properties");
                break;
            }
          }
        }, 2000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (ex: any) {
      setLoading(false);
      toast(
        ex.response?.data?.message || "An error occurred. Please try again."
      );
    }
  }

  // Save credentials to localStorage
  const saveInfoToLocalStorage = (apiResult: any, encryptionKey: string) => {
    const token = apiResult.token;

    setLocalStorageField("token", token);
    setCookie("access_token", token);

    const decryptedInfo = JSON.parse(
      decryptData(apiResult.data, encryptionKey)
    );

    // Re-encrypt the userId and roleId before storing in localStorage
    const encryptedUserInfo = encryptData(
      {
        userId: decryptedInfo.userId,
        roleId: decryptedInfo.roleId,
      },
      encryptionKey
    );
    setLocalStorageField("userInfo", encryptedUserInfo);
  };

  return (
    <div className="max-w-lg bg-white p-6 lg:px-8 rounded-xl">
      <form
        className="flex flex-col gap-4 animate-fade-in"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        <h2 className="text-2xl md:text-3xl font-playfair text-realestatenavy font-semibold mb-4 text-left">
          Sign in to your account
        </h2>
        <div className="relative mb-2">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>
        <div className="relative">
          <Key
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
          >
            {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Link
            href="/confirm-email"
            className="text-sm text-gray-500 hover:text-primary transition font-medium"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-semibold rounded-lg mt-2 hover:bg-primary/90 shadow-realestate transition py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            "Log In"
          )}
        </Button>

        <p className="text-center text-gray-500 text-[13px]">
          Don&apos;t have an account?{" "}
          <a
            href="/select-account"
            className="text-[14px] text-magenta-pink hover:underline font-medium transition-all"
          >
            Sign&nbsp;up
          </a>
        </p>
      </form>
    </div>
  );
}
