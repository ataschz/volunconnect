import { createBrowserRouter } from "react-router-dom";

import HomeRoute from "./admin/home";
import VolunteerDetail from "./admin/activity-detail";
import RootLayout from "./layouts/root-layout";
import LoginRoute from "./auth/login";
import RegistrationRoute from "./auth/registration";
import ProfileRoute from "./admin/profile";
import LoginOrganizationRoute from "./auth/login-organization";
import OrganizationRoute from "./admin/organization";
import OrganizationActivityPostulationsRoute from "./admin/organization-postulations";
import OrganizationCreateRoute from "./admin/organization-create";

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
        path: "/organization",
        children: [
          {
            path: "/organization/:id",
            element: <OrganizationRoute />,
          },
          {
            path: "/organization/create",
            element: <OrganizationCreateRoute />,
          },
          {
            path: "/organization/:id/activity/:activity_id/postulations",
            element: <OrganizationActivityPostulationsRoute />,
          },
        ],
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
