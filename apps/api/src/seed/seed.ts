import mongoose from 'mongoose';
import { Hotel } from '../models/Hotel.js';
import { RoomType } from '../models/RoomType.js';
import { Room } from '../models/Room.js';
import { User } from '../models/User.js';
import { AuthService } from '../services/auth.service.js';
import { SEED_PROPERTIES } from './catalogue.data.js';
import { env } from '../config/env.js';

export async function seedCatalogue(mongoUri: string = env.MONGODB_URI) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  console.log('🌱 Starting BookIt Catalogue Seeding...');

  // Clean only seed records per A9
  await Room.deleteMany({ isSeed: true });
  await RoomType.deleteMany({ isSeed: true });
  await Hotel.deleteMany({ isSeed: true });
  await User.deleteMany({ isSeed: true });
  await User.deleteMany({
    email: {
      $in: [
        'demo_guest@bookit.internal',
        'demo_staff@bookit.internal',
        'demo_admin@bookit.internal',
      ],
    },
  });

  // 1. Seed Demo Accounts
  const demoPasswordHash = await AuthService.hashPassword('Password123!');

  await User.create([
    {
      name: 'Aditi Sharma (Guest)',
      email: 'demo_guest@bookit.internal',
      passwordHash: demoPasswordHash,
      role: 'guest',
      status: 'active',
      isSeed: true,
    },
    {
      name: 'Rohan Verma (Staff)',
      email: 'demo_staff@bookit.internal',
      passwordHash: demoPasswordHash,
      role: 'staff',
      status: 'active',
      isSeed: true,
    },
    {
      name: 'Kavita Patel (Admin)',
      email: 'demo_admin@bookit.internal',
      passwordHash: demoPasswordHash,
      role: 'admin',
      status: 'active',
      isSeed: true,
    },
  ]);
  console.log('✅ Demo accounts seeded: demo_guest, demo_staff, demo_admin');

  // 2. Seed Hotels, RoomTypes, and Rooms
  let totalRooms = 0;
  for (const p of SEED_PROPERTIES) {
    const minPrice = Math.min(...p.roomTypes.map((rt) => rt.basePricePaise));

    const hotel = await Hotel.create({
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      city: p.city,
      state: p.state,
      address: p.address,
      location: p.location,
      images: p.images,
      amenities: p.amenities,
      starRating: p.starRating,
      propertyType: p.propertyType,
      ratingAvg: p.ratingAvg,
      ratingCount: p.ratingCount,
      fromPricePaise: minPrice,
      status: 'published',
      isSeed: true,
    });

    for (let rtIdx = 0; rtIdx < p.roomTypes.length; rtIdx++) {
      const rt = p.roomTypes[rtIdx];
      const roomType = await RoomType.create({
        hotel: hotel._id,
        name: rt.name,
        slug: rt.slug,
        description: rt.description,
        maxGuests: rt.maxGuests,
        beds: rt.beds,
        sizeSqm: rt.sizeSqm,
        amenities: rt.amenities,
        images: rt.images,
        basePricePaise: rt.basePricePaise,
        unitCount: rt.roomCount,
        isActive: true,
        isSeed: true,
      });

      // Create individual rooms with unique numbers across the hotel
      const roomDocs = [];
      const floor = rtIdx + 1;
      for (let i = 1; i <= rt.roomCount; i++) {
        const number = `${floor}0${i}`;
        roomDocs.push({
          hotel: hotel._id,
          roomType: roomType._id,
          number,
          floor,
          status: 'active',
          isSeed: true,
        });
      }

      await Room.insertMany(roomDocs);
      totalRooms += roomDocs.length;
    }
  }

  console.log(
    `✅ Seeded ${SEED_PROPERTIES.length} boutique properties and ${totalRooms} individual rooms!`,
  );
}

// Direct execution support
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedCatalogue()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
