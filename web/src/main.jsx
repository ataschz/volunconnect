import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@/styles/global.css";
import { Toaster } from "sonner";
import { router } from "./routes/root";
import { Loader2Icon } from "lucide-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={<Loader2Icon className="h-10 w-10 animate-spin" />}
    />
    <Toaster />
  </React.StrictMode>
);
