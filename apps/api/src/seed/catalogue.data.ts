export interface SeedPropertyData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  address: string;
  location: { type: 'Point'; coordinates: [number, number] }; // [lng, lat]
  propertyType: 'haveli' | 'resort' | 'lodge' | 'camp' | 'boutique' | 'homestay';
  amenities: string[];
  starRating: number;
  ratingAvg: number;
  ratingCount: number;
  images: Array<{ url: string; alt: string }>;
  roomTypes: Array<{
    name: string;
    slug: string;
    description: string;
    maxGuests: number;
    beds: string;
    sizeSqm: number;
    amenities: string[];
    basePricePaise: number;
    roomCount: number;
    images: Array<{ url: string; alt: string }>;
  }>;
}

export const SEED_PROPERTIES: SeedPropertyData[] = [
  {
    name: 'Rawla Fateh Heritage Haveli',
    slug: 'rawla-fateh-heritage-haveli-udaipur',
    tagline: '18th-century stone courtyard manor overlooking Lake Pichola',
    description:
      'Perched on the eastern shores of Lake Pichola, Rawla Fateh offers tranquil lakeside courtyards, hand-carved jharokhas, and authentic Mewari hospitality. Restored by master masons using traditional lime mortar.',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: '14 Gangaur Ghat Marg, Old City',
    location: { type: 'Point', coordinates: [73.6835, 24.5764] },
    propertyType: 'haveli',
    amenities: [
      'Lake View',
      'Rooftop Dining',
      'Ayurvedic Spa',
      'Swimming Pool',
      'Heritage Walk',
      'WiFi',
    ],
    starRating: 5,
    ratingAvg: 4.9,
    ratingCount: 128,
    images: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/20191207_Gangaur_Ghat_and_Bagore_Ki_Haveli%2C_Udaipur_1524_7266.jpg',
        alt: 'Gangaur Ghat and Bagore Ki Haveli waterfront near Rawla Fateh',
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/20191207%20Bagore%20Ki%20Haveli%2C%20Udaipur%2C%200646%207054.jpg',
        alt: 'Bagore Ki Haveli carved heritage facade',
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Entrance%20court%20at%20Bagore-ki-Haveli.jpg',
        alt: 'Bagore Ki Haveli entrance courtyard',
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Entrance%20Gate%20of%20the%20Gangaur%20Ghat.jpg',
        alt: 'Gangaur Ghat entrance gate by the lake',
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Interiors%20of%20Bagore%20Ki%20Haveli.jpg',
        alt: 'Bagore Ki Haveli interior courtyard details',
      },
    ],
    roomTypes: [
      {
        name: 'Heritage Courtyard Room',
        slug: 'heritage-courtyard-room',
        description:
          'Quiet room opening directly onto the frangipani courtyard with vintage rosewood furnishings.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 38,
        amenities: ['Courtyard View', 'Rain Shower', 'Organic Toiletries', 'Tea Station'],
        basePricePaise: 850000, // ₹8,500
        roomCount: 6,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Courtyard Room',
          },
        ],
      },
      {
        name: 'Lake View Royal Suite',
        slug: 'lake-view-royal-suite',
        description:
          'Expansive private balcony with uninterrupted panoramas of Lake Pichola and the City Palace.',
        maxGuests: 3,
        beds: '1 Super King Bed',
        sizeSqm: 56,
        amenities: ['Private Balcony', 'Lake View', 'Copper Soaking Tub', 'Butler Service'],
        basePricePaise: 1650000, // ₹16,500
        roomCount: 4,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
            alt: 'Royal Suite',
          },
        ],
      },
    ],
  },
  {
    name: 'The Roseate Kothi',
    slug: 'the-roseate-kothi-jaipur',
    tagline: 'Pink sandstone estate with sprawling citrus orchards',
    description:
      'A serene colonial-era estate tucked away in the quiet diplomatic enclave of Jaipur, featuring arches carved from Karauli sandstone, private garden cabanas, and farm-to-table Rajasthani dining.',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: '8 Civil Lines Avenue',
    location: { type: 'Point', coordinates: [75.7873, 26.9124] },
    propertyType: 'boutique',
    amenities: [
      'Garden Pool',
      'Citrus Orchard',
      'Artisanal Bakery',
      'Complimentary Bicycles',
      'WiFi',
    ],
    starRating: 5,
    ratingAvg: 4.8,
    ratingCount: 94,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1773155920824-54413d1a3876?q=80&w=3000&auto=format&fit=crop',
        alt: 'Jaipur heritage haveli courtyard with sandstone architecture',
      },
      {
        url: 'https://images.unsplash.com/photo-ZIoAHmZCcSs?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0',
        alt: 'Hawa Mahal Palace of Winds in Jaipur',
      },
      {
        url: 'https://plus.unsplash.com/premium_photo-1697730307121-cf9d07ce03c7?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0',
        alt: 'Jal Mahal Water Palace in Man Sagar Lake Jaipur',
      },
      {
        url: 'https://images.unsplash.com/photo-1767725885743-d3c4f8c2d570?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0',
        alt: 'Ornate sandstone haveli with intricate carvings in Jaisalmer',
      },
      {
        url: 'https://images.unsplash.com/photo-RugN1OsUwHM?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0',
        alt: 'Hawa Mahal the pink palace of Jaipur',
      },
    ],
    roomTypes: [
      {
        name: 'Deluxe Orchard Suite',
        slug: 'deluxe-orchard-suite',
        description:
          'Sunny garden-facing suite surrounded by lime and pummelo trees with a private sit-out terrace.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 42,
        amenities: ['Garden View', 'Espresso Machine', 'Marble Bathroom'],
        basePricePaise: 950000, // ₹9,500
        roomCount: 6,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Orchard Suite',
          },
        ],
      },
    ],
  },
  {
    name: 'Fort Tiracol Heritage Hideaway',
    slug: 'fort-tiracol-heritage-hideaway-goa',
    tagline: '17th-century coastal fortress perched above the Arabian Sea',
    description:
      'Perched dramatically on a rocky headland in North Goa where the Tiracol River meets the Arabian Sea. Seven exclusive suites housed inside a historic Portuguese defense fortress.',
    city: 'Goa',
    state: 'Goa',
    address: 'Tiracol Cliff Head, Pernem',
    location: { type: 'Point', coordinates: [73.6872, 15.7289] },
    propertyType: 'resort',
    amenities: [
      'Oceanfront Panorama',
      'Al Fresco Clifftop Dining',
      'Private Beach Access',
      'Sun Deck',
      'WiFi',
    ],
    starRating: 5,
    ratingAvg: 4.9,
    ratingCount: 142,
    images: [
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/x_0%2Cy_473%2Cw_2160%2Ch_1214%2Cr_0%2Cc_crop/q_80%2Cw_900%2Cdpr_1%2Cf_auto%2Cfl_progressive%2Cc_limit/fort-tiracol-goa/%40brendanavanson_8f423001',
        alt: 'Fort Tiracol on a green headland overlooking the river and sea',
      },
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/x_0%2Cy_120%2Cw_1281%2Ch_720%2Cr_0%2Cc_crop/q_80%2Cw_900%2Cdpr_1%2Cf_auto%2Cfl_progressive%2Cc_limit/fort-tiracol-goa/Drone_1_5e37d9fc',
        alt: 'Aerial coastline view of Fort Tiracol Goa',
      },
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/x_0%2Cy_209%2Cw_965%2Ch_542%2Cr_0%2Cc_crop/q_80%2Cw_900%2Cdpr_1%2Cf_auto%2Cfl_progressive%2Cc_limit/fort-tiracol-goa/Dron_2_164675a2',
        alt: 'Aerial view of Fort Tiracol building above the ocean',
      },
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/x_0%2Cy_1156%2Cw_3000%2Ch_1688%2Cr_0%2Cc_crop/q_80%2Cw_900%2Cdpr_1%2Cf_auto%2Cfl_progressive%2Cc_limit/fort-tiracol-goa/1970-01-01_05.30.00_193_d456b023',
        alt: 'Balcony dining setup with bay view at Fort Tiracol',
      },
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/x_0%2Cy_108%2Cw_1152%2Ch_648%2Cr_0%2Cc_crop/q_80%2Cw_900%2Cdpr_1%2Cf_auto%2Cfl_progressive%2Cc_limit/fort-tiracol-goa/d6cef2e3-61bc-4396-b711-9324ae01714a_7eed6311',
        alt: 'Indoor restaurant at Fort Tiracol Goa',
      },
    ],
    roomTypes: [
      {
        name: 'Bastion Oceanview Room',
        slug: 'bastion-oceanview-room',
        description:
          'Deep stone walls, vaulted timber ceilings, and sweeping views of the crashing waves below.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 36,
        amenities: ['Sea View', 'Antique Teak Furniture', 'Sunset Deck Access'],
        basePricePaise: 1120000, // ₹11,200
        roomCount: 5,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Bastion Room',
          },
        ],
      },
    ],
  },
  {
    name: 'Brunton Boatyard - CGH Earth',
    slug: 'malabar-heritage-harbor-house-kochi',
    tagline: 'Restored colonial shipyard hotel on the Fort Kochi waterfront',
    description:
      'A heritage waterfront hotel built on the site of a former British boatyard in historic Fort Kochi, with colonial verandas, harbor-facing rooms, and sunset views over the shipping channel.',
    city: 'Kochi',
    state: 'Kerala',
    address: '1/498 Calvetty Road, Fort Kochi',
    location: { type: 'Point', coordinates: [76.2427, 9.9668] },
    propertyType: 'boutique',
    amenities: [
      'Harbor View',
      'Spice Garden',
      'Traditional Kathakali Performances',
      'Ayurveda Spa',
      'WiFi',
    ],
    starRating: 5,
    ratingAvg: 4.8,
    ratingCount: 88,
    images: [
      {
        url: 'https://imagecontent.net/images/full/36a60cfc-b7f3-4d1a-9e49-e04d90da4be3.jpeg',
        alt: 'Brunton Boatyard heritage hotel facade in Fort Kochi',
      },
      {
        url: 'https://r2imghtlak.ibcdn.com/r2-mmt-htl-image/htl-imgs/200701220831569291-3efa6a64-d4fb-4d24-90f2-cf63645756ce.jpg',
        alt: 'Brunton Boatyard heritage facade and pool at dusk',
      },
      {
        url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b5/2e/de/caption.jpg?h=2200&s=1&w=2200',
        alt: 'Brunton Boatyard Fort Kochi facade with pool and palms',
      },
      {
        url: 'https://static-img.bag2bag.in/property-images/img-949x449/kochi/brunton-boatyard-%E2%80%93-cgh-earth/1681218294564.webp?format=webp&quality=90',
        alt: 'Brunton Boatyard poolside with dolphin sculpture',
      },
      {
        url: 'https://i.pinimg.com/originals/1f/b2/e2/1fb2e2ea9517b06ebbfc9e8fd41ff05e.jpg',
        alt: 'Brunton Boatyard colonial building beside the pool',
      },
    ],
    roomTypes: [
      {
        name: 'Spice Trader Deluxe',
        slug: 'spice-trader-deluxe',
        description:
          'Terracotta tiled floors, four-poster teak bed, and garden views overlooking the spice court.',
        maxGuests: 2,
        beds: '1 Queen Bed',
        sizeSqm: 34,
        amenities: ['Garden View', 'Rain Shower', 'Local Artisan Decor'],
        basePricePaise: 720000, // ₹7,200
        roomCount: 6,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Spice Trader Room',
          },
        ],
      },
    ],
  },
  {
    name: 'White Rann Dunes Camp',
    slug: 'white-rann-dunes-camp-kutch',
    tagline: 'Luxury tented sanctuary at the edge of the salt desert',
    description:
      'Handcrafted Kutchi luxury tents located just moments from the infinite salt expanse. Experience moonlit desert walks, live Sufi recitals, and regional Rogan artisan workshops.',
    city: 'Kutch',
    state: 'Gujarat',
    address: 'Dhordo Salt Edge, Bhuj',
    location: { type: 'Point', coordinates: [69.5165, 23.8344] },
    propertyType: 'camp',
    amenities: [
      'Desert Safari',
      'Stargazing Telescope',
      'Bonfire Dinners',
      'Live Folk Music',
      'WiFi',
    ],
    starRating: 4,
    ratingAvg: 4.7,
    ratingCount: 65,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
        alt: 'Luxury tents on the White Rann salt desert',
      },
    ],
    roomTypes: [
      {
        name: 'Handcrafted Desert Tent',
        slug: 'handcrafted-desert-tent',
        description:
          'Insulated canvas pavilion with block-printed linens, en-suite modern bath, and veranda.',
        maxGuests: 3,
        beds: '1 King Bed + 1 Daybed',
        sizeSqm: 40,
        amenities: ['Desert View', 'Climate Control', 'Traditional Rugs'],
        basePricePaise: 680000, // ₹6,800
        roomCount: 8,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
            alt: 'Tent Interior',
          },
        ],
      },
    ],
  },
  {
    name: 'Lion Ridge Safari Lodge',
    slug: 'lion-ridge-safari-lodge-sasan-gir',
    tagline: 'Eco-stone cottages nestled along the Gir forest reserve',
    description:
      'Ethical wildlife sanctuary lodge bordering the home of the Asiatic Lion. Crafted with local yellow limestone, solar power, and naturalist-led dawn safaris into the deciduous dry forest.',
    city: 'Sasan Gir',
    state: 'Gujarat',
    address: 'Talala Road, Forest Buffer Zone',
    location: { type: 'Point', coordinates: [70.5753, 21.1322] },
    propertyType: 'lodge',
    amenities: [
      'Wildlife Naturalist',
      'Open-Air Swimming Pool',
      'Organic Orchard',
      'Safari Jeeps',
      'WiFi',
    ],
    starRating: 4,
    ratingAvg: 4.8,
    ratingCount: 52,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1756245994882-cf32d49fde5a?q=80&w=3000&auto=format&fit=crop',
        alt: 'Rustic safari lodge cottages overlooking scenic landscape',
      },
      {
        url: 'https://images.unsplash.com/photo-1741850821836-a0228e561406?q=80&w=3000&auto=format&fit=crop',
        alt: 'Safari jeep on wildlife tour in the forest',
      },
      {
        url: 'https://images.unsplash.com/photo-1568605115174-1a3a3820fdf2?q=80&w=3000&auto=format&fit=crop',
        alt: 'Eco stone cottage with veranda in the forest',
      },
      {
        url: 'https://images.unsplash.com/photo-1704307023984-813727deade9?q=80&w=3000&auto=format&fit=crop',
        alt: 'Wooden cottage with deck surrounded by nature',
      },
      {
        url: 'https://images.unsplash.com/photo-1735423366959-c875a84a5a10?q=80&w=3000&auto=format&fit=crop',
        alt: 'Safari vehicle on forest road adventure',
      },
    ],
    roomTypes: [
      {
        name: 'Teakwood Forest Cottage',
        slug: 'teakwood-forest-cottage',
        description: 'Standalone stone cottage with a shaded veranda for birdwatching and reading.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 45,
        amenities: ['Forest View', 'Outdoor Shower', 'Binoculars Provided'],
        basePricePaise: 890000, // ₹8,900
        roomCount: 6,
        images: [
          { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd', alt: 'Cottage' },
        ],
      },
    ],
  },
  {
    name: 'The Himalayan Manali',
    slug: 'cedar-mist-mountain-lodge-manali',
    tagline: 'Gothic castle-style luxury resort above Manali',
    description:
      'A castle-style luxury resort in Manali with cedar forests, mountain views, cottages, suites, and an outdoor pool framed by the Himalayas.',
    city: 'Manali',
    state: 'Himachal Pradesh',
    address: 'Hadimba Road, Siyal, Manali',
    location: { type: 'Point', coordinates: [77.1839, 32.244] },
    propertyType: 'lodge',
    amenities: ['Fireplace in Room', 'Mountain View', 'Trekking Guide', 'Heated Bedding', 'WiFi'],
    starRating: 4,
    ratingAvg: 4.9,
    ratingCount: 110,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        alt: 'The Himalayan Manali castle resort exterior',
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
        alt: 'The Himalayan Manali serviced residence and garden',
      },
      {
        url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99',
        alt: 'The Himalayan Manali outdoor pool and castle building',
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
        alt: 'The Himalayan Manali guest room interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3',
        alt: 'The Himalayan Manali cottage bedroom',
      },
    ],
    roomTypes: [
      {
        name: 'Himalayan Ridge Suite',
        slug: 'himalayan-ridge-suite',
        description:
          'Loft-style wooden suite with floor-to-ceiling glass capturing sunrise over Rohtang Pass.',
        maxGuests: 3,
        beds: '1 King Bed',
        sizeSqm: 48,
        amenities: ['Snow View', 'Stone Fireplace', 'Radiant Heating'],
        basePricePaise: 1050000, // ₹10,500
        roomCount: 5,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Himalayan Suite',
          },
        ],
      },
    ],
  },
  {
    name: 'Ganga Kedar Ghat Retreat',
    slug: 'ganga-kedar-ghat-retreat-varanasi',
    tagline: 'Serene stone sanctuary overlooking the sacred ghats',
    description:
      'Direct riverfront residence with private wooden sunrise boat excursions and quiet meditation courtyards where the sacred bells of evening Ganga Aarti drift gently across the water.',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    address: 'B2/19 Kedar Ghat, Bangali Tola',
    location: { type: 'Point', coordinates: [83.0068, 25.3012] },
    propertyType: 'haveli',
    amenities: [
      'River Ganges View',
      'Sunrise Boat Excursions',
      'Rooftop Yoga',
      'Vegetarian Dining',
      'WiFi',
    ],
    starRating: 5,
    ratingAvg: 4.8,
    ratingCount: 95,
    images: [
      {
        url: 'https://images.pexels.com/photos/32592677/pexels-photo-32592677.jpeg?auto=compress&cs=tinysrgb&w=3000',
        alt: 'Varanasi ghats along the sacred Ganges river',
      },
      {
        url: 'https://images.pexels.com/photos/31729848/pexels-photo-31729848.jpeg?auto=compress&cs=tinysrgb&w=3000',
        alt: 'Historic ghats of Varanasi by the Ganges',
      },
      {
        url: 'https://images.pexels.com/photos/35729427/pexels-photo-35729427.jpeg?auto=compress&cs=tinysrgb&w=3000',
        alt: 'Night view of Varanasi ghats along the Ganges',
      },
      {
        url: 'https://images.pexels.com/photos/31072582/pexels-photo-31072582.jpeg?auto=compress&cs=tinysrgb&w=3000',
        alt: 'Spiritual morning ritual on Varanasi ghat',
      },
      {
        url: 'https://images.pexels.com/photos/28556187/pexels-photo-28556187.jpeg?auto=compress&cs=tinysrgb&w=3000',
        alt: 'Ganga Aarti ceremony on the ghats of Varanasi',
      },
    ],
    roomTypes: [
      {
        name: 'Ganga View Sanctuary Room',
        slug: 'ganga-view-sanctuary-room',
        description:
          'Tranquil room with window bays framing views of the sacred river currents and temples.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 32,
        amenities: ['River View', 'Incense Bar', 'Silk Linens'],
        basePricePaise: 800000, // ₹8,000
        roomCount: 6,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Sanctuary Room',
          },
        ],
      },
    ],
  },
  {
    name: 'Ananda in the Himalayas',
    slug: 'ananda-riverside-yoga-sanctuary-rishikesh',
    tagline: 'Destination wellness retreat in the Himalayan foothills',
    description:
      'A luxury wellness retreat set on a Maharaja palace estate near Rishikesh, known for Ayurveda, yoga, meditation, spa therapies, and Himalayan foothill views.',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    address: 'The Palace Estate, Narendra Nagar',
    location: { type: 'Point', coordinates: [78.2864, 30.1614] },
    propertyType: 'resort',
    amenities: [
      'Yoga Shala',
      'Riverfront Meditation Deck',
      'Ayurvedic Doctor',
      'Organic Farm',
      'WiFi',
    ],
    starRating: 5,
    ratingAvg: 4.9,
    ratingCount: 104,
    images: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Himalayan_view_from_Ananda_spa%2C_Narendra_Nagar.jpg',
        alt: 'Ananda in the Himalayas palace estate exterior',
      },
      {
        url: 'https://t.eucdn.in/hotels/lg/ananda-spa-resort-rishikesh-6074725.webp',
        alt: 'Ananda in the Himalayas outdoor swimming pool',
      },
      {
        url: 'https://t.eucdn.in/hotels/lg/ananda-spa-resort-rishikesh-9445475.webp',
        alt: 'Ananda in the Himalayas guest room',
      },
      {
        url: 'https://t.eucdn.in/hotels/lg/ananda-spa-resort-rishikesh-8878797.webp',
        alt: 'Ananda in the Himalayas spa and retreat setting',
      },
      {
        url: 'https://t.eucdn.in/hotels/lg/ananda-spa-resort-rishikesh-4479668.webp',
        alt: 'Ananda in the Himalayas terrace and hillside view',
      },
    ],
    roomTypes: [
      {
        name: 'Prana Riverfront Pavilion',
        slug: 'prana-riverfront-pavilion',
        description:
          'Eco-chic bamboo and stone cottage with ambient sounds of the flowing Ganges river.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 40,
        amenities: ['River Sound', 'Meditation Mat', 'Pure Essential Oils'],
        basePricePaise: 920000, // ₹9,200
        roomCount: 7,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Prana Pavilion',
          },
        ],
      },
    ],
  },
  {
    name: 'Windamere Tea Estate Heritage',
    slug: 'windamere-tea-estate-heritage-darjeeling',
    tagline: 'Historic planter bungalow looking out at Mount Kanchenjunga',
    description:
      'Surrounded by misty orthodox tea plantations on Observatory Hill. Enjoy afternoon Darjeeling First Flush tea service beside coal fires, surrounded by silver teapots and colonial nostalgia.',
    city: 'Darjeeling',
    state: 'West Bengal',
    address: 'Observatory Hill, The Mall',
    location: { type: 'Point', coordinates: [88.2663, 27.041] },
    propertyType: 'homestay',
    amenities: [
      'Kanchenjunga Mountain View',
      'Tea Tasting Salon',
      'Coal Fireplace',
      'Library',
      'WiFi',
    ],
    starRating: 4,
    ratingAvg: 4.8,
    ratingCount: 79,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=3000&auto=format&fit=crop',
        alt: 'Colonial-style British bungalow with gardens',
      },
      {
        url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=3000&auto=format&fit=crop',
        alt: 'Tea plantation terraces in Darjeeling hills',
      },
      {
        url: 'https://images.unsplash.com/photo-1729731322165-241913981ba1?q=80&w=3000&auto=format&fit=crop',
        alt: 'Historic colonial fireplace and cozy interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=3000&auto=format&fit=crop',
        alt: 'Misty mountain view from Darjeeling',
      },
      {
        url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=3000&auto=format&fit=crop',
        alt: 'Vintage colonial house exterior',
      },
    ],
    roomTypes: [
      {
        name: 'Planter Colonial Cottage',
        slug: 'planter-colonial-cottage',
        description:
          'Antique cedar wood cottage with chintz curtains, clawfoot bathtub, and morning mountain mist.',
        maxGuests: 2,
        beds: '1 Queen Bed',
        sizeSqm: 38,
        amenities: ['Mountain View', 'Clawfoot Tub', 'Fresh Tea Leaves Daily'],
        basePricePaise: 840000, // ₹8,400
        roomCount: 5,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Planter Cottage',
          },
        ],
      },
    ],
  },
  {
    name: 'Sidi Saiyyed Artisan Pol Haveli',
    slug: 'sidi-saiyyed-artisan-pol-haveli-ahmedabad',
    tagline: 'Intricate carved-wood mansion inside the UNESCO Heritage Old City',
    description:
      'Located within the historic pols of Ahmedabad. Marvel at 200-year-old carved teak pillars, central rain-harvesting tankas, and authentic Gujarati vegetarian thalis served on bronze plates.',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: '22 Dhal ni Pol, Khadia',
    location: { type: 'Point', coordinates: [72.585, 23.0225] },
    propertyType: 'haveli',
    amenities: [
      'UNESCO Heritage Guided Walk',
      'Traditional Thali Dining',
      'Rooftop Bird Feeder',
      'WiFi',
    ],
    starRating: 4,
    ratingAvg: 4.7,
    ratingCount: 58,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
        alt: 'Intricate carved-wood UNESCO pol haveli',
      },
    ],
    roomTypes: [
      {
        name: 'Patan Silk Heritage Chamber',
        slug: 'patan-silk-heritage-chamber',
        description:
          'Room adorned with handwoven Patola textiles, carved brackets, and courtyard breezes.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 30,
        amenities: ['Courtyard Breeze', 'Brass Decor', 'Handloom Linens'],
        basePricePaise: 540000, // ₹5,400
        roomCount: 6,
        images: [
          { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', alt: 'Chamber' },
        ],
      },
    ],
  },
  {
    name: 'Abode Bombay',
    slug: 'the-colaba-art-deco-residence-mumbai',
    tagline: 'Boutique heritage stay in Colaba near the Gateway of India',
    description:
      'A restored boutique hotel in Colaba with vintage Bombay character, handcrafted interiors, warm lounge spaces, and easy access to the Gateway of India.',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '18 Lansdowne House, M.B. Marg, Apollo Bunder, Colaba',
    location: { type: 'Point', coordinates: [72.8324, 18.9222] },
    propertyType: 'boutique',
    amenities: [
      'Art Deco Architecture',
      'Harbor View',
      'Cocktail Lounge',
      'Gramophone Music Room',
      'WiFi',
    ],
    starRating: 5,
    ratingAvg: 4.9,
    ratingCount: 160,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        alt: 'Abode Bombay heritage room interior',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        alt: 'Abode Bombay bedroom with heritage decor',
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        alt: 'Abode Bombay styled room detail',
      },
      {
        url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
        alt: 'Abode Bombay guest room',
      },
      {
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
        alt: 'Abode Bombay lounge and seating area',
      },
    ],
    roomTypes: [
      {
        name: 'Heritage Art Deco Studio',
        slug: 'heritage-art-deco-studio',
        description:
          'Restored geometric terrazzo tiles, vintage bar cart, and sea breeze through high bay windows.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 40,
        amenities: ['Harbor Breeze', 'Vinyl Player', 'Terrazzo Bath'],
        basePricePaise: 1350000, // ₹13,500
        roomCount: 8,
        images: [
          { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', alt: 'Studio' },
        ],
      },
    ],
  },
  // ── ADDITIONAL UDAIPUR PROPERTIES (all 6 types) ──────────────────────────

  {
    name: 'The Leela Palace Udaipur',
    slug: 'the-leela-palace-udaipur',
    tagline: 'Lakeside palatial resort on the shores of Lake Pichola',
    description:
      'Set on 3 acres along Lake Pichola with a private boat jetty, the Leela Palace replicates the grandeur of the City Palace with white marble colonnades, 83 lake-facing rooms, and a rooftop infinity pool that mirrors the sky.',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Lake Pichola, Udaipur 313001',
    location: { type: 'Point', coordinates: [73.6775, 24.5714] },
    propertyType: 'resort',
    amenities: ['Lake View', 'Infinity Pool', 'Spa', 'Private Jetty', 'Rooftop Dining', 'WiFi'],
    starRating: 5,
    ratingAvg: 4.9,
    ratingCount: 312,
    images: [
      {
        url: 'https://theleelaassets.com/prod/content/assets/2025-04/Hero%201_1920x950_7.jpg',
        alt: 'The Leela Palace Udaipur on Lake Pichola',
      },
      {
        url: 'https://www.theleela.com/prod/content/assets/styles/tl_full_screen_webp/public/2025-06/The%20Dinning%20Room_420x567.webp?VersionId=Bdvs6Ip298sLnzqea4kQgCUc5HuSxXJu&itok=FzkD3g5P',
        alt: 'The Leela Palace lake-facing dining room',
      },
      {
        url: 'https://cdn0.weddingwire.in/vendor/6022/3_2/1280/jpg/hotels-leela-palace-udaipur-facade-1_15_86022-163820330137189.jpeg',
        alt: 'The Leela Palace rooftop pool terrace',
      },
      {
        url: 'https://www.indianexcursions.co/wp-content/uploads/2016/09/leela-palace-luxury-hotel-udaipur-rajasthan-1024x720.jpeg',
        alt: 'The Leela Palace Sheesh Mahal terrace',
      },
      {
        url: 'https://i.mooool.com/img/2018/06/The-Leela-Palace-Udaipur-25.jpg',
        alt: 'The Leela Palace illuminated poolside',
      },
    ],
    roomTypes: [
      {
        name: 'Lake View Deluxe Room',
        slug: 'lake-view-deluxe-room-leela',
        description:
          'Marble-floored room with a private balcony directly facing Lake Pichola and the Jag Mandir island palace.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 52,
        amenities: ['Lake Balcony', 'Rain Shower', 'Butler Service', 'Minibar'],
        basePricePaise: 2800000, // ₹28,000
        roomCount: 14,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Lake View Room',
          },
        ],
      },
      {
        name: 'Royal Suite',
        slug: 'royal-suite-leela',
        description:
          'Expansive suite with a private plunge pool terrace, hand-painted frescoes, and a dedicated butler.',
        maxGuests: 3,
        beds: '1 Super King Bed',
        sizeSqm: 110,
        amenities: ['Private Plunge Pool', 'Lake View', 'Frescoed Ceiling', 'Butler'],
        basePricePaise: 6500000, // ₹65,000
        roomCount: 4,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
            alt: 'Royal Suite',
          },
        ],
      },
    ],
  },
  {
    name: 'Fateh Garh Heritage Lodge',
    slug: 'fateh-garh-heritage-lodge-udaipur',
    tagline: 'Hilltop heritage fort lodge with panoramic valley views',
    description:
      'Perched on a promontory above Fateh Sagar Lake, Fateh Garh is a living museum of Mewar architecture — carved stone pavilions, terraced gardens, and sweeping vistas across the Aravalli hills.',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Fateh Sagar Lake Road, Udaipur 313001',
    location: { type: 'Point', coordinates: [73.6865, 24.5954] },
    propertyType: 'lodge',
    amenities: [
      'Hilltop View',
      'Heritage Architecture',
      'Swimming Pool',
      'Cultural Performances',
      'WiFi',
    ],
    starRating: 4,
    ratingAvg: 4.7,
    ratingCount: 178,
    images: [
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/w_900%2Ch_600%2Cc_fill%2Cg_auto%2Cq_80%2Cf_auto/fateh-garh/Infinity_Swimming_Pool_Baradari_Restaurant_-_2_hwtx6b',
        alt: 'Fateh Garh Baradari terrace and pool',
      },
      {
        url: 'https://www.goldentriangletoursinindia.com/uploads/fateh-garh-udaipur.webp',
        alt: 'Fateh Garh palace facade at dusk',
      },
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/w_600%2Ch_400%2Cc_fill%2Cg_auto%2Cq_80%2Cf_auto/fateh-collection/1_-_Suraj_Gokhda_rpgdnu',
        alt: 'Fateh Garh private dining with Aravalli views',
      },
      {
        url: 'https://assets.simplotel.com/simplotel/image/upload/x_0%2Cy_188%2Cw_3600%2Ch_2024%2Cr_0%2Cc_crop%2Cq_80%2Cfl_progressive/w_900%2Cf_auto%2Cc_fit/fateh-garh/095_jvifec',
        alt: 'Fateh Garh marble lounge and carved pillars',
      },
      {
        url: 'https://cdn.audleytravel.com/1050/750/79/329987-pool-at-fateh-garh-udaipur.jpg',
        alt: 'Fateh Garh illuminated pool at night',
      },
    ],
    roomTypes: [
      {
        name: 'Aravalli Valley Room',
        slug: 'aravalli-valley-room',
        description:
          'Stone-walled room with carved arched windows framing rolling Aravalli hills and Fateh Sagar Lake.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 40,
        amenities: ['Hill View', 'Ethnic Textiles', 'Stone Shower'],
        basePricePaise: 780000, // ₹7,800
        roomCount: 8,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Valley Room',
          },
        ],
      },
    ],
  },
  {
    name: 'Shikarbadi Wilderness Camp',
    slug: 'shikarbadi-wilderness-camp-udaipur',
    tagline: 'Former royal hunting retreat in forested Aravalli wilderness',
    description:
      'Once the private deer park of the Mewar royal family, Shikarbadi sits in 30 acres of scrub forest near Udaipur. Luxury safari tents, jeep trails at dawn, and open-air campfire dinners under a canopy of stars.',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Goverdhan Vilas, Udaipur–Ahmedabad Highway, Udaipur 313001',
    location: { type: 'Point', coordinates: [73.6979, 24.5284] },
    propertyType: 'camp',
    amenities: [
      'Wildlife Safari',
      'Campfire Dinners',
      'Horse Riding',
      'Bird Watching',
      'Stargazing',
      'WiFi',
    ],
    starRating: 4,
    ratingAvg: 4.6,
    ratingCount: 88,
    images: [
      {
        url: 'https://y.cdrst.com/foto/hotel-sf/125a2b1b/granderesp/foto-hotel-125a2071.jpg',
        alt: 'Shikarbadi Hotel heritage exterior at dusk',
      },
      {
        url: 'https://cdn0.weddingwire.in/vendor/2018/3_2/960/jpg/poolside004_15_82018.jpeg',
        alt: 'Shikarbadi Hotel poolside by the Aravalli hills',
      },
      {
        url: 'https://z.cdrst.com/foto/hotel-sf/7e2e/granderesp/shikarbadi-hotel-heritage-by-hrh-group-of-hotels-restauracion-125a2065.jpg',
        alt: 'Shikarbadi Hotel heritage dining room',
      },
      {
        url: 'https://www.nativeplanet.com/photos/hotels/750x450/_13591191122.jpg',
        alt: 'Shikarbadi Hotel suite with heritage decor',
      },
      {
        url: 'https://z.cdrst.com/foto/hotel-sf/7e2e/granderesp/shikarbadi-hotel-heritage-by-hrh-group-of-hotels-restauracion-125a2059.jpg',
        alt: 'Shikarbadi Hotel lakeside dining terrace',
      },
    ],
    roomTypes: [
      {
        name: 'Royal Mewar Safari Tent',
        slug: 'royal-mewar-safari-tent',
        description:
          'Palatial canvas tent with teak furniture, en-suite bath, and a private sit-out veranda facing the deer meadow.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 45,
        amenities: ['Forest View', 'Outdoor Shower', 'Minibar', 'Climate Control'],
        basePricePaise: 950000, // ₹9,500
        roomCount: 10,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
            alt: 'Safari Tent',
          },
        ],
      },
    ],
  },
  {
    name: 'Udai Kothi Boutique Hotel',
    slug: 'udai-kothi-boutique-hotel-udaipur',
    tagline: 'Intimate haveli-boutique with a rooftop infinity pool over Lake Pichola',
    description:
      'Tucked on Hanuman Ghat beside the lake, Udai Kothi is a 28-room boutique with handcrafted antique furnishings, a celebrated rooftop pool with a direct lake panorama, and an open-air restaurant beloved by locals.',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: 'Hanuman Ghat, Mulla Talai, Udaipur 313001',
    location: { type: 'Point', coordinates: [73.6804, 24.5751] },
    propertyType: 'boutique',
    amenities: ['Rooftop Pool', 'Lake View', 'Antique Décor', 'Rooftop Restaurant', 'WiFi'],
    starRating: 4,
    ratingAvg: 4.8,
    ratingCount: 224,
    images: [
      {
        url: 'https://www.reisroutes.be/userfiles/fotos/hotel-udai-kothi-udaipur_14839_xl.jpg',
        alt: 'Udai Kothi rooftop pool and city view',
      },
      {
        url: 'https://static.wixstatic.com/media/cdadc4_e3b22bb2e875488ea6e7376cbcd3f110~mv2.jpg/v1/fill/w_800%2Ch_531%2Cal_c%2Cq_85/7np4dgqk1p0vh77o18dmcbfi007v.jpg',
        alt: 'Udai Kothi rooftop dining terrace',
      },
      {
        url: 'https://images.squarespace-cdn.com/content/v1/5e1077b0019b062397153b23/1584357806878-SVVHMK8H1T5YRX20UJMR/image-asset.jpeg',
        alt: 'Udai Kothi heritage hotel entrance',
      },
      {
        url: 'https://cdn0.weddingwire.in/vendor/9775/3_2/960/jpg/1711715417597_15_309775-171498390121604.jpeg',
        alt: 'Udai Kothi canopy suite',
      },
      {
        url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/cd/2e/54/udai-kothi-udai-suite.jpg?h=-1&s=1&w=700',
        alt: 'Udai Kothi rooftop pool at sunset',
      },
    ],
    roomTypes: [
      {
        name: 'Lake Heritage Room',
        slug: 'lake-heritage-room-udai-kothi',
        description:
          'Intimate room with carved Rajasthani furniture, colourful block-print textiles, and lake-facing bay windows.',
        maxGuests: 2,
        beds: '1 Queen Bed',
        sizeSqm: 28,
        amenities: ['Lake View', 'Block-Print Linens', 'Rooftop Pool Access'],
        basePricePaise: 560000, // ₹5,600
        roomCount: 10,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Heritage Room',
          },
        ],
      },
    ],
  },
  {
    name: 'Nukkad Heritage Homestay',
    slug: 'nukkad-heritage-homestay-udaipur',
    tagline: 'Authentic Mewari family home in the old walled city',
    description:
      'A welcoming 150-year-old ancestral residence inside the old city lanes. The Sharma family serves home-cooked Rajasthani meals on their terrace, hosts traditional puppet shows, and shares stories of Mewar history across generations.',
    city: 'Udaipur',
    state: 'Rajasthan',
    address: '7 Gangaur Ghat Lane, Lal Ghat, Old City, Udaipur 313001',
    location: { type: 'Point', coordinates: [73.6821, 24.5768] },
    propertyType: 'homestay',
    amenities: ['Home-Cooked Meals', 'Rooftop Terrace', 'Cultural Immersion', 'Lake Walk', 'WiFi'],
    starRating: 3,
    ratingAvg: 4.7,
    ratingCount: 142,
    images: [
      {
        url: 'https://gos3.ibcdn.com/6af76976-9739-4eb6-afb1-bc9af1201bc7.jpg',
        alt: 'Nukkad Guest House facade in Udaipur old city',
      },
      {
        url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/608866238.jpg?k=3da8274eec6d587d30259744fb77cbbdebf8d0d00748eef9144b9beb30072f2c&o=',
        alt: 'Nukkad Guest House heritage courtyard',
      },
      {
        url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/798813689.jpg?k=5c0a3cde2e19d2838dc8f48cdfcd2c373c64c718aedb4648a801dbb18c1f4aa0&o=',
        alt: 'Nukkad Guest House colorful haveli atrium',
      },
      {
        url: 'https://q-xx.bstatic.com/xdata/images/hotel/max1200/512675793.jpg?k=3391ea5e5f1be9857f947421d4882624b639db82976b2b464df4b5f6ef7d9d22&o=',
        alt: 'Nukkad Guest House rooftop view toward City Palace',
      },
      {
        url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/98/83/ab/heritage-haveli.jpg?h=1200&s=1&w=1200',
        alt: 'Nukkad Guest House rooftop restaurant terrace',
      },
    ],
    roomTypes: [
      {
        name: 'Traditional Mewari Room',
        slug: 'traditional-mewari-room',
        description:
          'Simple, lovingly decorated room with hand-stitched quilts, terracotta floors, and a rooftop terrace view of the old city.',
        maxGuests: 2,
        beds: '1 Double Bed',
        sizeSqm: 20,
        amenities: ['Rooftop Access', 'Home Breakfast Included', 'City View'],
        basePricePaise: 180000, // ₹1,800
        roomCount: 4,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            alt: 'Mewari Room',
          },
        ],
      },
    ],
  },
];
