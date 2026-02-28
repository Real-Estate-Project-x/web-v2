"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios-interceptor";
import { pickUserId } from "../../../../../utils/helpers";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    lastName: "",
    firstName: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const url =
        "/user/profile?fields=success,message,data(id,email,firstName,lastName)";
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const userId = pickUserId();

    const url = "/user?fields=success,message";
    const payload = {
      userId,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
    };

    try {
      const result = await axiosInstance.patch(url, payload);
      if (result?.data?.success) {
        toast(result?.data.message ?? "Profile updated successfully!");
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <form
                autoComplete="off"
                onSubmit={onSubmit}
                className="space-y-4"
              >
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium"
                      >
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
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium"
                      >
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
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
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
        </div>
      </main>
    </div>
  );
};

export default Settings;
