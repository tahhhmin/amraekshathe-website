'use client';

import React, { useEffect, useState } from 'react';
import Styles from './MapSection.module.css';
import Button from '@/ui/button/Button';

export default function MapSection() {
  const [LeafletMap, setLeafletMap] = useState<React.ReactNode>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user location
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          setLocation([23.8103, 90.4125]); // fallback: Dhaka
        }
      );
    } else {
      setLocation([23.8103, 90.4125]); // fallback if geolocation not available
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    Promise.all([
      import('leaflet'),
      import('react-leaflet')
    ]).then(([L, RL]) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });

      const { MapContainer, TileLayer, Marker, Popup, useMap } = RL;

      const RecenterMap = ({ position }: { position: [number, number] }) => {
        const map = useMap();
        useEffect(() => {
          map.setView(position, 13); // Zoom in closer
        }, [position]);
        return null;
      };

      setLeafletMap(
            <MapContainer
            center={location}
            zoom={13}
            scrollWheelZoom={true}
            className={Styles.map}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap position={location} />
            <Marker position={location}>
                <Popup>
                <b>Your Location</b>
                </Popup>
            </Marker>
            </MapContainer>
      );
    });
  }, [location]);

  return (
    <section className={Styles.section}>
      <div className={Styles.container}>
        <h1 className={Styles.heading}>Explore Projects Near You</h1>
        <div className={Styles.mapWrapper}>
            <div className={Styles.mapContainer}>
                {LeafletMap || <p>Loading map...</p>}
            </div>
            <div className={Styles.mapInfo}>
                <div className={Styles.mapInfoDescription}>
                    <h1 className={Styles.mapInfoTitle}>Find Projects in Your Area</h1>
                    <h3 className={Styles.mapInfoSubtitle}>Join Thousands of volunteers making a difference</h3>
                </div>
                <div className={Styles.mapButton}><Button
                    variant='outlined'
                    label='View All Projects'
                    showIcon
                /></div>
            </div>
        </div>
      </div>
    </section>
  );
}
