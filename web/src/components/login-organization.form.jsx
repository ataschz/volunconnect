import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  organization: z.string(),
  email: z.string().email("Email invalido"),
  password: z
    .string()
    .min(4, {
      message: "Minimo 4 caracteres",
    })
    .max(16, "Maximo 16 caracteres"),
});

export const LoginOrganizationForm = ({ onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        id="login-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organización</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la organización" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BwWM5uBV469dsMIgYyvS">
                    Fundación Todos juntos
                  </SelectItem>
                  <SelectItem value="BwWM5uBV469dsMIgYyvS">
                    Fundación Empate
                  </SelectItem>
                  <SelectItem value="BwWM5uBV469dsMIgYyvS">
                    Iglesia Evangelica Santo Domingo
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
                <Input placeholder="nombre@organizacion.com" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
