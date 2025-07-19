'use client';

import React, { useEffect, useState } from 'react';
import Styles from './MapSection.module.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '@/ui/button/Button';
import { LatLngTuple, LatLngExpression } from 'leaflet';

// Type definition for a project
type Project = {
  id: number;
  title: string;
  organization: string;
  volunteers: number;
  maxVolunteers: number;
  distance: string;
  date: string;
  category: string;
  coordinates: LatLngTuple; // Type enforced here
};

// Sample nearby projects
const nearbyProjects: Project[] = [
  {
    id: 1,
    title: 'Tree Plantation Drive',
    organization: 'GreenWorld NGO',
    volunteers: 12,
    maxVolunteers: 20,
    distance: '1.2 km',
    date: 'July 20, 2025',
    category: 'Environment',
    coordinates: [23.8103, 90.4125],
  },
  {
    id: 2,
    title: 'Food Distribution',
    organization: 'Help Dhaka',
    volunteers: 5,
    maxVolunteers: 10,
    distance: '2.5 km',
    date: 'July 22, 2025',
    category: 'Relief',
    coordinates: [23.8156, 90.4250],
  },
];

// Map centering helper
function MapControls({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

export default function MapSection() {
  const [userLocation, setUserLocation] = useState<LatLngTuple>([23.8103, 90.4125]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Handle geolocation
  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation([
          pos.coords.latitude,
          pos.coords.longitude,
        ] as LatLngTuple),
      () => alert('Could not retrieve location')
    );
  };

  // Filtered project list
  const filteredProjects = nearbyProjects.filter((project) => {
    const matchSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.organization.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' || project.category.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <section className={Styles.mapProjectsSection}>
      <div className={Styles.mapControls}>
        <input
          type="text"
          placeholder="Search by name or org..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={Styles.searchInput}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={Styles.filterDropdown}
        >
          <option value="all">All</option>
          <option value="Environment">Environment</option>
          <option value="Relief">Relief</option>
        </select>
        <button className={Styles.locateBtn} onClick={handleLocate}>
          📍 Locate Me
        </button>
      </div>

      <div className={Styles.generateSection}>
        {/* LEFT COLUMN: Map */}
        <div className={Styles.leftColumn}>
          <h2 className={Styles.sectionTitle}>Projects Near You</h2>
          <div className={Styles.mapCard}>
            <MapContainer
              center={userLocation}
              zoom={13}
              scrollWheelZoom={false}
              className={Styles.leafletMap}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapControls center={userLocation} />
              {filteredProjects.map((project) => (
                <Marker
                  key={project.id}
                  position={project.coordinates}
                >
                  <Popup>
                    <strong>{project.title}</strong>
                    <br />
                    {project.organization}
                    <br />
                    {project.volunteers}/{project.maxVolunteers} volunteers
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className={Styles.mapFooter}>
              <span>Showing {filteredProjects.length} projects nearby</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: List of Projects */}
        <div className={Styles.rightColumn}>
          <h2 className={Styles.sidebarTitle}>Available Projects</h2>
          {filteredProjects.map((project) => (
            <div key={project.id} className={Styles.projectCard}>
              <div className={Styles.projectCardHeader}>
                <h3 className={Styles.projectTitle}>{project.title}</h3>
                <span className={Styles.projectBadge}>{project.category}</span>
              </div>
              <p className={Styles.projectOrg}>{project.organization}</p>
              <div className={Styles.projectDetails}>
                <p>{project.distance}</p>
                <p>{project.date}</p>
                <p>
                  {project.volunteers}/{project.maxVolunteers}
                </p>
              </div>
              <div className={Styles.projectButtons}>
                <Button label="View" />
                <Button label="Join" variant="outlined" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
