import { createBrowserRouter } from "react-router-dom";

import HomeRoute from "./admin/home";
import ActivityDetailRoute from "./admin/activity-detail";
import RootLayout from "./layouts/root-layout";
import LoginRoute from "./auth/login";
import RegistrationRoute from "./auth/registration";
import ProfileRoute from "./admin/profile";
import LoginOrganizationRoute from "./auth/login-organization";
import OrganizationRoute from "./admin/organization";
import ActivityPostulationsRoute from "./admin/postulations";
import CreateActivityRoute from "./admin/create-activity";
import EditActivityRoute from "./admin/edit-activity";

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
        element: <ActivityDetailRoute />,
      },
      {
        path: "/organization",
        children: [
          {
            path: "/organization/:id",
            element: <OrganizationRoute />,
          },
          {
            path: "/organization/create",
            element: <CreateActivityRoute />,
          },
          {
            path: "/organization/:id/activity/:activity_id/postulations",
            element: <ActivityPostulationsRoute />,
          },
          {
            path: "/organization/:id/activity/:activity_id/edit",
            element: <EditActivityRoute />,
          },
        ],
      },
      {
        path: "/auth",
        children: [
          {
            path: "/auth/login",
            element: <LoginRoute />,
          },
          {
            path: "/auth/login-organization",
            element: <LoginOrganizationRoute />,
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
