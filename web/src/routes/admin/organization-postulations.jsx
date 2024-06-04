import { db, firebaseApp } from "@/firebase";
import {
  getFirestore,
  collection,
  where,
  query,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import cookies from "js-cookie";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H3, H4, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function OrganizationActivityPostulationsRoute() {
  const orgId = cookies.get("organization");

  const [value, loading] = useCollection(
    query(
      collection(getFirestore(firebaseApp), "activities"),
      where("organization", "==", orgId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const handleApprove = async (volunteeId, activityId) => {
    const docRef = doc(db, "activities", activityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let volunteers = docSnap.data().volunteers;

      for (let v of volunteers) {
        if (v.id === volunteeId) {
          v.state = "approved";
          break;
        }
      }

      await updateDoc(docRef, { volunteers });
      toast.success("Voluntario Aprobado");
    }
  };

  const handleReject = async (volunteeId, activityId) => {
    const docRef = doc(db, "activities", activityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let volunteers = docSnap.data().volunteers;

      for (let v of volunteers) {
        if (v.id === volunteeId) {
          v.state = "rejected";
          break;
        }
      }

      await updateDoc(docRef, { volunteers });
      toast.success("Voluntario Aprobado");
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1">
        <H3>Postulaciones</H3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {value.docs.map((doc, index) => {
          const data = {
            ...doc.data(),
            id: doc.id,
          };

          return (
            <Card key={index} className="flex flex-col gap-1">
              <CardHeader>
                <CardTitle>{data.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {data.volunteers.length > 0 ? (
                  data.volunteers.map((voluntee, index) => (
                    <div className="flex flex-col" key={index}>
                      <div className="flex gap-3 items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <h5>{voluntee.id}</h5>
                          <P className="text-muted-foreground">{`"${voluntee.description}"`}</P>
                        </div>
                        {voluntee.state.toUpperCase() === "PENDING" && (
                          <div className="flex flex-col gap-3">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleApprove(voluntee.id, data.id)
                              }
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(voluntee.id, data.id)}
                            >
                              Rechazar
                            </Button>
                          </div>
                        )}
                        {voluntee.state.toUpperCase() !== "PENDING" && (
                          <Badge
                            className={cn(
                              "w-fit",
                              voluntee.state.toUpperCase() === "APPROVED"
                                ? "bg-green-500"
                                : ""
                            )}
                            variant={
                              voluntee.state.toUpperCase() === "REJECTED"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {voluntee.state.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  ))
                ) : (
                  <H4>No hay postulaciones</H4>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
