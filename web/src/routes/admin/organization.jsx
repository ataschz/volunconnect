import { firebaseApp } from "@/firebase";
import { getFirestore, collection, where, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import cookies from "js-cookie";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function OrganizationRoute() {
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

  return loading ? (
    <Spinner />
  ) : (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1">
        <H3>Mis Actividades</H3>
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
                <CardDescription>{data.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-3">
                <Link
                  to={`/organization/${orgId}/activity/${data.id}/postulations`}
                >
                  <Button>Ver Postulaciones</Button>
                </Link>
                <Button variant="secondary">Editar Actividad</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
