import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nombre invalido",
  }),
  lastName: z.string().min(3, {
    message: "Apellido invalido",
  }),
  dni: z
    .string()
    .min(8, {
      message: "DNI invalido",
    })
    .max(10, {
      message: "DNI invalido",
    }),
  email: z.string().email("Email invalido"),
  password: z
    .string()
    .min(4, {
      message: "Minimo 4 caracteres",
    })
    .max(16, "Maximo 16 caracteres"),
});

export const RegistrationForm = ({ onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      description: "",
      type: "volunteer",
    },
  });

  return (
    <Form {...form}>
      <form
        id="registration-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="Julieta" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="Jofre" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dni"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNI</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="XXXXXXXX" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="nombre@email.com"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  type="password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
