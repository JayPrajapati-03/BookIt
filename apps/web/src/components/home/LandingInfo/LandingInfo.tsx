import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './LandingInfo.module.css';

const DESTINATIONS = [
  {
    city: 'Udaipur',
    note: 'Lake palaces, havelis, and royal courtyards',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/City%20Palace%20by%20lake%20Pichola%2C%20Udaipur.jpg?width=600',
  },
  {
    city: 'Jaipur',
    note: 'Pink City mansions, forts, and palace stays',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Courtyard%20of%20Samode%20Haveli%2C%20Jaipur.jpg?width=600',
  },
  {
    city: 'Jodhpur',
    note: 'Blue City views below Mehrangarh Fort',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue%20city%20of%20Jodhpur.jpg?width=600',
  },
  {
    city: 'Goa',
    note: 'Coastal boutique stays near quiet beaches',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Palolem%20Beach%2C%20South%20Goa.jpg?width=600',
  },
  {
    city: 'Rishikesh',
    note: 'Riverside retreats in the Himalayan foothills',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Ganges%20at%20Rishikesh%20from%20Lakshman%20Jhula.jpg?width=600',
  },
  {
    city: 'Varanasi',
    note: 'Ghats, heritage homes, and old-city stays',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG?width=600',
  },
];

type LandingInfoProps = {
  variant: 'destinations' | 'about';
};

export const LandingInfo: React.FC<LandingInfoProps> = ({ variant }) => {
  if (variant === 'destinations') {
    return (
      <section id="destinations" className={styles.section}>
        <div className={styles.inner}>
          <div className={`${styles.sectionHeader} ${styles.centerHeader}`}>
            <span className={styles.eyebrow}>Destinations</span>
            <h2 className={styles.title}>Heritage stays across India's most storied places</h2>
            <p className={styles.subtitle}>
              Choose a city and jump straight into curated stays with real availability.
            </p>
          </div>
          <div className={styles.destinationGrid}>
            {DESTINATIONS.map((item) => (
              <Link
                key={item.city}
                to={`/search?city=${encodeURIComponent(item.city)}`}
                className={styles.destinationCard}
              >
                <img
                  src={item.image}
                  alt={`${item.city} destination`}
                  className={styles.destinationImage}
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.destinationOverlay} />
                <span className={styles.destinationContent}>
                  <span className={styles.destinationCity}>{item.city}</span>
                  <span className={styles.destinationNote}>{item.note}</span>
                  <span className={styles.destinationAction}>
                    Explore stays <ArrowRight size={16} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'about') {
    return (
      <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
        <div className={styles.inner}>
          <div className={`${styles.sectionHeader} ${styles.centerHeader}`}>
            <span className={styles.eyebrow}>About BookIt</span>
            <h2 className={styles.title}>A curated booking layer for boutique Indian stays</h2>
            <p className={styles.subtitle}>
              Built for travellers who want authentic stays, clear details, and dependable booking
              confidence.
            </p>
          </div>
          <div className={styles.aboutCards}>
            <div className={styles.aboutCard}>
              <span className={styles.aboutStat}>01</span>
              <h3>Handpicked Properties</h3>
              <p>
                Heritage hotels, havelis, palace resorts, lodges, and boutique retreats selected
                for character and hospitality.
              </p>
            </div>
            <div className={styles.aboutCard}>
              <span className={styles.aboutStat}>02</span>
              <h3>Clear Booking Flow</h3>
              <p>
                Search, compare, hold, and confirm with straightforward dates, guest counts, and
                room-level availability.
              </p>
            </div>
            <div className={styles.aboutCard}>
              <span className={styles.aboutStat}>03</span>
              <h3>Traveller Confidence</h3>
              <p>
                Verified property information and protected checkout holds help avoid stale
                listings and booking surprises.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return null;
};
