import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { auth } from "@/firebase";
import cookies from "js-cookie";

export const Navbar = () => {
  const orgId = cookies.get("organization");
  const [user] = useAuthState(auth);
  const { pathname } = useLocation();

  return (
    <nav className="flex sticky top-0 bg-white z-50 justify-between items-center border-b-[1px] border-slate-300 py-4">
      <Link to={orgId ? `/organization/${orgId}` : "/"}>
        <strong className="text-2xl font-black">🤲 VolunConnect</strong>
      </Link>
      {user ? (
        <Link to="/profile" className="hover:cursor-pointer">
          <Avatar>
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback>
              {user?.displayName?.charAt(1) ?? user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : pathname.includes("/auth/login") ||
        pathname.includes("/auth/registration") ? null : (
        <Link to="/auth/login">
          <Button variant="outline">Iniciar Sesión</Button>
        </Link>
      )}
    </nav>
  );
};
