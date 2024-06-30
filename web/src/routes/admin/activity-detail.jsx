import { Spinner } from "@/components/ui/spinner";
import { H1, H3, H4, P } from "@/components/ui/typography";
import { firebaseApp } from "@/firebase";
import { format } from "date-fns";
import { doc, getFirestore } from "firebase/firestore";
import { useMemo } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostulationDialog } from "@/components/postulation-dialog";
import { AuthGuard } from "@/components/auth-guard";
import { APROBADO, PENDIENTE, googleMapsLibraries } from "@/constants";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ActivityDetailRoute() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });

  const { id } = useParams();
  const firestore = getFirestore(firebaseApp);
  const docRef = doc(firestore, "activities", id);

  const [value, loading] = useDocumentData(docRef);

  const center = useMemo(
    () =>
      value &&
      value?.address && {
        lat: value?.address?._lat,
        lng: value?.address?._long,
      },
    [value]
  );

  return !loading ? (
    <div className="grid grid-cols-1 gap-6">
      <H1>{value?.name}</H1>
      <div className="flex items-center gap-3">
        <div className="grid grid-cols-1 gap-1 w-fit">
          <H4>Categoria</H4>
          <Badge className="w-fit">{value?.category.toUpperCase()}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-1 w-fit">
          <H4>Estado</H4>
          <Badge className="w-fit">{value?.state.toUpperCase()}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <H3>Postulaciones</H3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Postulaciones Recibidas</CardDescription>
              <CardTitle>{value?.volunteers?.length ?? 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Postulaciones Aprobadas</CardDescription>
              <CardTitle>
                {value?.volunteers?.filter((v) => v.state === APROBADO)
                  ?.length ?? 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Postulaciones Pendientes</CardDescription>
              <CardTitle>
                {value?.volunteers?.filter((v) => v.state === PENDIENTE)
                  ?.length ?? 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Voluntarios Solicitados</CardDescription>
              <CardTitle>{value?.number_of_volunteers}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Progress
          classNameIndicator={
            value?.volunteers?.filter((v) => v.state === APROBADO)?.length ===
            Number(value?.number_of_volunteers)
              ? "bg-green-500"
              : ""
          }
          value={
            (value?.volunteers?.filter((v) => v.state === APROBADO)?.length /
              value?.number_of_volunteers) *
            100
          }
        />
      </div>
      <div className="grid grid-cols-1">
        <H3>Descripción</H3>
        <P>{value?.description}</P>
      </div>
      {isLoaded && center.lat && center.lng && (
        <div className="grid grid-cols-1 gap-3">
          <H3>Dirección</H3>
          <GoogleMap
            mapContainerClassName="z-10"
            mapContainerStyle={{
              borderRadius: "0.75rem",
              width: "100%",
              height: "100%",
              minHeight: "250px",
            }}
            center={center}
            clickableIcons={false}
            zoom={15}
            options={{
              disableDefaultUI: true,
              disableDoubleClickZoom: true,
              gestureHandling: "none",
            }}
          >
            <Marker position={center} />
          </GoogleMap>
        </div>
      )}
      <div className="grid grid-cols-1">
        <H3>Fechas</H3>
        <P>
          <span className="font-bold">Desde: </span>{" "}
          {format(value?.start_date.toDate(), "dd/MM/yyyy hh:mm a")}
        </P>
        <P>
          <span className="font-bold">Hasta: </span>{" "}
          {format(value?.end_date.toDate(), "dd/MM/yyyy hh:mm a")}
        </P>
      </div>
      <AuthGuard text="Debes iniciar sesión para postularte 🍾">
        <PostulationDialog activityId={id}>
          <Button
            disabled={
              value?.volunteers?.filter((v) => v.state === APROBADO)?.length >=
              value?.number_of_volunteers
            }
          >
            {value?.volunteers?.filter((v) => v.state === APROBADO)?.length >=
            value?.number_of_volunteers
              ? "Ya no se reciben postulaciones"
              : "Postularme a esta convocatoria 🤟🏼"}
          </Button>
        </PostulationDialog>
      </AuthGuard>
    </div>
  ) : (
    <div className="flex w-full h-full items-center justify-center">
      <Spinner />
    </div>
  );
}
