"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet and its components to prevent SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// We need to dynamically import L as well, and use it inside a useEffect or a dynamic component
// or ensure it's only accessed on the client-side.
// For the invisibleIcon, we can define it conditionally or inside a useEffect.
interface Project {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
}

// Component to handle the invisible icon, ensuring L is available
function InvisibleMarkerIcon() {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    import("leaflet").then((mod) => {
      setL(mod);
    });
  }, []);

  if (!L) return null; // Don't return the icon until L is loaded

  return new L.DivIcon({
    html: "",
    className: "invisible-marker",
    iconSize: [0, 0],
  });
}


export default function ShowProjectsOnMap() {
  const [projects, setProjects] = useState<Project[]>([]);
  const center: [number, number] = [23.8103, 90.4125]; // Dhaka
  const [isClient, setIsClient] = useState(false);
  const [invisibleIcon, setInvisibleIcon] = useState<L.DivIcon | null>(null);


  useEffect(() => {
    setIsClient(true);
    // Dynamically create the invisible icon once client-side
    import("leaflet").then((mod) => {
      const L = mod;
      setInvisibleIcon(new L.DivIcon({
        html: "",
        className: "invisible-marker",
        iconSize: [0, 0],
      }));
    });
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only fetch on client-side

    fetch("/api/projects/showprojectonmap")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Loaded projects:", data.data);
          setProjects(data.data);
        } else {
          console.error("API error:", data.error);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [isClient]); // Depend on isClient to ensure it runs only on client


  if (!isClient || !invisibleIcon) {
    return (
      <div style={{
        height: "80vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc"
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {projects.map(({ _id, name, location }) => {
          const [lng, lat] = location.coordinates; // GeoJSON order
          return (
            <Marker key={_id} position={[lat, lng]} icon={invisibleIcon}>
              <Tooltip
                direction="top"
                offset={[0, -10]}
                permanent
              >
                <span style={{
                  background: "white",
                  padding: "2px 6px",
                  borderRadius: 4,
                  boxShadow: "0 0 2px rgba(0,0,0,0.3)"
                }}>
                  {name}
                </span>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}