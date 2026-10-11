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
      { url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/City_Palace%2C_Udaipur%2C_20191207_0501_6900.jpg', alt: 'Rawla Fateh Haveli courtyard on Lake Pichola' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/20191207_Gangaur_Ghat_and_Bagore_Ki_Haveli%2C_Udaipur_1524_7266.jpg', alt: 'Gangaur Ghat and haveli waterfront' },
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
      { url: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Courtyard_of_Samode_Haveli%2C_Jaipur.jpg', alt: 'Courtyard of Samode Haveli in Jaipur' },
      { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', alt: 'Garden swimming pool' },
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
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', alt: 'Clifftop fortress over Arabian Sea' },
      { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c', alt: 'Ocean sunset deck' },
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
    name: 'Malabar Heritage Harbor House',
    slug: 'malabar-heritage-harbor-house-kochi',
    tagline: 'Dutch colonial spice warehouse overlooking the shipping channel',
    description:
      'Carefully preserved 300-year-old trade warehouse on the water in historic Fort Kochi. Watch wooden fishing dhows and cargo ships glide past while dining under broad mango trees.',
    city: 'Kochi',
    state: 'Kerala',
    address: '1/284 Parade Ground Road, Fort Kochi',
    location: { type: 'Point', coordinates: [76.2415, 9.9658] },
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
      { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', alt: 'Dutch colonial harbor view' },
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
      { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', alt: 'Luxury tents on the White Rann salt desert' },
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
      { url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Asiatic_Lion_Gir_Forest_India.jpg', alt: 'Asiatic Lion in Gir Forest National Park' },
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
    name: 'Cedar Mist Mountain Lodge',
    slug: 'cedar-mist-mountain-lodge-manali',
    tagline: 'Hand-hewn cedar chalet with Himalayan snow-peak panoramas',
    description:
      'Perched high in Old Manali among ancient deodar forests. Features wood-burning stone fireplaces, handmade wool rugs, and glass-front verandas overlooking the snow-capped Pir Panjal range.',
    city: 'Manali',
    state: 'Himachal Pradesh',
    address: 'Upper Log Huts Road, Old Manali',
    location: { type: 'Point', coordinates: [77.1892, 32.2396] },
    propertyType: 'lodge',
    amenities: ['Fireplace in Room', 'Mountain View', 'Trekking Guide', 'Heated Bedding', 'WiFi'],
    starRating: 4,
    ratingAvg: 4.9,
    ratingCount: 110,
    images: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', alt: 'Cedar lodge with Himalayan snow peaks' },
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
      { url: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae', alt: 'Sacred Ganges river view at dawn' },
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
    name: 'Ananda Riverside Yoga Sanctuary',
    slug: 'ananda-riverside-yoga-sanctuary-rishikesh',
    tagline: 'Holistic wellness and mindfulness escape in the Himalayan foothills',
    description:
      'Surrounded by sal forests on the banks of the turquoise upper Ganges. Features daily hatha yoga, organic Ayurvedic nutrition, sound healing, and river rapids rafting.',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    address: 'Tapovan Badrinath Road',
    location: { type: 'Point', coordinates: [78.3242, 30.1345] },
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
      { url: 'https://images.unsplash.com/photo-1488085061387-422e29b40080', alt: 'Riverside yoga shala in Himalayan foothills' },
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
      { url: 'https://images.unsplash.com/photo-1455587734955-081b22074882', alt: 'Misty Darjeeling tea estate at dawn' },
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
      { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da', alt: 'Intricate carved-wood UNESCO pol haveli' },
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
    name: 'The Colaba Art Deco Residence',
    slug: 'the-colaba-art-deco-residence-mumbai',
    tagline: '1930s seaside Art Deco boutique near the Gateway of India',
    description:
      'Nestled behind the historic Taj Mahal Palace in South Mumbai. Beautiful terrazzo tile flooring, chrome fittings, private book collections, and views toward the Arabian Sea harbor.',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '12 Merryweather Road, Colaba',
    location: { type: 'Point', coordinates: [72.8317, 18.922] },
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
      { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', alt: '1930s Art Deco facade near Gateway of India' },
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
      { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Taj_hotel%2Clake_pichola%2Cudaipur%2Crajasthan.jpg', alt: 'The Leela Palace and Lake Pichola waterfront' },
      { url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Jag_Mandir%2C_Udaipur%2C_20191207_1428_7201.jpg', alt: 'Lake Pichola island view from Leela Palace' },
    ],
    roomTypes: [
      {
        name: 'Lake View Deluxe Room',
        slug: 'lake-view-deluxe-room-leela',
        description: 'Marble-floored room with a private balcony directly facing Lake Pichola and the Jag Mandir island palace.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 52,
        amenities: ['Lake Balcony', 'Rain Shower', 'Butler Service', 'Minibar'],
        basePricePaise: 2800000, // ₹28,000
        roomCount: 14,
        images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', alt: 'Lake View Room' }],
      },
      {
        name: 'Royal Suite',
        slug: 'royal-suite-leela',
        description: 'Expansive suite with a private plunge pool terrace, hand-painted frescoes, and a dedicated butler.',
        maxGuests: 3,
        beds: '1 Super King Bed',
        sizeSqm: 110,
        amenities: ['Private Plunge Pool', 'Lake View', 'Frescoed Ceiling', 'Butler'],
        basePricePaise: 6500000, // ₹65,000
        roomCount: 4,
        images: [{ url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd', alt: 'Royal Suite' }],
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
    amenities: ['Hilltop View', 'Heritage Architecture', 'Swimming Pool', 'Cultural Performances', 'WiFi'],
    starRating: 4,
    ratingAvg: 4.7,
    ratingCount: 178,
    images: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/20191208_Brama_Pa%C5%82acu_Monsunowego_w_Udajpurze_1246_7576.jpg', alt: 'Fateh Garh hilltop fort lodge gate and ramparts' },
    ],
    roomTypes: [
      {
        name: 'Aravalli Valley Room',
        slug: 'aravalli-valley-room',
        description: 'Stone-walled room with carved arched windows framing rolling Aravalli hills and Fateh Sagar Lake.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 40,
        amenities: ['Hill View', 'Ethnic Textiles', 'Stone Shower'],
        basePricePaise: 780000, // ₹7,800
        roomCount: 8,
        images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', alt: 'Valley Room' }],
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
    amenities: ['Wildlife Safari', 'Campfire Dinners', 'Horse Riding', 'Bird Watching', 'Stargazing', 'WiFi'],
    starRating: 4,
    ratingAvg: 4.6,
    ratingCount: 88,
    images: [
      { url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Aravalli_Range%2C_Udaipur.jpg', alt: 'Aravalli Range wilderness surrounding Shikarbadi' },
    ],
    roomTypes: [
      {
        name: 'Royal Mewar Safari Tent',
        slug: 'royal-mewar-safari-tent',
        description: 'Palatial canvas tent with teak furniture, en-suite bath, and a private sit-out veranda facing the deer meadow.',
        maxGuests: 2,
        beds: '1 King Bed',
        sizeSqm: 45,
        amenities: ['Forest View', 'Outdoor Shower', 'Minibar', 'Climate Control'],
        basePricePaise: 950000, // ₹9,500
        roomCount: 10,
        images: [{ url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6', alt: 'Safari Tent' }],
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
      { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Hanuman_Ghat%2C_Udaipur%2C_Rajasthan.jpg', alt: 'Hanuman Ghat and Udai Kothi lakeside' },
    ],
    roomTypes: [
      {
        name: 'Lake Heritage Room',
        slug: 'lake-heritage-room-udai-kothi',
        description: 'Intimate room with carved Rajasthani furniture, colourful block-print textiles, and lake-facing bay windows.',
        maxGuests: 2,
        beds: '1 Queen Bed',
        sizeSqm: 28,
        amenities: ['Lake View', 'Block-Print Linens', 'Rooftop Pool Access'],
        basePricePaise: 560000, // ₹5,600
        roomCount: 10,
        images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', alt: 'Heritage Room' }],
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
      { url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Old_city_in_udaipur_12.jpg', alt: 'Authentic residential lane in Udaipur old city' },
    ],
    roomTypes: [
      {
        name: 'Traditional Mewari Room',
        slug: 'traditional-mewari-room',
        description: 'Simple, lovingly decorated room with hand-stitched quilts, terracotta floors, and a rooftop terrace view of the old city.',
        maxGuests: 2,
        beds: '1 Double Bed',
        sizeSqm: 20,
        amenities: ['Rooftop Access', 'Home Breakfast Included', 'City View'],
        basePricePaise: 180000, // ₹1,800
        roomCount: 4,
        images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427', alt: 'Mewari Room' }],
      },
    ],
  },
];
