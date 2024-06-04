import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

const formSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "Minimo 10 caracteres",
    })
    .max(500, {
      message: "Maximo 500 caracteres",
    }),
});

export function PostulationDialog({ children, activityId }) {
  const [ok, setOk] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await updateDoc(doc(db, "activities", activityId), {
        volunteers: arrayUnion({
          id: user.uid,
          state: "pending",
          description: values.description,
        }),
        volunteersIds: arrayUnion(user.uid),
      });

      toast.success("Postulación enviada exitosamente");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Ocurrio un error al tratar de enviar tu postulación");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm" close={false}>
        <DialogHeader>
          <DialogTitle>Nueva Postulación ✨</DialogTitle>
          <DialogDescription>
            {`Por favor, completa el formulario para postularte a esta actividad.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="postulation-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Por que deseas participar?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="nombre@organizacion.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={() => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={ok}
                      onCheckedChange={() => setOk((prevValue) => !prevValue)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      He leido detenidamente la información de la actividad y
                      acepto todos los terminos y condiciones.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            form="postulation-form"
            className="w-full"
            type="submit"
            disabled={!ok}
          >
            Completar postulación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
