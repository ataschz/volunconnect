import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFormContext } from "react-hook-form";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { forwardRef, useState } from "react";

const center = { lat: -31.4135, lng: -64.18105 };

export const PlacesAutocompleteInput = forwardRef(
  ({ coordinates, defaultValue, onBlur }, ref) => {
    const { setValue } = useFormContext();
    const {
      ready,
      value,
      setValue: setPlacesAutocompleteValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete({
      defaultValue: String(defaultValue),
    });
    const [markerCoordinates, setMarkerCoordinates] = useState(coordinates);

    const handleSelect = async (address) => {
      const result = await getGeocode({ address });

      if (result[0]) {
        setPlacesAutocompleteValue(result[0]?.formatted_address, false);

        const { lat, lng } = getLatLng(result[0]);

        setValue("address", result[0]?.formatted_address);
        setValue("lat", lat);
        setValue("lng", lng);

        setMarkerCoordinates({
          lat,
          lng,
        });

        clearSuggestions();
      }
    };

    return (
      <div className="flex flex-col space-y-2">
        <Command>
          <CommandInput
            ref={ref}
            onBlur={onBlur}
            value={value}
            onValueChange={setPlacesAutocompleteValue}
            disabled={!ready}
            placeholder="Search an address"
          />
          <CommandList>
            {status === "OK" && data.length > 0 && (
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {data.map(({ place_id, description }) => (
                    <CommandItem onSelect={handleSelect} key={place_id}>
                      {description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
        {markerCoordinates && (
          <GoogleMap
            mapContainerClassName="z-10"
            mapContainerStyle={{
              borderRadius: "0.75rem",
              width: "100%",
              height: "300px",
            }}
            center={markerCoordinates ?? center}
            clickableIcons={false}
            zoom={15}
            options={{
              disableDefaultUI: true,
              disableDoubleClickZoom: true,
              gestureHandling: "none",
            }}
          >
            <Marker position={markerCoordinates} />
          </GoogleMap>
        )}
      </div>
    );
  }
);

PlacesAutocompleteInput.displayName = "PlacesAutocompleteInput";
