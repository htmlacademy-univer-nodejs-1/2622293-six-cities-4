export const CreateUserValidationMessage = {
  name: {
    empty: 'Имя пользователя обязательно',
    minLength: 'Минимальная длина имени - 1 символ',
    maxLength: 'Максимальная длина имени - 15 символов',
  },
  email: {
    empty: 'Email обязателен',
    invalid: 'Некорректный формат email',
  },
  password: {
    empty: 'Пароль обязателен',
    minLength: 'Минимальная длина пароля - 6 символов',
    maxLength: 'Максимальная длина пароля - 12 символов',
  },
  avatar: {
    invalid: 'Аватар должен быть валидным URL-адресом',
    format: 'Аватар должен быть в формате .jpg или .png',
  },
  userType: {
    invalid: 'Некорректный тип пользователя',
  },
};
