import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { LatLngLiteral } from "leaflet";
import { useCities } from "@/contexts/CitiesContext";
import useGeolocation from "@/hooks/useGeolocation";
import Button from "./Button";
import useUrlPosition from "@/hooks/useUrlPosition";
export default function Map() {
  const cities = useCities().cities;
  const { lat, lng } = useUrlPosition();
  const [mapPosition, setMapPosition] = useState<LatLngLiteral>({
    lat: 51.505,
    lng: -0.09,
  });
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation({});

  useEffect(() => {
    if (lat && lng) setMapPosition({ lat: +lat, lng: +lng });
  }, [lat, lng]);

  useEffect(() => {
    if (geolocationPosition) setMapPosition(geolocationPosition);
  }, [geolocationPosition]);
  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Your position"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              key={city.id}
              position={{ lat: city.position.lat, lng: city.position.lng }}
            >
              <Popup>
                {city.cityName}, {city.country}
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }: { position: LatLngLiteral }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}
