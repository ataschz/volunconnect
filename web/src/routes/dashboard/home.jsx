import { Navbar } from "@/components/navbar";
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
import { firebaseApp } from "@/firebase";
import { getFirestore, collection, where, query } from "firebase/firestore";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";

export default function Home() {
  const [searchValue, setSearchValue] = useState();

  let q;

  if (searchValue && searchValue.trim() !== "") {
    q = query(
      collection(getFirestore(firebaseApp), "volunteer_calls"),
      where("name", "==", searchValue)
    );
  } else {
    q = collection(getFirestore(firebaseApp), "volunteer_calls");
  }

  const [value, loading, error] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  /* 
  let q;

  if (searchValue && searchValue.trim() !== "") {
    q = query(
      collection(
      getFirestore(firebaseApp),
      "volunteer_calls"
    ),
      where("name", "==", searchValue)
    );
  } else {
    q = collection(
      getFirestore(firebaseApp),
      "volunteer_calls"
    );
  }

  const { value, loading, error } = useCollection(
    collection(getFirestore(firebaseApp), "volunteer_calls"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  */

  return (
    <div className="flex flex-col gap-2">
      <Navbar />
      <div className="container gap-cols-1 gap-3 flex flex-col">
        <Input
          className="w-full container"
          placeholder="Buscar entre voluntariados 🔎"
          defaultValue={searchValue}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {value &&
          value.docs.map((doc, index) => {
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
                <CardFooter className="flex flex-row-reverse items-center justify-between">
                  <Link to={`/${data.id}`}>
                    <Button>Ver Información</Button>
                  </Link>
                  <div className="flex items-center gap-3">
                    Voluntarios
                    <Badge>
                      {data.volunteers.length}/{data.number_of_volunteers}
                    </Badge>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
