import { LoginOrganizationForm } from "@/components/login-organization.form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import cookies from "js-cookie";

export default function LoginOrganizationRoute() {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, loading] =
    useSignInWithEmailAndPassword(auth);

  const handleLoginAccount = async (values) => {
    try {
      const { user } = await signInWithEmailAndPassword(
        values.email,
        values.password
      );

      if (!user) {
        throw new Error();
      }

      cookies.set("organization", values.organization);
      toast.success("Sesión iniciada exitosamente");
      navigate(`/organization/${values.organization}`, { replace: true });
    } catch (error) {
      toast.error("Ocurrio un error al tratar de iniciar la sesión");
    }
  };

  return (
    <div className="mx-auto grid md:w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
        <p className="text-balance text-muted-foreground">
          Ingrese su correo electrónico a continuación
        </p>
      </div>
      <div className="grid gap-4">
        <LoginOrganizationForm onSubmit={handleLoginAccount} />
        <Button
          isLoading={loading}
          form="login-form"
          type="submit"
          className="w-full"
        >
          Login
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link to="/auth/registration" className="underline">
          Crear Cuenta
        </Link>
      </div>
      <Separator />
      <div className="mt-4 text-center text-sm">
        ¿Eres una organización?{" "}
        <Link to="/auth/registration" className="underline">
          Ingresar aquí
        </Link>
      </div>
    </div>
  );
}
