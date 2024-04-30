import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);

  const handleSignOut = async () => {
    const res = await signOut();

    if (res) {
      toast.success("Sesión cerrada exitosamente");
      navigate("/auth/login");
    } else {
      toast.error("Ocurrió un error al cerrar sesión");
    }
  };

  return (
    <div className="container flex justify-center items-center flex-col gap-8">
      <h1>Profile</h1>
      <Button onClick={handleSignOut}>Cerrar Sesión</Button>
    </div>
  );
}
