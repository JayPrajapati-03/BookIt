import { Router } from 'express';
import {
  searchHotels,
  suggestHotels,
  getHotel,
  getHotelAvailability,
  getHotelCalendar,
} from '../controllers/hotel.controller.js';
import { getHotelReviews } from '../controllers/review.controller.js';

export const hotelRouter: Router = Router();

hotelRouter.get('/', searchHotels);
hotelRouter.get('/suggest', suggestHotels);
hotelRouter.get('/:slug', getHotel);
hotelRouter.get('/:slug/availability', getHotelAvailability);
hotelRouter.get('/:slug/calendar', getHotelCalendar);
hotelRouter.get('/:slug/reviews', getHotelReviews);
