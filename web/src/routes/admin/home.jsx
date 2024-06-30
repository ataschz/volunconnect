import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { APROBADO, CONVOCATORIA_FINALIZADA } from "@/constants";
import { firebaseApp } from "@/firebase";
import { cn } from "@/lib/utils";
import { getFirestore, collection, where, query } from "firebase/firestore";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";

export default function HomeRoute() {
  const [searchValue, setSearchValue] = useState();

  let q;

  if (searchValue && searchValue.trim() !== "") {
    q = query(
      collection(getFirestore(firebaseApp), "activities"),
      where("name", "==", searchValue)
    );
  } else {
    q = collection(getFirestore(firebaseApp), "activities");
  }

  const [value, loading] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  return (
    <div className="gap-cols-1 gap-3 flex flex-col">
      <Input
        className="w-full container"
        placeholder="Buscar entre voluntariados 🔎"
        defaultValue={searchValue}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        value?.docs
          .filter((doc) => doc.data().state !== CONVOCATORIA_FINALIZADA)
          .map((doc, index) => {
            const data = {
              ...doc.data(),
              id: doc.id,
            };

            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{data.name}</CardTitle>
                  <CardDescription>{data.description}</CardDescription>
                </CardHeader>
                <CardFooter className="grid-cols-2 gap-3 justify-between flex">
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
                          data?.volunteers?.filter((v) => v.state === APROBADO)
                            .length ?? 0
                        } / ${data.number_of_volunteers}`}
                  </Badge>
                  <Link to={`/${data.id}`}>
                    <Button>Ver Información</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
      )}
    </div>
  );
}
