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
import { CONVOCATORIA_FINALIZADA } from "@/constants";

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
      <div className="flex items-center justify-between gap-3">
        <H3>Convocatorias Abiertas</H3>
        <Link to={`/organization/create`}>
          <Button>Crear Actividad</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {value?.docs
          .filter((doc) => doc.data().state !== CONVOCATORIA_FINALIZADA)
          .map((doc, index) => {
            const data = {
              ...doc.data(),
              id: doc.id,
            };

            return (
              <Card
                key={index}
                className="flex h-full justify-between items-stretch flex-col gap-1"
              >
                <CardHeader>
                  <CardTitle>{data.name}</CardTitle>
                  <CardDescription>{data.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-3 items-center justify-end">
                  <Button size="sm" variant="secondary">Editar</Button>
                  <Link
                    to={`/organization/${orgId}/activity/${data.id}/postulations`}
                  >
                    <Button size="sm" variant="outline">Ver Postulaciones</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
      </div>
      <div className="flex items-center justify-between gap-3">
        <H3>Convocatorias Finalizadas/Cerradas</H3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {value?.docs
          .filter((doc) => doc.data().state === CONVOCATORIA_FINALIZADA)
          .map((doc, index) => {
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
              </Card>
            );
          })}
      </div>
    </div>
  );
}
