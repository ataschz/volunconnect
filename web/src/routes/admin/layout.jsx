import { Navbar } from "@/components/navbar";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  if (!user) {
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Navbar />
      <Outlet />
    </div>
  );
}
