"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function NishaanMap({
  latitude,
  longitude,
  locationName,
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([latitude, longitude], 12);

    mapRef.current = map;

    // OpenStreetMap tiles
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }
    ).addTo(map);


    // Custom Nishaan marker
    const markerIcon = L.divIcon({
      className: "nishaan-marker",
      html: `
        <div style="
          position: relative;
          width: 52px;
          height: 52px;
        ">

          <div style="
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: rgba(95,175,95,0.20);
            animation: nishaanPulse 2s infinite;
          "></div>

          <div style="
            position: absolute;
            left: 7px;
            top: 7px;
            width: 38px;
            height: 38px;
            border-radius: 9999px;
            background: #0D3B0D;
            border: 3px solid #5FAF5F;
            box-shadow: 0 0 25px rgba(95,175,95,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
          ">

            <div style="
              width: 11px;
              height: 11px;
              border-radius: 9999px;
              background: #5FAF5F;
            "></div>

          </div>

        </div>
      `,
      iconSize: [52, 52],
      iconAnchor: [26, 26],
    });


    // Add marker
    const marker = L.marker(
      [latitude, longitude],
      {
        icon: markerIcon,
      }
    ).addTo(map);


    // Popup
    marker
      .bindPopup(
        `
        <div style="
          font-family: Arial, sans-serif;
          padding: 5px;
          min-width: 170px;
        ">

          <div style="
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #5FAF5F;
            margin-bottom: 5px;
          ">
            NISHAAN MATCH
          </div>

          <div style="
            font-size: 16px;
            font-weight: 700;
            color: #0D3B0D;
          ">
            ${locationName}
          </div>

          <div style="
            margin-top: 5px;
            font-size: 11px;
            color: #777;
          ">
            Strongest geographic match
          </div>

        </div>
        `
      )
      .openPopup();


    // Small attribution styling
    setTimeout(() => {
      map.invalidateSize();
    }, 200);


    return () => {
      map.remove();
      mapRef.current = null;
    };

  }, [latitude, longitude, locationName]);


  return (
    <>
      <style jsx global>{`
        .nishaan-marker {
          background: transparent !important;
          border: none !important;
        }

        @keyframes nishaanPulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }

          70% {
            transform: scale(1.5);
            opacity: 0;
          }

          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 8px 25px rgba(13, 59, 13, 0.15) !important;
        }

        .leaflet-control-zoom a {
          color: #0D3B0D !important;
          background: white !important;
          border: none !important;
        }

        .leaflet-control-zoom a:hover {
          background: #C8E6C9 !important;
          color: #0D3B0D !important;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
        }

        .leaflet-popup-tip {
          background: white !important;
        }
      `}</style>

      <div
        ref={containerRef}
        className="h-full w-full"
      />
    </>
  );
}