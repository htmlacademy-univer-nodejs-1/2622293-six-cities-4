import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem } from '../../helpers/common.js';
import { IMockServerData } from '../../types/mock-server-data.types.js';
import { City } from '../../types/rentalOffer.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockdata: IMockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockdata.offers).title;
    const description = getRandomItem(this.mockdata.offers).description;
    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(Object.entries(City));
    const previewImage = getRandomItem(this.mockdata.offers).previewImage;
    const housingPhotos = getRandomItem(this.mockdata.offers).housingPhotos;
    const isPremium = getRandomItem(this.mockdata.offers).isPremium;
    const isFavorite = getRandomItem(this.mockdata.offers).isFavorite;
    const rating = getRandomItem(this.mockdata.offers).rating;
    const housingType = getRandomItem(this.mockdata.offers).housingType;
    const numberOfRooms = getRandomItem(this.mockdata.offers).numberOfRooms;
    const numberOfGuests = getRandomItem(this.mockdata.offers).numberOfGuests;
    const rentalCost = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomItem(this.mockdata.offers).amenities;
    const author = getRandomItem(this.mockdata.offers).author;
    const commentCount = getRandomItem(this.mockdata.offers).commentCount;
    const coordinates = {
      latitude: getRandomItem(this.mockdata.offers).coordinates.latitude,
      longitude: getRandomItem(this.mockdata.offers).coordinates.longitude,
    };
    const username = getRandomItem(this.mockdata.users).name;
    const email = getRandomItem(this.mockdata.users).email;
    const avatar = getRandomItem(this.mockdata.users).avatar;
    const userType = getRandomItem(this.mockdata.users).userType;

    return [
      title,
      description,
      postDate,
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
      `latitude: ${coordinates.latitude}, longitude: ${coordinates.longitude}`,
      username,
      email,
      avatar,
      userType,
    ].join('\t');
  }
}
