import { RegistrationForm } from "@/components/registration.form";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function Registration() {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, loading] =
    useCreateUserWithEmailAndPassword(auth);

  const handleCreateAccount = async (values) => {
    const { user } = await createUserWithEmailAndPassword(
      values.email,
      values.password
    );

    if (user) {
      toast.success("Cuenta creada exitosamente");
      navigate("/", { replace: true });
    } else {
      toast.error("Ocurrio un error al tratar de crear la cuenta");
    }
  };

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Crear Cuenta</h1>
        <p className="text-balance text-muted-foreground">
          Ingresa tus datos para crear una cuenta
        </p>
      </div>
      <div className="grid gap-4">
        <RegistrationForm onSubmit={handleCreateAccount} />
        <Button
          isLoading={loading}
          form="registration-form"
          type="submit"
          className="w-full"
        >
          Crea una cuenta
        </Button>
        <Button variant="outline" className="w-full">
          Regístrate con Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/auth/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
