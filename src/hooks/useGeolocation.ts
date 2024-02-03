import { LatLngLiteral } from "leaflet";
import { useState } from "react";

interface IGeolocationProps {
  initialPosition?: LatLngLiteral
}

export default function useGeolocation({ initialPosition }: IGeolocationProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLngLiteral>(
    initialPosition || { lat: 0, lng: 0 }
  );
  const [error, setError] = useState<string>("");

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
