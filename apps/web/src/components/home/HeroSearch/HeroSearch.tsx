import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotelSuggestions, type HotelSuggestion } from '../../../services/api.js';
import { MapPin, Calendar, Users, Search, ChevronDown } from 'lucide-react';
import styles from './HeroSearch.module.css';

const POPULAR_CITIES = ['Udaipur', 'Jaipur', 'Jodhpur', 'Goa', 'Rishikesh', 'Varanasi', 'Shimla', 'Manali'];

const HERO_IMAGES: Record<string, { src: string; alt: string }> = {
  Udaipur: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/City%20Palace%20by%20lake%20Pichola%2C%20Udaipur.jpg',
    alt: 'City Palace beside Lake Pichola in Udaipur',
  },
  Jaipur: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Courtyard%20of%20Samode%20Haveli%2C%20Jaipur.jpg',
    alt: 'Jaipur haveli courtyard',
  },
  Jodhpur: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue%20city%20of%20Jodhpur.jpg',
    alt: 'Blue city of Jodhpur viewed from Mehrangarh Fort',
  },
  Goa: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Palolem%20Beach%2C%20South%20Goa.jpg',
    alt: 'Palolem Beach in South Goa',
  },
  Rishikesh: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganges%20at%20Rishikesh%20from%20Lakshman%20Jhula.jpg',
    alt: 'Ganges at Rishikesh from Lakshman Jhula',
  },
  Varanasi: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG',
    alt: 'Varanasi ghats at sunrise',
  },
  Shimla: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ%20Church%20and%20Hawa%20Ghar%20Mall%20road%2C%20Shimla.jpg',
    alt: 'Christ Church and Mall Road in Shimla',
  },
  Manali: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Himalayan%20mountains%20in%20Manali%2C%20Himachal%20Pradesh.jpg',
    alt: 'Himalayan mountains in Manali',
  },
};

function getHeroImage(destination: string) {
  const selectedCity = POPULAR_CITIES.find((city) =>
    destination.toLowerCase().includes(city.toLowerCase()),
  );

  return HERO_IMAGES[selectedCity || 'Udaipur'];
}

function preloadHeroImages() {
  Object.values(HERO_IMAGES).forEach(({ src }) => {
    const image = new Image();
    image.src = src;
  });
}

export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 3);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const [destination, setDestination] = useState('Udaipur');
  const [checkIn, setCheckIn] = useState(fmt(tomorrow));
  const [checkOut, setCheckOut] = useState(fmt(dayAfter));
  const [guests, setGuests] = useState(2);
  const [activePanel, setActivePanel] = useState<'city' | 'dates' | 'guests' | null>(null);
  const [cityInput, setCityInput] = useState('Udaipur');
  const [suggestions, setSuggestions] = useState<HotelSuggestion[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    preloadHeroImages();
  }, []);

  useEffect(() => {
    if (activePanel === 'city') {
      getHotelSuggestions(cityInput)
        .then(setSuggestions)
        .catch(() => {});
    }
  }, [cityInput, activePanel]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({ city: destination, checkIn, checkOut, adults: guests.toString() });
    navigate(`/search?${params.toString()}`);
  };

  const formatDate = (d: string) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const heroImage = getHeroImage(destination);

  return (
    <section id="stays" className={styles.hero}>
      {/* Background Image with overlay */}
      <div className={styles.bg}>
        <img src={heroImage.src} alt={heroImage.alt} className={styles.bgImg} />
        <div className={styles.bgOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.headline}>
          Stay in India's Most
          <br />
          <span className={styles.headlineAccent}>Extraordinary Havelis</span>
        </h1>
        <p className={styles.subheadline}>
          Handpicked boutique heritage properties — verified directly from the front desk ledger.
        </p>

        {/* Search Card */}
        <div className={styles.searchCard} ref={panelRef}>
          <div className={styles.searchFields}>

            {/* Destination */}
            <div className={styles.field} onClick={() => setActivePanel(activePanel === 'city' ? null : 'city')}>
              <MapPin size={16} className={styles.fieldIcon} />
              <div className={styles.fieldInner}>
                <span className={styles.fieldLabel}>Destination</span>
                <span className={styles.fieldValue}>{destination || 'Where to?'}</span>
              </div>
              <ChevronDown size={14} className={`${styles.chevron} ${activePanel === 'city' ? styles.chevronOpen : ''}`} />
            </div>

            <div className={styles.divider} />

            {/* Check-in */}
            <div className={styles.field} onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}>
              <Calendar size={16} className={styles.fieldIcon} />
              <div className={styles.fieldInner}>
                <span className={styles.fieldLabel}>Check-in</span>
                <span className={styles.fieldValue}>{formatDate(checkIn)}</span>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Check-out */}
            <div className={styles.field} onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}>
              <Calendar size={16} className={styles.fieldIcon} />
              <div className={styles.fieldInner}>
                <span className={styles.fieldLabel}>Check-out</span>
                <span className={styles.fieldValue}>{formatDate(checkOut)}</span>
              </div>
              <span className={styles.nightBadge}>{nights}N</span>
            </div>

            <div className={styles.divider} />

            {/* Guests */}
            <div className={styles.field} onClick={() => setActivePanel(activePanel === 'guests' ? null : 'guests')}>
              <Users size={16} className={styles.fieldIcon} />
              <div className={styles.fieldInner}>
                <span className={styles.fieldLabel}>Guests</span>
                <span className={styles.fieldValue}>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
            </div>

            {/* Search Button */}
            <button className={styles.searchBtn} onClick={handleSearch} id="hero-search-btn">
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>

          {/* Dropdown Panels */}
          {activePanel === 'city' && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownSearch}>
                <MapPin size={14} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Type a city..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className={styles.dropdownInput}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className={styles.popularLabel}>Popular Destinations</div>
              <div className={styles.cityGrid}>
                {(suggestions.length > 0 ? suggestions.map((s) => ({ label: s.label, value: s.value || s.label })) : POPULAR_CITIES.map(c => ({ label: c, value: c }))).map((item, i) => (
                  <button
                    key={i}
                    className={`${styles.cityChip} ${destination === item.value ? styles.cityChipActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDestination(item.value);
                      setCityInput(item.value);
                      setActivePanel(null);
                    }}
                  >
                    <MapPin size={12} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activePanel === 'dates' && (
            <div className={styles.dropdown}>
              <div className={styles.datesGrid}>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel}>Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={fmt(tomorrow)}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={styles.dateInput}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className={styles.dateField}>
                  <label className={styles.dateLabel}>Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={styles.dateInput}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <button
                className={styles.applyBtn}
                onClick={(e) => { e.stopPropagation(); setActivePanel(null); }}
              >
                Apply — {nights} night{nights !== 1 ? 's' : ''}
              </button>
            </div>
          )}

          {activePanel === 'guests' && (
            <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
              <div className={styles.guestRow}>
                <div>
                  <div className={styles.guestTitle}>Adults</div>
                  <div className={styles.guestSub}>Ages 13 or above</div>
                </div>
                <div className={styles.counter}>
                  <button className={styles.counterBtn} onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                  <span className={styles.counterVal}>{guests}</span>
                  <button className={styles.counterBtn} onClick={() => setGuests(Math.min(10, guests + 1))}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Popular city quick-links */}
        <div className={styles.quickLinks}>
          <span className={styles.quickLinksLabel}>Popular:</span>
          {POPULAR_CITIES.slice(0, 6).map((city) => (
            <button
              key={city}
              className={styles.quickLinkChip}
              onClick={() => {
                setDestination(city);
                setCityInput(city);
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
