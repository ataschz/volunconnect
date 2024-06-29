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
import { H3, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { APROBADO, PENDIENTE, RECHAZADO } from "@/constants";

export default function OrganizationActivityPostulationsRoute() {
  const { id } = useParams();
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

  const [users] = useCollection(
    query(collection(getFirestore(firebaseApp), "users")),
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
          v.state = APROBADO;
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
          v.state = RECHAZADO;
          break;
        }
      }

      await updateDoc(docRef, { volunteers });
      toast.success("Voluntario Rechazado");
    }
  };

  const getUserName = (userEmail) => {
    const user = users.docs.find((doc) => doc.data().email === userEmail);

    if (user) {
      return `${user.data().name} ${user.data().lastName}`;
    }

    return "Usuario no encontrado";
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1">
        <H3>Postulaciones</H3>
      </div>
      {JSON.stringify(value?.docs.find((doc) => doc.id === id))}
      {JSON.stringify(value?.docs.find((doc) => doc.id === id))}
      <div className="grid grid-cols-1 gap-3">
        {value?.docs.map((doc, index) => {
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
                {data?.volunteers?.length > 0 ? (
                  data?.volunteers?.map((voluntee, index) => (
                    <div
                      className="flex border p-3 rounded-md flex-col"
                      key={index}
                    >
                      <div className="flex gap-3 items-center justify-between">
                        <div className="flex flex-col gap-1">
                          {users?.docs && (
                            <h5 className="font-bold">
                              {getUserName(voluntee.email)}
                            </h5>
                          )}
                          <P className="text-muted-foreground">
                            {voluntee.description}
                          </P>
                        </div>
                        {voluntee.state.toUpperCase() === PENDIENTE && (
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
                        {voluntee.state.toUpperCase() !== PENDIENTE && (
                          <Badge
                            className={cn(
                              "w-fit",
                              voluntee.state.toUpperCase() === APROBADO
                                ? "bg-green-500"
                                : ""
                            )}
                            variant={
                              voluntee.state.toUpperCase() === RECHAZADO
                                ? "destructive"
                                : "default"
                            }
                          >
                            {voluntee.state.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <span>No hay postulaciones</span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
