"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Tooltip, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Remove default icon (make markers invisible)
const invisibleIcon = new L.DivIcon({
  html: "", // no visible html, invisible marker
  className: "invisible-marker",
  iconSize: [0, 0],
});

interface Project {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
}

export default function ShowProjectsOnMap() {
  const [projects, setProjects] = useState<Project[]>([]);
  const center: [number, number] = [23.8103, 90.4125]; // Dhaka approx center

  useEffect(() => {
    fetch("/api/projects/showprojectonmap")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data);
        } else {
          console.error("Failed to load projects:", data.error);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {projects.map(({ _id, name, location }) => {
          const [lng, lat] = location.coordinates;
          return (
            <Marker key={_id} position={[lat, lng]} icon={invisibleIcon}>
              <Tooltip direction="top" offset={[0, -10]} permanent>
                <span style={{ background: "white", padding: "2px 6px", borderRadius: 4, boxShadow: "0 0 2px rgba(0,0,0,0.3)" }}>
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
