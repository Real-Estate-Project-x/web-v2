"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios-interceptor";
import { pickUserId } from "../../../../utils/helpers";

export const DashboardSettings = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    lastName: "",
    firstName: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const url = "/user/profile";
      const result = await axiosInstance.get(url);

      if (result?.data?.success) {
        const profile = result.data.data;
        setForm({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        });
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const userId = pickUserId();

    const url = "/user";
    const payload = {
      userId,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
    };

    try {
      const result = await axiosInstance.patch(url, payload);
      if (result?.data?.success) {
        toast("Profile updated successfully!");
        return;
      }
    } catch (ex: any) {
      setLoading(false);
      toast(
        ex.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>

        <form autoComplete="off" onSubmit={onSubmit} className="space-y-4">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium">
                  First name
                </label>
                <input
                  required
                  id="first-name"
                  className="w-full p-2 border rounded"
                  defaultValue={form?.firstName ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium">
                  Last name
                </label>
                <input
                  required
                  id="last-name"
                  className="w-full p-2 border rounded"
                  defaultValue={form?.lastName ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                required
                id="email"
                type="email"
                className="w-full p-2 border rounded"
                defaultValue={form?.email ?? ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold rounded-lg mt-2 hover:bg-primary/90 shadow-realestate transition py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1">
                  <svg
                    className="animate-spin h-5 w-5 mr-1"
                    viewBox="0 0 24 24"
                  >
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
                  Saving Changes...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
