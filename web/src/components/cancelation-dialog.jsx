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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase";
import { CONVOCATORIA_FINALIZADA } from "@/constants";
import { doc, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useState } from "react";
import Cookies from "js-cookie";

export function CancelationDialog({ children, activityId }) {
  const orgId = Cookies.get("organization");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onCancel = useCallback(async () => {
    try {
      setIsLoading(true);

      await updateDoc(doc(db, "activities", activityId), {
        state: CONVOCATORIA_FINALIZADA,
      });

      toast.success("Postulación finalizada exitosamente");
      navigate(`/organization/${orgId}`, { replace: true });
    } catch (error) {
      toast.error("Ocurrio un error al tratar de finalizar la convocatoria");
    } finally {
      setIsLoading(false);
    }
  }, [activityId, navigate, orgId]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Finalizar Convocatoria</DialogTitle>
          <DialogDescription>
            {`No se recibiran mas postulaciones y se les informara a los voluntarios enrolados el cambio de estado.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onCancel}
            className="w-full"
            type="submit"
            isLoading={isLoading}
          >
            Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
