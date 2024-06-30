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
import { H4 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { APROBADO, CONVOCATORIA_FINALIZADA } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between gap-3">
          <H4>Convocatorias Abiertas</H4>
          <Link to={`/organization/create`}>
            <Button size="sm">Crear Convocatoria</Button>
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
                  <CardFooter className="flex gap-3 items-center justify-between">
                    <Badge
                      className={cn(
                        data?.volunteers?.filter((v) => v.state === APROBADO)
                          .length === Number(data.number_of_volunteers)
                          ? "bg-green-500"
                          : ""
                      )}
                    >
                      {data?.volunteers?.filter((v) => v.state === APROBADO)
                        .length === Number(data.number_of_volunteers)
                        ? "Convocatoria Completa"
                        : `${
                            data?.volunteers?.filter(
                              (v) => v.state === APROBADO
                            ).length ?? 0
                          } / ${data.number_of_volunteers}`}
                    </Badge>
                    <div className="flex gap-3 items-center">
                      <Link
                        to={`/organization/${orgId}/activity/${data.id}/edit`}
                        state={{
                          ...data,
                        }}
                      >
                        <Button size="sm" variant="secondary">
                          Editar
                        </Button>
                      </Link>
                      <Link
                        to={`/organization/${orgId}/activity/${data.id}/postulations`}
                      >
                        <Button size="sm" variant="outline">
                          Ver Postulaciones
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <H4>Convocatorias Finalizadas/Cerradas</H4>
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
    </div>
  );
}
