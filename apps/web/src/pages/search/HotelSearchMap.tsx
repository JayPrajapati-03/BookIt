import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './HotelSearchMap.module.css';

export interface MapHotelItem {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  propertyType: string;
  ratingAvg: number;
  fromPricePaise: number;
  location: { coordinates: [number, number] }; // [lng, lat]
  images: Array<{ url: string; alt?: string }>;
}

interface HotelSearchMapProps {
  hotels: MapHotelItem[];
}

const formatPrice = (paise: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
};

export const HotelSearchMap: React.FC<HotelSearchMapProps> = ({ hotels }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [24.5854, 73.7125], // Default Udaipur center
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markers: L.Marker[] = [];

    hotels.forEach((hotel) => {
      const coords = hotel.location?.coordinates;
      if (!coords || coords.length < 2) return;

      const [lng, lat] = coords;
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      // Custom interactive price pill icon
      const priceText = formatPrice(hotel.fromPricePaise);
      const icon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div class="${styles.priceMarker}">${priceText}</div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Detailed popup with real photo, ratings, details and link
      const photoUrl =
        hotel.images && hotel.images[0]?.url
          ? hotel.images[0].url
          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

      const popupHtml = `
        <div class="${styles.popupContent}">
          <div class="${styles.popupImageWrap}">
            <img src="${photoUrl}" alt="${hotel.name}" class="${styles.popupImage}" />
            <span class="${styles.typeBadge}">${hotel.propertyType}</span>
          </div>
          <div class="${styles.popupBody}">
            <div class="${styles.popupTitleRow}">
              <div class="${styles.popupTitle}">${hotel.name}</div>
              <div class="${styles.popupRating}">★ ${hotel.ratingAvg.toFixed(1)}</div>
            </div>
            <div class="${styles.popupLocation}">📍 ${hotel.city}, ${hotel.state}</div>
            <div class="${styles.popupFooter}">
              <div class="${styles.popupPrice}">${priceText} <span class="${styles.perNight}">/ night</span></div>
              <a href="/hotels/${hotel.slug}" class="${styles.viewButton}">View Stay →</a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 260,
        className: styles.customLeafletPopup,
      });

      markers.push(marker);
    });

    // Auto-fit to show all markers nicely
    if (markers.length > 1) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.18));
    } else if (markers.length === 1) {
      const singleCoords = hotels[0].location.coordinates;
      map.setView([singleCoords[1], singleCoords[0]], 14);
    }

    // Invalidate size to ensure proper tile layout rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [hotels]);

  return <div ref={mapContainerRef} className={styles.mapCanvas} />;
};
