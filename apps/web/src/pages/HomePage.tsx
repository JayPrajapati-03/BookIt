import React from 'react';
import { HeroSearch } from '../components/home/HeroSearch/HeroSearch.js';
import { FeaturedStays } from '../components/home/FeaturedStays/FeaturedStays.js';
import { LandingInfo } from '../components/home/LandingInfo/LandingInfo.js';
import { WhyBookIt } from '../components/home/WhyBookIt/WhyBookIt.js';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <HeroSearch />
      <LandingInfo variant="destinations" />
      <FeaturedStays />
      <LandingInfo variant="about" />
      <WhyBookIt />
    </div>
  );
};
