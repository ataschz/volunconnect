import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { auth } from "@/firebase";

export const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="flex sticky top-0 bg-white z-50 justify-between items-center border-b-[1px] border-slate-300 p-4 container">
      <Link to="/">
        <strong>Valunconnect</strong>
      </Link>
      {user ? (
        <Link to="/admin/profile" className="hover:cursor-pointer">
          <Avatar>
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback>
              {user?.displayName?.charAt(1) ?? user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link to="/auth/login">
          <Button variant="outline">Iniciar Sesión</Button>
        </Link>
      )}
    </nav>
  );
};
