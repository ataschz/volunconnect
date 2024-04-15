import { createBrowserRouter } from "react-router-dom";

import HomeRoute from "./dashboard/home";
import AuthLayout from "./auth/layout";
import LoginRoute from "./auth/login";
import RegistrationRoute from "./auth/registration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
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
