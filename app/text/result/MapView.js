"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Circle,
  Polyline,
} from "react-leaflet";

import L from "leaflet";


// Fix Leaflet marker icons
const destinationIcon = L.divIcon({
  className: "nishaan-destination-marker",
  html: `
    <div style="
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #0D3B0D;
      border: 4px solid #fbfcf7;
      box-shadow: 0 0 0 6px rgba(95,175,95,0.35),
                  0 0 20px rgba(95,175,95,0.8);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});


const userIcon = L.divIcon({
  className: "nishaan-user-marker",
  html: `
    <div style="
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #5FAF5F;
      border: 4px solid #fbfcf7;
      box-shadow: 0 0 15px rgba(95,175,95,0.9);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});


function FitMap({ destination, userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      const bounds = L.latLngBounds(
        [userLocation.latitude, userLocation.longitude],
        [destination.latitude, destination.longitude]
      );

      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
      });
    } else {
      map.setView(
        [destination.latitude, destination.longitude],
        14
      );
    }
  }, [map, destination, userLocation]);

  return null;
}


export default function MapView({
  destination,
  userLocation,
  locationInfo,
}) {
  const destinationPosition = [
    destination.latitude,
    destination.longitude,
  ];

  const userPosition = userLocation
    ? [
        userLocation.latitude,
        userLocation.longitude,
      ]
    : null;


  return (
    <MapContainer
      center={destinationPosition}
      zoom={14}
      scrollWheelZoom={true}
      className="h-full min-h-[550px] w-full"
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/* Destination */}

      <Marker
        position={destinationPosition}
        icon={destinationIcon}
      >

        <Popup>

          <div style={{ minWidth: "180px" }}>

            <strong>
              Nishaan Destination
            </strong>

            {locationInfo && (
              <>
                <br />
                {locationInfo.area}{locationInfo.area && locationInfo.city ? ", " : ""}{locationInfo.city}
                {locationInfo.street && (
                  <>
                    <br />
                    {locationInfo.street}
                  </>
                )}
              </>
            )}

          </div>

        </Popup>

      </Marker>


      {/* User location */}

      {userPosition && (
        <Marker
          position={userPosition}
          icon={userIcon}
        >

          <Popup>
            Your current location
          </Popup>

        </Marker>
      )}


      {/* Accuracy / destination circles */}

      <Circle
        center={destinationPosition}
        radius={100}
        pathOptions={{
          color: "#2F6B2F",
          fillColor: "#5FAF5F",
          fillOpacity: 0.08,
          weight: 2,
        }}
      />


      {/* Temporary route illustration */}

      {userPosition && (
        <Polyline
          positions={[
            userPosition,
            destinationPosition,
          ]}
          pathOptions={{
            color: "#2F6B2F",
            weight: 4,
            dashArray: "10 10",
          }}
        />
      )}


      <FitMap
        destination={destination}
        userLocation={userLocation}
      />

    </MapContainer>
  );
}