import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Registration() {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Crear Cuenta</h1>
        <p className="text-balance text-muted-foreground">
          Ingresa tus datos para crear una cuenta
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">Nombre</Label>
            <Input id="first-name" placeholder="Julieta" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Apellido</Label>
            <Input id="last-name" placeholder="Jofre" required />
          </div>
        </div>
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
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" />
        </div>
        <Button type="submit" className="w-full">
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
