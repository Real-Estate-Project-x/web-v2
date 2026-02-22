"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { getBrowserName, pickUserId } from "../../utils/helpers";

export function useFirebaseNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [error, setError] = useState<string | null>(null);

  // Listen for foreground messages (app is OPEN)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupForegroundListener = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);

        // Browser won't auto-show a notification when app is open,
        // so you handle it manually — e.g. show a toast
        const { title, body } = payload.notification ?? {};
        toast(title, { description: JSON.stringify(body) });
      });
    };

    setupForegroundListener();
    return () => unsubscribe?.();
  }, []);

  const requestPermissionAndGetToken = async () => {
    try {
      // 1. Ask the browser for notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setError("Notification permission denied");
        return null;
      }

      // 2. Get the FCM token — this is the `deviceToken` your backend needs
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        setError("Firebase messaging not supported in this browser");
        return null;
      }

      // Remove later => Unregister all existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log({ registrations });
      await Promise.all(registrations.map((r) => r.unregister()));

      const swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      // Wait for the SW to be active before proceeding
      await navigator.serviceWorker.ready;

      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });
      console.log({ fcmToken });

      if (!fcmToken) {
        setError("Failed to get FCM token");
        return null;
      }

      setToken(fcmToken);

      // 3. Send the token to your backend so it can be stored
      //    This is what your backend puts into `deviceTokens`
      const result = await fetch("/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: pickUserId(),
          deviceToken: {
            agentName: getBrowserName(),
            deviceId: fcmToken,
          },
        }),
      });
      const full_response = await result.json();
      console.log({ full_response });

      return fcmToken;
    } catch (err) {
      setError(String(err));
      return null;
    }
  };

  return { requestPermissionAndGetToken, token, permission, error };
}
