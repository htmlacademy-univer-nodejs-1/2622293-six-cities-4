// Перечисление городов
export enum City {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

// Интерфейс для координат
export interface Coordinates {
  latitude: number; // Широта
  longitude: number; // Долгота
}

// Перечисление типов жилья
export enum HousingType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel',
}

// Перечисление удобств
export enum Amenity {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

// Интерфейс для предложения по аренде
export interface IRentalOffer {
  title: string; // Наименование, обязательное поле, длина 10-100 символов
  description: string; // Описание предложения, обязательное поле, длина 20-1024 символов
  publicationDate: Date; // Дата публикации предложения, обязательное поле
  city: City; // Город, обязательное поле, один из шести городов
  previewImage: string; // Превью изображение, обязательное поле, ссылка на изображение
  housingPhotos: [string, string, string, string, string, string]; // Фотографии жилья, обязательное поле, массив из 6 ссылок на изображения
  isPremium: boolean; // Флаг премиальности предложения, обязательное поле
  isFavorite: boolean; // Флаг избранного предложения, обязательное поле
  rating: number; // Рейтинг, обязательное поле, число от 1 до 5 с одним знаком после запятой
  housingType: HousingType; // Тип жилья, обязательное поле, возможные значения: 'apartment', 'house', 'room', 'hotel'
  numberOfRooms: number; // Количество комнат, обязательное поле, число от 1 до 8
  numberOfGuests: number; // Количество гостей, обязательное поле, число от 1 до 10
  rentalCost: number; // Стоимость аренды, обязательное поле, число от 100 до 100 000
  amenities: Amenity[]; // Удобства, обязательное поле, массив из одного или нескольких значений из списка
  author: string; // Автор предложения, обязательное поле, ссылка на сущность пользователя
  commentCount: number; // Количество комментариев, рассчитывается автоматически
  coordinates: Coordinates; // Координаты предложения, обязательное поле, объект с широтой и долготой
}
