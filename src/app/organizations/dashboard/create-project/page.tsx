"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import type { LeafletMouseEvent } from "leaflet";
import type { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./page.module.css";
import { useMapEvents } from "react-leaflet"; // Import useMapEvents directly

// Dynamically import all Leaflet components to prevent SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// LocationMarker is now a direct client component that uses useMapEvents
function LocationMarker({ setMarkerPosition }: { setMarkerPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
    },
  });

  return null; // This component doesn't render anything, it just provides map events
}

function CustomMarker({ position }: { position: [number, number] }) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    import("leaflet").then((mod) => {
      setL(mod);
    });
  }, []);

  const icon = useMemo((): DivIcon | null => {
    if (!L) return null;
    
    return L.divIcon({
      className: styles.customMarkerIcon,
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin" viewBox="0 0 24 24" width="24" height="24">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `,
    });
  }, [L]);

  if (!L || !icon) return null;

  return (
    <Marker position={position} icon={icon}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

// Main map component that loads everything dynamically
function MapComponent({ 
  markerPosition, 
  setMarkerPosition 
}: { 
  markerPosition: [number, number] | null;
  setMarkerPosition: (pos: [number, number]) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ 
        height: 300, 
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
    <MapContainer
      center={[23.8103, 90.4125]} // Centered on Dhaka, Bangladesh
      zoom={12}
      style={{ height: 300, width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker setMarkerPosition={setMarkerPosition} />
      {markerPosition && <CustomMarker position={markerPosition} />}
    </MapContainer>
  );
}

export default function AddProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!markerPosition) {
      setError("Please select a location by clicking on the map.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const coordinates = [markerPosition[1], markerPosition[0]]; // lng, lat

      const res = await fetch("/api/projects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          coordinates,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add project");

      alert("Project added successfully!");
      setProjectName("");
      setMarkerPosition(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add Project</h1>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          required
          className={styles.input}
          disabled={loading}
        />

        <input
          type="text"
          readOnly
          value={
            markerPosition
              ? `[${markerPosition[0].toFixed(6)}, ${markerPosition[1].toFixed(6)}]`
              : ""
          }
          placeholder="Click on map to select coordinates"
          className={styles.input}
          style={{ marginTop: 10, backgroundColor: "#f0f0f0" }}
        />

        <div style={{ marginTop: 10 }}>
          {isClient ? (
            <MapComponent 
              markerPosition={markerPosition} 
              setMarkerPosition={setMarkerPosition} 
            />
          ) : (
            <div style={{ 
              height: 300, 
              width: "100%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc"
            }}>
              Loading map...
            </div>
          )}
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
          style={{ marginTop: 10 }}
        >
          {loading ? "Saving..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}