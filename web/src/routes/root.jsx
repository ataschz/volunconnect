import { createBrowserRouter } from "react-router-dom";

import HomeRoute from "./dashboard/home";
import AuthLayout from "./auth/layout";
import LoginRoute from "./auth/login";
import ProfileRoute from "./admin/profile";
import RegistrationRoute from "./auth/registration";
import AdminLayout from "./admin/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/profile",
        element: <ProfileRoute />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <LoginRoute />,
      },
      {
        path: "/auth/registration",
        element: <RegistrationRoute />,
      },
    ],
  },
]);
