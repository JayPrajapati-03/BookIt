import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import styles from './LandingInfo.module.css';

const DESTINATIONS = [
  {
    city: 'Udaipur',
    note: 'Lake palaces, havelis, and royal courtyards',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/City%20Palace%20by%20lake%20Pichola%2C%20Udaipur.jpg',
  },
  {
    city: 'Jaipur',
    note: 'Pink City mansions, forts, and palace stays',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Courtyard%20of%20Samode%20Haveli%2C%20Jaipur.jpg',
  },
  {
    city: 'Jodhpur',
    note: 'Blue City views below Mehrangarh Fort',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue%20city%20of%20Jodhpur.jpg',
  },
  {
    city: 'Goa',
    note: 'Coastal boutique stays near quiet beaches',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Palolem%20Beach%2C%20South%20Goa.jpg',
  },
  {
    city: 'Rishikesh',
    note: 'Riverside retreats in the Himalayan foothills',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Ganges%20at%20Rishikesh%20from%20Lakshman%20Jhula.jpg',
  },
  {
    city: 'Varanasi',
    note: 'Ghats, heritage homes, and old-city stays',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG',
  },
];

type LandingInfoProps = {
  variant: 'destinations' | 'about' | 'contact';
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
                <img src={item.image} alt={`${item.city} destination`} className={styles.destinationImage} />
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
        <div className={`${styles.inner} ${styles.aboutGrid}`}>
          <div>
            <span className={styles.eyebrow}>About BookIt</span>
            <h2 className={styles.title}>A curated booking layer for boutique Indian stays</h2>
          </div>
          <p className={styles.copy}>
            BookIt focuses on handpicked heritage hotels, havelis, palace resorts, lodges, and
            boutique retreats. The product is built around verified availability, protected checkout
            holds, and clear property details so travellers can choose confidently.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={`${styles.inner} ${styles.contactGrid}`}>
        <div>
          <span className={styles.eyebrow}>Contact Us</span>
          <h2 className={styles.title}>Need help choosing the right stay?</h2>
          <p className={styles.copy}>
            Reach the BookIt desk for booking questions, property support, or demo access.
          </p>
        </div>
        <div className={styles.contactPanel}>
          <a href="mailto:support@bookit.example" className={styles.contactItem}>
            <Mail size={18} />
            support@bookit.example
          </a>
          <a href="tel:+919999999999" className={styles.contactItem}>
            <Phone size={18} />
            +91 99999 99999
          </a>
          <span className={styles.contactItem}>
            <MapPin size={18} />
            India-wide boutique stays
          </span>
        </div>
      </div>
    </section>
  );
};
