import {
  Coordinates,
  IRentalOffer,
  City,
  HousingType,
  Amenity,
} from '../../types/rentalOffer.js';

function parseCoordinates(coordinates: string): Coordinates {
  const latMatch = coordinates.match(/latitude:\s*([-+]?\d*\.\d+|\d+)/);
  const lonMatch = coordinates.match(/longitude:\s*([-+]?\d*\.\d+|\d+)/);

  if (!latMatch || !lonMatch) {
    throw new Error(`Invalid coordinates format: ${coordinates}`);
  }

  const latitude = parseFloat(latMatch[1]);
  const longitude = parseFloat(lonMatch[1]);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error(`Invalid coordinates values: ${coordinates}`);
  }

  return { latitude, longitude };
}

function getParsedHousingPhotos(
  photos: string
): [string, string, string, string, string, string] {
  return photos
    .split(',')
    .map((photo) => photo.trim())
    .slice(0, 6)
    .concat(Array(6))
    .slice(0, 6) as [string, string, string, string, string, string];
}

export function createOffer(offerData: string): IRentalOffer[] {
  if (!offerData) {
    throw new Error('File was not read');
  }

  return offerData
    .split('\n')
    .filter((row) => row.trim().length > 0)
    .map((line) => line.split('\t'))
    .map(
      ([
        title,
        description,
        publicationDate,
        city,
        previewImage,
        housingPhotos,
        isPremium,
        isFavorite,
        rating,
        housingType,
        numberOfRooms,
        numberOfGuests,
        rentalCost,
        amenities,
        author,
        commentCount,
        coordinates,
      ]) => ({
        title,
        description,
        publicationDate: new Date(publicationDate),
        city: Object.values(City).includes(city as City)
          ? (city as City)
          : City.Amsterdam,
        previewImage,
        housingPhotos: getParsedHousingPhotos(housingPhotos),
        isPremium: isPremium.toLowerCase() === 'true',
        isFavorite: isFavorite.toLowerCase() === 'true',
        rating: parseFloat(rating),
        housingType: Object.values(HousingType).includes(
          housingType as HousingType
        )
          ? (housingType as HousingType)
          : HousingType.Apartment,
        numberOfRooms: parseInt(numberOfRooms, 10),
        numberOfGuests: parseInt(numberOfGuests, 10),
        rentalCost: parseInt(rentalCost, 10),
        amenities: amenities
          .split(',')
          .map((amenity) => amenity.trim()) as Amenity[],
        author,
        commentCount: parseInt(commentCount, 10),
        coordinates: parseCoordinates(coordinates),
      })
    );
}
