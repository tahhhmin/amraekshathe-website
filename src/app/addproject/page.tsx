"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./page.module.css";

// Dynamically import MapContainer to prevent SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), {
  ssr: false,
});

// Custom marker icon using inline SVG
function CustomMarker({ position }: { position: [number, number] }) {
  const icon = L.divIcon({
    className: styles.customMarkerIcon,
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin" viewBox="0 0 24 24" width="24" height="24">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `,
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

// Component to listen for map clicks and update marker position
function LocationMarker({ setMarkerPosition }: { setMarkerPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
    },
  });
  return null;
}

export default function AddProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!markerPosition) {
      setError("Please select a location by clicking on the map.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/projects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          coordinates: markerPosition,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add project");

      alert("Project added!");
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
          style={{ marginTop: "10px", backgroundColor: "#f0f0f0" }}
        />

        <div style={{ marginTop: "10px" }}>
          <MapContainer
            center={[23.8103, 90.4125]}
            zoom={12}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker setMarkerPosition={setMarkerPosition} />
            {markerPosition && <CustomMarker position={markerPosition} />}
          </MapContainer>
        </div>

        <button type="submit" className={styles.button} disabled={loading} style={{ marginTop: "10px" }}>
          {loading ? "Saving..." : "Add Project"}
        </button>
      </form>
    </div>
  );
}
