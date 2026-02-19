"use client";
import { useFirebaseNotifications } from "@/hooks/useFirebaseNotifications";

export default function EnableNotifications() {
  const { requestPermissionAndGetToken, permission, token, error } =
    useFirebaseNotifications();

  return (
    <div>
      <button
        onClick={requestPermissionAndGetToken}
        disabled={permission === "denied"}
      >
        {permission === "granted"
          ? "✅ Notifications Enabled"
          : permission === "denied"
          ? "🚫 Blocked — enable in browser settings"
          : "🔔 Enable Push Notifications"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {token && <p style={{ fontSize: 12 }}>Token: {token.slice(0, 20)}...</p>}
    </div>
  );
}
