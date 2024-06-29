import { Navbar } from "@/components/navbar";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="grid grid-cols-1 mb-12 gap-3 container">
      <Navbar />
      <Outlet />
      <TailwindIndicator />
    </div>
  );
}
