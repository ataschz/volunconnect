import { Spinner } from "@/components/ui/spinner";
import { H1, H3, P } from "@/components/ui/typography";
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

export default function ActivityDetailRoute() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { id } = useParams();
  const firestore = getFirestore(firebaseApp);
  const docRef = doc(firestore, "activities", id);

  const [value, loading] = useDocumentData(docRef);

  const center = useMemo(
    () =>
      value &&
      value.address && {
        lat: value?.address?._lat,
        lng: value?.address?._long,
      },
    [value]
  );

  return !loading ? (
    <div className="grid grid-cols-1 gap-6">
      <H1>{value.name}</H1>
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
        <H3>Descripción</H3>
        <P>{value.description}</P>
      </div>
      <div className="grid grid-cols-1 w-fit">
        <H3>Categoria</H3>
        <Badge>{value.category}</Badge>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <H3>Voluntarios necesarios</H3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <P>
            Voluntarios Necesarios:{" "}
            {value.number_of_volunteers -
              value.volunteers.filter((v) => v.state === "approved").length}
          </P>
          <P>
            {" "}
            Voluntarios Aprobados:{" "}
            {value.volunteers.filter((v) => v.state === "approved").length}
          </P>
          <P>Postulaciones Recibidas: {value.volunteers.length}</P>
          <P>Voluntarios Solicitados: {value.number_of_volunteers}</P>
        </div>
        <Progress
          value={
            (value.volunteers.filter((v) => v.state === "approved").length /
              value.number_of_volunteers) *
            100
          }
        />
      </div>
      <div className="grid grid-cols-1">
        <H3>Fechas</H3>
        <P>
          <span className="font-bold">Desde: </span>{" "}
          {format(value.start_date.toDate(), "dd/MM/yyyy hh:mm a")}
        </P>
        <P>
          <span className="font-bold">Hasta: </span>{" "}
          {format(value.end_date.toDate(), "dd/MM/yyyy hh:mm a")}
        </P>
      </div>
      <AuthGuard text="Debes iniciar sesión para postularte 🍾">
        <PostulationDialog activityId={id}>
          <Button
            disabled={
              value.volunteers.filter((v) => v.state === "approved").length >=
              value.number_of_volunteers
            }
          >
            {value.volunteers.filter((v) => v.state === "approved").length >=
            value.number_of_volunteers
              ? "Esta actividad tiene cupo completo, prueba en otra 👍🏼"
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
