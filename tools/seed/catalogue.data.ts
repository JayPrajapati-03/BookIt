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
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        alt: 'Courtyard at sunset',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        alt: 'Palace view terrace',
      },
      {
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
        alt: 'Heritage bedroom suite',
      },
      {
        url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
        alt: 'Poolside pavilion',
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
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        alt: 'Estate front facade',
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        alt: 'Garden swimming pool',
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
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        alt: 'Clifftop fortress view',
      },
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        alt: 'Ocean sunset deck',
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
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        alt: 'Harbor view veranda',
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
        url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
        alt: 'Tents on the desert salt',
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
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        alt: 'Lodge surrounded by teak trees',
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
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        alt: 'Cedar lodge in snow',
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
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        alt: 'River view from terrace',
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
      {
        url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
        alt: 'Riverside yoga shala',
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
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        alt: 'Tea hills and peaks',
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
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        alt: 'Carved wooden courtyard',
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
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        alt: 'Art deco suite',
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
];
