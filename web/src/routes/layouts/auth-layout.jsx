import { Navbar } from "@/components/navbar";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid grid-cols-1 gap-3 container">
      <Navbar />
      <Outlet />
    </div>
  );
}
