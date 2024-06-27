import cookies from "js-cookie";
import { H3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useJsApiLoader } from "@react-google-maps/api";
import { PlacesAutocompleteInput } from "@/components/places-autocomplete-input";
import { GeoPoint, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Minimo 4 caracteres",
    })
    .max(16, "Maximo 16 caracteres"),
  description: z
    .string()
    .min(4, {
      message: "Minimo 4 caracteres",
    })
    .max(16, "Maximo 16 caracteres"),
  category: z
    .string()
    .min(2, {
      message: "Minimo 4 caracteres",
    })
    .max(16, "Maximo 16 caracteres"),
  start_date: z.date(),
  end_date: z.date(),
  number_of_volunteers: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export default function OrganizationCreateRoute() {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const orgId = cookies.get("organization");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await addDoc(collection(db, "activities"), {
        name: values.name,
        description: values.description,
        category: values.category,
        number_of_volunteers: values.number_of_volunteers,
        end_date: values.end_date,
        start_date: values.start_date,
        address: new GeoPoint(values.lat, values.lng),
        organization: orgId,
      });

      toast.success("Cuenta creada exitosamente");
      navigate(`/organization/${orgId}`, { replace: true });
    } catch (error) {
      toast.error("Ocurrio un error al tratar de crear la cuenta");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1">
        <H3>Crear Nueva Convocatoria</H3>
      </div>
      <Form {...form}>
        <form
          id="registration-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la actividad</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Colecta Solidaria"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción de la actividad</FormLabel>
                <FormControl>
                  <Textarea
                    autoComplete="off"
                    placeholder="Descripción detallada"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Construcción"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number_of_volunteers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voluntarios Necesarios</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    autoComplete="off"
                    placeholder="4"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {isLoaded && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección de la actividad</FormLabel>
                  <FormControl>
                    <PlacesAutocompleteInput
                      defaultValue={field.value}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccione una fecha de inicio</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccione una fecha de fin</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Guardar
          </Button>
        </form>
      </Form>
    </div>
  );
}
