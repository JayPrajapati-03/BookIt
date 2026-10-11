import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, Heart } from 'lucide-react';
import styles from './AppFooter.module.css';

export const AppFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.mainGrid}>
          {/* Brand & Mission Column */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              BookIt<span className={styles.logoDot} />
            </div>
            <p className={styles.tagline}>
              Curated boutique heritage hotels, royal havelis, and luxury retreats across India.
              Handcrafted for discerning travelers seeking authentic hospitality.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={14} color="#38bdf8" />
                <span>prajapatijay2445@gmail.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={14} color="#38bdf8" />
                <span>+919313417042</span>
              </div>
            </div>
          </div>

          {/* Destinations Column */}
          <div>
            <h4 className={styles.colTitle}>Destinations</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link to="/search?city=Udaipur">Udaipur, Rajasthan</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?city=Jaipur">Jaipur & Amer</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?city=Mumbai">Mumbai Heritage</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?city=Goa">Coastal Goa</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?city=Kerala">Kerala Backwaters</Link>
              </li>
            </ul>
          </div>

          {/* Stay Categories Column */}
          <div>
            <h4 className={styles.colTitle}>Collections</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <Link to="/search?propertyType=haveli">Royal Havelis</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?propertyType=resort">Palace Resorts</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?propertyType=lodge">Heritage Lodges</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?propertyType=camp">Wilderness Camps</Link>
              </li>
              <li className={styles.linkItem}>
                <Link to="/search?propertyType=boutique">Boutique Manors</Link>
              </li>
            </ul>
          </div>

          {/* Guest Concierge Column */}
          <div>
            <h4 className={styles.colTitle}>Guest Support</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a href="#support">24/7 Concierge</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#cancellation">Flexible Cancellation</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#safety">Guest Safety Standards</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#faq">Frequently Asked Questions</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#reviews">Verified Guest Reviews</a>
              </li>
            </ul>
          </div>

          {/* Trust & Company Column */}
          <div>
            <h4 className={styles.colTitle}>About & Legal</h4>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a href="#story">Our Story</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#partners">List Your Property</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#terms">Terms of Service</a>
              </li>
              <li className={styles.linkItem}>
                <a href="#trust">Safe Booking Guarantee</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Badges */}
        <div className={styles.bottomRow}>
          <div>
            &copy; {new Date().getFullYear()} BookIt Stays Private Limited. All rights reserved.
          </div>
          <div className={styles.trustBadges}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="#34d399" /> 100% Verified Authentic Properties
            </span>
            <span>&middot;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Heart size={14} color="#f43f5e" /> Curated Hospitality
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
