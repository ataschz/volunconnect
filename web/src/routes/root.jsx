import { createBrowserRouter } from "react-router-dom";

import HomeRoute from "./admin/home";
import VolunteerDetail from "./admin/activity-detail";
import RootLayout from "./layouts/root-layout";
import LoginRoute from "./auth/login";
import RegistrationRoute from "./auth/registration";
import ProfileRoute from "./admin/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomeRoute />,
      },
      {
        path: "/profile",
        element: <ProfileRoute />,
      },
      {
        path: "/:id",
        element: <VolunteerDetail />,
      },
      {
        path: "/auth",
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
    ],
  },
]);
