/* eslint-disable quotes */ //кто вообще додумался эти одинарные кавычки поставить
import { ICommand } from '../../shared/types/command.js';
import { TSVFileReader } from '../../shared/libs/index.js';
import { createOffer } from '../../shared/libs/file-reader/offer.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo-database-client.js';
import { getMongoURI } from '../../shared/helpers/database.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { IOffer } from '../../shared/types/offer.js';
import { ILogger } from '../../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../../shared/libs/logger/pino.logger.js';
import { IRentalOffer } from '../../shared/types/rentalOffer.js';
import { Housing } from '../../shared/types/offer.js';
import { Amenities } from '../../shared/types/offer.js';

export class ImportCommand implements ICommand {
  private readonly logger: ILogger;
  private offers: IRentalOffer[] = [];
  private databaseClient: DatabaseClient;

  constructor() {
    this.logger = new PinoLogger();
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private convertHousingType(type: string): Housing {
    switch (type) {
      case 'apartment':
        return Housing.Apartment;
      case 'house':
        return Housing.House;
      case 'room':
        return Housing.Room;
      case 'hotel':
        return Housing.Hotel;
      default:
        return Housing.Apartment;
    }
  }

  private convertAmenities(amenities: string[]): Amenities[] {
    return amenities.map((item) => {
      switch (item) {
        case 'Breakfast':
          return Amenities.Breakfast;
        case 'Air conditioning':
          return Amenities.AirConditioning;
        case 'Laptop friendly workspace':
          return Amenities.LaptopFriendlyWorkspace;
        case 'Baby seat':
          return Amenities.BabySeat;
        case 'Washer':
          return Amenities.Washer;
        case 'Towels':
          return Amenities.Towels;
        case 'Fridge':
          return Amenities.Fridge;
        default:
          return Amenities.Breakfast;
      }
    });
  }

  private async saveOffers(offers: IRentalOffer[]) {
    for (const offer of offers) {
      const adaptedOffer: IOffer = {
        title: offer.title,
        description: offer.description,
        date: offer.publicationDate,
        city: offer.city,
        previewImage: offer.previewImage,
        images: offer.housingPhotos,
        isPremium: offer.isPremium,
        rating: offer.rating,
        housing: this.convertHousingType(offer.housingType),
        rooms: offer.numberOfRooms,
        guests: offer.numberOfGuests,
        price: offer.rentalCost,
        amenities: this.convertAmenities(offer.amenities),
        author: offer.author,
        location: offer.coordinates,
      };
      await OfferModel.create(adaptedOffer);
      this.logger.info('New offer created', { title: offer.title });
    }
  }

  private async onImportedLine(line: string): Promise<void> {
    const offers = createOffer(line);
    this.offers.push(...offers);
  }

  private async onCompleteImport(count: number): Promise<void> {
    this.logger.info('Import completed', { count });
    await this.saveOffers(this.offers);
    this.logger.info('Offers saved', { amount: this.offers.length });
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, portArg] = parameters;
    const port = portArg ? Number(portArg) : 27017; // Если порт не указан, используем стандартный 27017

    // Убедимся, что port является числом и не NaN
    const validPort = isNaN(port) ? 27017 : port;

    const uri = getMongoURI(login, password, host, validPort, dbname);

    console.log(`Connecting to MongoDB at ${uri}`); // Отладочный вывод

    try {
      await this.databaseClient.connect(uri);

      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on('line', this.onImportedLine);
      fileReader.on('end', this.onCompleteImport);

      try {
        await fileReader.read();
      } catch (err) {
        this.logger.error("Can't import data from file", err as Error);
      }
    } catch (error) {
      this.logger.error("Can't establish database connection", error as Error);
    }
  }
}
