import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
        <p className="text-balance text-muted-foreground">
          Ingrese su correo electrónico a continuación
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nombre@organizacion.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              to="/auth/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login con Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link to="/auth/registration" className="underline">
          Crear Cuenta
        </Link>
      </div>
    </div>
  );
}
