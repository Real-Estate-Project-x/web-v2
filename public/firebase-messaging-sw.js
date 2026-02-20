importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Must mirror your firebaseConfig
firebase.initializeApp({
  apiKey: "AIzaSyDCCzuCEIyy6GBuXQ59mMKdcDArDfDEf08",
  authDomain: "blupodd.firebaseapp.com",
  projectId: "blupodd",
  storageBucket: "blupodd.firebasestorage.app",
  messagingSenderId: "960932343124",
  appId: "1:960932343124:web:25a904e7823350b17b2cc1",
  measurementId: "G-B6Q0LQVVY1",
});

const messaging = firebase.messaging();

// Handles notifications when app is in the BACKGROUND or CLOSED
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const { title, body, badge, icon } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: icon || "/icon.png",
    badge: badge || "/badge.png",
    requireInteraction: true, // matches your backend config
    data: payload.data, // your metadata comes through here
  });
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
