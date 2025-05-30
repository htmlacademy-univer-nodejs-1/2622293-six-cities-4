export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Минимальная длина заголовка - 10 символов',
    maxLength: 'Максимальная длина заголовка - 100 символов',
  },
  description: {
    minLength: 'Минимальная длина описания - 20 символов',
    maxLength: 'Максимальная длина описания - 1024 символа',
  },
  date: {
    invalidFormat: 'Некорректный формат даты',
  },
  city: {
    invalidValue: 'Некорректное значение города',
  },
  previewImage: {
    invalidFormat: 'Некорректный формат URL изображения',
  },
  images: {
    invalidCount: 'Необходимо предоставить от 6 до 10 изображений',
    invalidFormat: 'Некорректный формат URL изображения',
  },
  isPremium: {
    invalidFormat: 'Поле должно быть логическим значением',
  },
  rating: {
    min: 'Минимальное значение рейтинга - 1',
    max: 'Максимальное значение рейтинга - 5',
  },
  housing: {
    invalidValue: 'Некорректное значение типа жилья',
  },
  rooms: {
    min: 'Минимальное количество комнат - 1',
    max: 'Максимальное количество комнат - 8',
  },
  guests: {
    min: 'Минимальное количество гостей - 1',
    max: 'Максимальное количество гостей - 10',
  },
  price: {
    min: 'Минимальная цена - 100',
    max: 'Максимальная цена - 100000',
  },
  amenities: {
    invalidValue: 'Некорректное значение удобства',
    empty: 'Должно быть указано хотя бы одно удобство',
  },
  author: {
    empty: 'Идентификатор автора обязателен',
    invalidId: 'Идентификатор автора должен быть валидным MongoDB ID',
  },
  location: {
    invalidFormat: 'Некорректный формат координат',
    latitude: 'Широта должна быть числом',
    longitude: 'Долгота должна быть числом',
  },
};
