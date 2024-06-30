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
import { doc, deleteDoc } from "firebase/firestore";
import { useCallback } from "react";
import { useState } from "react";
import Cookies from "js-cookie";

export function DeleteDialog({ children, activityId }) {
  const orgId = Cookies.get("organization");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onDelete = useCallback(async () => {
    try {
      setIsLoading(true);

      await deleteDoc(doc(db, "activities", activityId));

      toast.success("Postulación eliminada exitosamente");
      navigate(`/organization/${orgId}`, { replace: true });
    } catch (error) {
      console.log("error", error);
      toast.error("Ocurrio un error al tratar de eliminar la convocatoria");
    } finally {
      setIsLoading(false);
    }
  }, [activityId, navigate, orgId]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar Convocatoria</DialogTitle>
          <DialogDescription>
            {`Se eliminará toda la información referida a la convocatoria y se le informara a los voluntarios.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full"
            isLoading={isLoading}
          >
            Si, eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
