import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import petRoutes from "../modules/pet/pet.routes";
import applicationRoutes from "../modules/application/application.routes";
import medicalRoutes from "../modules/medical/medical.routes";
import fosterRoutes from "../modules/foster/foster.routes";
import userRoutes from "../modules/user/user.routes";
import favoriteRoutes from "../modules/favorite/favorite.routes";
import messageRoutes from "../modules/message/message.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import notificationRoutes from "../modules/notification/notification.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes
  },
  {
    path: "/pets",
    route: petRoutes
  },
  {
    path: "/applications",
    route: applicationRoutes
  },
  {
    path: "/medical",
    route: medicalRoutes
  },
  {
    path: "/foster",
    route: fosterRoutes
  },
  {
    path: "/users",
    route: userRoutes
  },
  {
    path: "/favorites",
    route: favoriteRoutes
  },
  {
    path: "/messages",
    route: messageRoutes
  },
  {
    path: "/analytics",
    route: analyticsRoutes
  },
  {
    path: "/notifications",
    route: notificationRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
