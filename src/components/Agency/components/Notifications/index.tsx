'use client';


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellRing, 
  Check, 
  X, 
  Home, 
  DollarSign, 
  Calendar,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "message" | "viewing" | "offer" | "listing" | "alert" | "system";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  actionRequired?: boolean;
}

const AgentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "offer",
      title: "New Offer Received",
      description: "John Smith made an offer of $485,000 on 123 Oak Street",
      time: "5 minutes ago",
      isRead: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: 2,
      type: "viewing",
      title: "Viewing Scheduled",
      description: "Property viewing scheduled for 456 Maple Ave at 2:00 PM today",
      time: "1 hour ago",
      isRead: false,
      priority: "medium"
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      description: "Sarah Johnson: 'Is the property still available?'",
      time: "2 hours ago",
      isRead: false,
      priority: "medium"
    },
    {
      id: 4,
      type: "listing",
      title: "Listing Update Required",
      description: "Photos needed for 789 Pine Road listing",
      time: "3 hours ago",
      isRead: true,
      priority: "low",
      actionRequired: true
    },
    {
      id: 5,
      type: "alert",
      title: "Price Drop Alert",
      description: "Similar property in your area dropped price by 5%",
      time: "4 hours ago",
      isRead: true,
      priority: "low"
    },
    {
      id: 6,
      type: "system",
      title: "Monthly Report Ready",
      description: "Your December performance report is now available",
      time: "1 day ago",
      isRead: true,
      priority: "low"
    },
    {
      id: 7,
      type: "offer",
      title: "Counter Offer Received",
      description: "Client responded with counter offer on 321 Elm Street",
      time: "1 day ago",
      isRead: true,
      priority: "high",
      actionRequired: true
    },
    {
      id: 8,
      type: "viewing",
      title: "Viewing Cancelled",
      description: "Client cancelled viewing for 654 Birch Lane",
      time: "2 days ago",
      isRead: true,
      priority: "medium"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "offer":
        return <DollarSign className="h-4 w-4" />;
      case "viewing":
        return <Calendar className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "listing":
        return <Home className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "system":
        return <BellRing className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "high") return "text-red-600 bg-red-50";
    if (priority === "medium") return "text-yellow-600 bg-yellow-50";
    return "text-blue-600 bg-blue-50";
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.isRead).length;

  const filterNotifications = (filter: string) => {
    switch (filter) {
      case "unread":
        return notifications.filter(n => !n.isRead);
      case "action":
        return notifications.filter(n => n.actionRequired);
      case "high":
        return notifications.filter(n => n.priority === "high");
      default:
        return notifications;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Notifications Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
              <h2 className="text-2xl font-semibold">Notifications</h2>
              <p className="text-muted-foreground py-2">
                Stay updated with your real estate activities
              </p>
              </div>
              <div className="flex items-center gap-2">
              <Badge variant="secondary">
                  {unreadCount} unread
              </Badge>
              {actionRequiredCount > 0 && (
                  <Badge variant="destructive">
                  {actionRequiredCount} action required
                  </Badge>
              )}
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all read
              </Button>
              </div>
          </div>

          {/* Notifications Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full lg:w-[400px] grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                  Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="action">
                  Action Required
              </TabsTrigger>
              <TabsTrigger value="high">
                  High Priority
              </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
              <NotificationsList
                  notifications={filterNotifications("all")}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
              />
              </TabsContent>

              <TabsContent value="unread">
              <NotificationsList
                  notifications={filterNotifications("unread")}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
              />
              </TabsContent>

              <TabsContent value="action">
              <NotificationsList
                  notifications={filterNotifications("action")}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
              />
              </TabsContent>

              <TabsContent value="high">
              <NotificationsList
                  notifications={filterNotifications("high")}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
              />
              </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  getNotificationIcon: (type: string) => React.ReactNode;
  getNotificationColor: (type: string, priority: string) => string;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getNotificationColor
}) => {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! No notifications to show.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`transition-all hover:shadow-md ${
            !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {notification.actionRequired && (
                      <Badge variant="destructive" 
                      //size="sm"
                      >
                        Action Required
                      </Badge>
                    )}
                    <Badge
                      variant={notification.priority === "high" ? "destructive" : "secondary"}
                      //size="sm"
                    >
                      {notification.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(notification.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentNotifications;