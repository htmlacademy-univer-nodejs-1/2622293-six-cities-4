import { readFileSync } from 'node:fs';
import { IFileReader } from './file-reader.interface.js';
import {
  Amenity,
  City,
  Coordinates,
  HousingType,
  IRentalOffer,
} from '../types/rentalOffer.js';

function getParsedHousingPhotos(photos: string) {
  const parsedPhotosArray = photos.split(',').map((photo) => photo.trim());
  const parsedHousingPhotos: [string, string, string, string, string, string] =
    [
      parsedPhotosArray[0] || '',
      parsedPhotosArray[1] || '',
      parsedPhotosArray[2] || '',
      parsedPhotosArray[3] || '',
      parsedPhotosArray[4] || '',
      parsedPhotosArray[5] || '',
    ];

  return parsedHousingPhotos;
}

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

export class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): IRentalOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
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
}
