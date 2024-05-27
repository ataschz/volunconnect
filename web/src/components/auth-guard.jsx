import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function AuthGuard({ children, text }) {
  const [user] = useAuthState(auth);

  if (user) return children;

  return (
    <div className="p-4 items-center w-full">
      <Link to="/auth/login" className="text-primary">
        <Button className="w-full">
          {text ?? "Inicia sesión para continuar ⭐️"}
        </Button>
      </Link>{" "}
    </div>
  );
}
