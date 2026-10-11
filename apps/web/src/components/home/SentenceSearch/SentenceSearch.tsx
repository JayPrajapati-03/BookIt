import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button/Button.js';
import { getHotelSuggestions, type HotelSuggestion } from '../../../services/api.js';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import styles from './SentenceSearch.module.css';

export const SentenceSearch: React.FC = () => {
  const navigate = useNavigate();

  const [destination, setDestination] = useState('Udaipur');
  const [checkIn, setCheckIn] = useState('2026-10-14');
  const [checkOut, setCheckOut] = useState('2026-10-17');
  const [guests, setGuests] = useState(2);

  const [activePopover, setActivePopover] = useState<'city' | 'dates' | 'guests' | null>(null);
  const [suggestions, setSuggestions] = useState<HotelSuggestion[]>([]);
  const [cityInput, setCityInput] = useState('Udaipur');

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePopover === 'city') {
      getHotelSuggestions(cityInput)
        .then(setSuggestions)
        .catch(() => {});
    }
  }, [cityInput, activePopover]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({
      city: destination,
      checkIn,
      checkOut,
      adults: guests.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.container} ref={popoverRef}>
      <div className={styles.sentence}>
        <span>Stay in</span>

        {/* 1. Destination Popover */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className={styles.pillControl}
            onClick={() => setActivePopover(activePopover === 'city' ? null : 'city')}
            aria-haspopup="dialog"
            aria-expanded={activePopover === 'city'}
          >
            <span>{destination || 'Any City'}</span>
            <ChevronDown size={18} />
          </button>

          {activePopover === 'city' && (
            <div className={styles.popover}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}
              >
                <MapPin size={16} color="var(--color-tide)" />
                <input
                  type="text"
                  placeholder="Type city name..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    border: 'var(--border-hairline)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--color-sand)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => {
                      setDestination(s.value || s.label);
                      setCityInput(s.value || s.label);
                      setActivePopover(null);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <span>from</span>

        {/* 2. Dates Popover */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className={styles.pillControl}
            onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
            aria-haspopup="dialog"
            aria-expanded={activePopover === 'dates'}
          >
            <span>{checkIn}</span>
            <ChevronDown size={18} />
          </button>
        </div>

        <span>to</span>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className={styles.pillControl}
            onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
            aria-haspopup="dialog"
            aria-expanded={activePopover === 'dates'}
          >
            <span>{checkOut}</span>
            <ChevronDown size={18} />
          </button>

          {activePopover === 'dates' && (
            <div className={styles.popover}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Check-In Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    border: 'var(--border-hairline)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Check-Out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    border: 'var(--border-hairline)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                <Button variant="primary" size="sm" onClick={() => setActivePopover(null)}>
                  Apply Dates
                </Button>
              </div>
            </div>
          )}
        </div>

        <span>for</span>

        {/* 3. Guests Popover */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className={styles.pillControl}
            onClick={() => setActivePopover(activePopover === 'guests' ? null : 'guests')}
            aria-haspopup="dialog"
            aria-expanded={activePopover === 'guests'}
          >
            <span>{guests} Guests</span>
            <ChevronDown size={18} />
          </button>

          {activePopover === 'guests' && (
            <div className={styles.popover}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <span>Adults</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    -
                  </Button>
                  <span style={{ fontWeight: 600 }}>{guests}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionRow}>
        <Button variant="primary" size="lg" leftIcon={<Search size={18} />} onClick={handleSearch}>
          Search Available Stays
        </Button>
      </div>
    </div>
  );
};
