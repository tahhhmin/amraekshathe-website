'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Project = {
  _id: string;
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
};

// Utility: Calculate distance between two lat/lng points using Haversine formula (in km)
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function MapNearbyProjectsSection() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [nearbyProjects, setNearbyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (_err) => {
          setError('Could not retrieve your location');
          setLoading(false);
          // You can uncomment below if you want console logging:
          // console.error(_err);
        }
      );
    } else {
      setError('Geolocation not supported by your browser');
      setLoading(false);
    }
  }, []);

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects/showprojectonmap');
        const json = await res.json();

        if (!json.success) {
          setError(json.error || 'Failed to load projects');
          setLoading(false);
          return;
        }

        setProjects(json.data);
      } catch {
        setError('Failed to load projects');
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Calculate nearby projects within 10km after projects and user location are ready
  useEffect(() => {
    if (userLocation && projects.length > 0) {
      const filtered = projects.filter((project) => {
        const [lng, lat] = project.location.coordinates;
        const dist = getDistanceFromLatLonInKm(
          userLocation[0],
          userLocation[1],
          lat,
          lng
        );
        return dist <= 10;
      });
      setNearbyProjects(filtered);
      setLoading(false);
    }
  }, [userLocation, projects]);

  if (loading) return <p>Loading map and projects...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!userLocation) return <p>Waiting for location...</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem', height: '500px' }}>
      {/* Map */}
      <div style={{ flex: 2 }}>
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <MapCenter center={userLocation} />
          {/* User location marker */}
          <Marker position={userLocation}>
            <Popup>Your location</Popup>
          </Marker>

          {/* Nearby projects markers */}
          {nearbyProjects.map((project) => {
            const [lng, lat] = project.location.coordinates;
            return (
              <Marker key={project._id} position={[lat, lng]}>
                <Popup>{project.name}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Sidebar with nearby projects */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h2>Projects Within 10 km</h2>
        {nearbyProjects.length === 0 && <p>No projects nearby.</p>}
        <ul>
          {nearbyProjects.map((project) => (
            <li key={project._id} style={{ marginBottom: '1rem' }}>
              <strong>{project.name}</strong>
              <br />
              Coordinates:{" "}
              {project.location.coordinates[1].toFixed(5)},{" "}
              {project.location.coordinates[0].toFixed(5)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
