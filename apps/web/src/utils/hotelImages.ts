const FALLBACK_HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&q=80',
];

const BLOCKED_IMAGE_HOSTS = new Set(['dynamic-media-cdn.tripadvisor.com']);

type HotelImage = {
  url?: string;
  alt?: string;
};

export function getHotelImageUrl(images: HotelImage[] | undefined, fallbackIndex = 0) {
  const image = images?.find((img) => {
    if (!img.url) return false;

    try {
      return !BLOCKED_IMAGE_HOSTS.has(new URL(img.url).hostname);
    } catch {
      return false;
    }
  });

  return image?.url || FALLBACK_HOTEL_IMAGES[fallbackIndex % FALLBACK_HOTEL_IMAGES.length];
}
