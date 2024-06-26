import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { H1, Large, Lead, P } from "@/components/ui/typography";
import { auth, db } from "@/firebase";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import cookies from "js-cookie";
import { APROBADO, RECHAZADO } from "@/constants";

export default function ProfileRoute() {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);
  const [user] = useAuthState(auth);

  let qPostulations;

  if (user && user.email) {
    qPostulations = query(
      collection(db, "activities"),
      where("volunteersIds", "array-contains", user?.uid)
    );
  } else {
    qPostulations = query(collection(db, "activities"));
  }

  const [postulations, loadingPostulations] = useCollection(qPostulations);

  let q;

  if (user && user.email) {
    q = query(collection(db, "users"), where("email", "==", user.email));
  } else {
    q = query(collection(db, "users"));
  }

  const [values, loading] = useCollection(q);

  const userData = useMemo(() => {
    if (values && values.docs && values.docs.length > 0) {
      return {
        ...values.docs[0].data(),
      };
    }
  }, [values]);

  const handleSignOut = async () => {
    cookies.remove("organization");
    const res = await signOut();

    if (res) {
      toast.success("Sesión cerrada exitosamente");
      navigate("/");
    } else {
      toast.error("Ocurrió un error al cerrar sesión");
    }
  };

  return user && userData && !loading ? (
    <div className="flex flex-col items-start justify-center gap-6">
      <div className="flex flex-col gap-3 my-12 items-center justify-center w-full">
        <H1>
          {userData.name} {userData.lastName}
        </H1>
        <Lead>Email: {userData.email}</Lead>
        <Large>DNI: {userData.dni}</Large>
      </div>
      {loadingPostulations ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-full gap-3">
          {postulations.docs.map((postulation, index) => {
            const postulationData = postulation.data();
            const state = postulationData.volunteers
              .find((v) => v.id === user.uid)
              .state.toUpperCase();

            return (
              <Link to={`/${postulation.id}`} key={index}>
                <Card>
                  <CardHeader>
                    <Badge
                      className={cn(
                        "w-fit",
                        state === APROBADO ? "bg-green-500" : ""
                      )}
                      variant={state === RECHAZADO ? "destructive" : "default"}
                    >
                      {state}
                    </Badge>
                    <CardTitle className="text-xl">
                      {postulationData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <P>
                      <span className="font-bold">Desde: </span>{" "}
                      {format(
                        postulationData.start_date.toDate(),
                        "dd/MM/yyyy hh:mm a"
                      )}
                    </P>
                    <P>
                      <span className="font-bold">Hasta: </span>{" "}
                      {format(
                        postulationData.end_date.toDate(),
                        "dd/MM/yyyy hh:mm a"
                      )}
                    </P>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
      <Button className="w-full md:w-fit self-center" onClick={handleSignOut}>
        Cerrar Sesión
      </Button>
    </div>
  ) : (
    <Spinner />
  );
}
