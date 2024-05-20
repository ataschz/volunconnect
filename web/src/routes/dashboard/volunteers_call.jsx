import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { firebaseApp } from "@/firebase";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { format } from "date-fns";
import { doc, getFirestore } from "firebase/firestore";
import { useMemo } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";

export default function VolunteerCalls() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { id } = useParams();
  const firestore = getFirestore(firebaseApp);
  const docRef = doc(firestore, "volunteer_calls", id);

  const [value, loading, error] = useDocumentData(docRef);

  const defaultCenter = useMemo(
    () =>
      value &&
      value.address && {
        lat: value?.address?.latitude,
        lng: value?.address?.longitude,
      },
    [value]
  );

  return value ? (
    <div className="flex flex-col gap-6">
      <Navbar />
      <div className="container flex flex-col">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {value.name}
        </h1>
        <div className="grid grod-col-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col col-span-1 gap-3">
            <div className="fle flex-col">
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                Description
              </h3>
              <p className="leading-7">{value.description}</p>
            </div>
            {isLoaded && (
              <div className="fle flex-col">
                <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                  Dirección
                </h3>
                <GoogleMap
                  mapContainerClassName="z-10"
                  mapContainerStyle={{
                    borderRadius: "0.75rem",
                    width: "100%",
                    height: "400px",
                  }}
                  center={defaultCenter}
                  clickableIcons={false}
                  zoom={15}
                  options={{
                    disableDefaultUI: true,
                    disableDoubleClickZoom: true,
                    gestureHandling: "none",
                  }}
                >
                  <Marker position={defaultCenter} />
                </GoogleMap>
              </div>
            )}
          </div>
          <div className="flex flex-col col-span-1 gap-3">
            <div className="fle flex-col">
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                Categoria
              </h3>
              <p className="leading-7">Sin especificar</p>
            </div>
            <div className="fle flex-col">
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                Requisitos
              </h3>
              <p className="leading-7">
                <strong>Numero de Voluntarios solicitados: </strong>
                <br />
                <Badge>{value.number_of_volunteers}</Badge>
              </p>
            </div>
            <div className="fle flex-col">
              <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                Fecha de inicio y Fin
              </h3>
              <p className="leading-7">
                <strong>Inicio:</strong>
                <br /> {format(
                  value.start_date.toDate(),
                  "dd/MM/yyyy hh:mm a"
                )}{" "}
                <br />
                <strong>Finalización:</strong>
                <br /> {format(value.end_date.toDate(), "dd/MM/yyyy hh:mm a")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
