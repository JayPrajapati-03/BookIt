import { Hotel, type IHotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { AppError } from '../utils/errors.js';
import type { HotelSearchQuery } from '@bookit/shared';

export class HotelService {
  static async search(query: HotelSearchQuery) {
    const filter: Record<string, unknown> = {
      status: 'published',
    };

    if (query.city) {
      filter.city = { $regex: new RegExp(`^${query.city}$`, 'i') };
    }

    if (query.q) {
      filter.$text = { $search: query.q };
    }

    if (query.propertyType && query.propertyType.length > 0) {
      filter.propertyType = { $in: query.propertyType };
    }

    if (query.amenities && query.amenities.length > 0) {
      filter.amenities = { $all: query.amenities };
    }

    if (query.minRating) {
      filter.ratingAvg = { $gte: query.minRating };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.fromPricePaise = {};
      if (query.minPrice !== undefined) {
        (filter.fromPricePaise as Record<string, number>).$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        (filter.fromPricePaise as Record<string, number>).$lte = query.maxPrice;
      }
    }

    if (query.near) {
      const [lat, lng] = query.near.split(',').map(Number);
      const radiusKm = query.radiusKm || 50;
      // Convert km to radians: 6378.1 km is Earth radius
      filter.location = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusKm / 6378.1],
        },
      };
    }

    // Determine Sort
    let sortStage: Record<string, 1 | -1> = { ratingAvg: -1 };
    switch (query.sort) {
      case 'price_asc':
        sortStage = { fromPricePaise: 1 };
        break;
      case 'price_desc':
        sortStage = { fromPricePaise: -1 };
        break;
      case 'rating':
        sortStage = { ratingAvg: -1 };
        break;
      case 'recommended':
      default:
        sortStage = query.q
          ? ({ score: { $meta: 'textScore' } } as any)
          : { ratingAvg: -1, fromPricePaise: 1 };
        break;
    }

    const limit = query.limit || 20;

    // Use $facet aggregation to fetch hotels and facet counts in one atomic query
    const pipeline: any[] = [{ $match: filter }];

    if (query.q) {
      pipeline.push({
        $addFields: { score: { $meta: 'textScore' } },
      });
    }

    pipeline.push({
      $facet: {
        hotels: [{ $sort: sortStage }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
        propertyTypeFacets: [{ $group: { _id: '$propertyType', count: { $sum: 1 } } }],
        amenityFacets: [
          { $unwind: '$amenities' },
          { $group: { _id: '$amenities', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 12 },
        ],
        priceRange: [
          {
            $group: {
              _id: null,
              minPrice: { $min: '$fromPricePaise' },
              maxPrice: { $max: '$fromPricePaise' },
            },
          },
        ],
      },
    });

    const [aggregateResult] = await Hotel.aggregate(pipeline);

    const hotels = aggregateResult.hotels || [];
    const total = aggregateResult.totalCount[0]?.count || 0;
    const propertyTypes = aggregateResult.propertyTypeFacets || [];
    const amenities = aggregateResult.amenityFacets || [];
    const priceRange = aggregateResult.priceRange[0] || { minPrice: 0, maxPrice: 0 };

    return {
      hotels,
      total,
      facets: {
        propertyTypes,
        amenities,
        priceRange,
      },
    };
  }

  static async getBySlug(slug: string) {
    const hotel = await Hotel.findOne({ slug, status: 'published' });
    if (!hotel) {
      throw AppError.notFound(`No property found matching '${slug}'`);
    }

    const roomTypes = await RoomType.find({ hotel: hotel._id, isActive: true }).sort({
      basePricePaise: 1,
    });

    return { hotel, roomTypes };
  }

  static async suggest(q: string) {
    if (!q || q.trim().length === 0) return { suggestions: [] };
    const regex = new RegExp(q.trim(), 'i');

    const [cities, hotels] = await Promise.all([
      Hotel.distinct('city', { city: regex, status: 'published' }),
      Hotel.find({ name: regex, status: 'published' })
        .select('name slug city state fromPricePaise')
        .limit(5),
    ]);

    const suggestions = [
      ...cities.map((city) => ({ type: 'city' as const, label: city, value: city })),
      ...hotels.map((h) => ({
        type: 'hotel' as const,
        label: `${h.name}, ${h.city}`,
        slug: h.slug,
        fromPricePaise: h.fromPricePaise,
      })),
    ];

    return { suggestions };
  }

  static async updateFromPrice(hotelId: string) {
    const lowestRoom = await RoomType.findOne({ hotel: hotelId, isActive: true })
      .sort({ basePricePaise: 1 })
      .select('basePricePaise');

    if (lowestRoom) {
      await Hotel.findByIdAndUpdate(hotelId, { fromPricePaise: lowestRoom.basePricePaise });
    }
  }
}
