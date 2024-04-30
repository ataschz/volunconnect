import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { auth } from "@/firebase";

export const Navbar = () => {
  const [user] = useAuthState(auth);

  console.log("user", user);

  return (
    <nav className="flex justify-between items-center border-b-[1px] border-slate-300 p-4 container">
      <strong>Valunconnect</strong>
      {user ? (
        <Link to="/profile" className="hover:cursor-pointer">
          <Avatar>
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback>
              {user?.displayName?.charAt(1) ?? user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link to="/auth/login">
          <Button>Login</Button>
        </Link>
      )}
    </nav>
  );
};
