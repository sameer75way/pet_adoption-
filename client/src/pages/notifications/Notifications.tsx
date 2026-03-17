import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../../services/api";
import { getSocket } from "../../services/socket";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data.data);
      } catch (loadError) {
        const err = loadError as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || "Failed to load notifications");
      }
    };

    void loadNotifications();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotificationNew = (notification: NotificationItem) => {
      setNotifications((current) => {
        if (current.some((item) => item._id === notification._id)) {
          return current;
        }
        return [notification, ...current];
      });
    };

    const handleNotificationUpdated = (notification: NotificationItem) => {
      setNotifications((current) =>
        current.map((item) => (item._id === notification._id ? notification : item))
      );
    };

    socket.on("notification:new", handleNotificationNew);
    socket.on("notification:updated", handleNotificationUpdated);

    return () => {
      socket.off("notification:new", handleNotificationNew);
      socket.off("notification:updated", handleNotificationUpdated);
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((current) =>
        current.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch {
      setError("Unable to mark this notification as read right now.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Stay on top of application updates, foster events, and new activity from the shelter.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stack spacing={2}>
          {notifications.map((notification) => (
            <Card key={notification._id}>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {notification.title}
                      </Typography>
                      <Chip
                        label={notification.isRead ? "Read" : "New"}
                        color={notification.isRead ? "default" : "secondary"}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  {!notification.isRead && (
                    <Button variant="outlined" onClick={() => markAsRead(notification._id)}>
                      Mark as Read
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
          {notifications.length === 0 && (
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  No notifications yet. Updates from reviews and assignments will appear here.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      </motion.div>
    </Container>
  );
};

export default NotificationsPage;
