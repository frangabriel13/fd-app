export const registerUserValidator = (email: string, password: string, confirmPassword: string) => {
  let errors: { [key: string]: string } = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'El email es requerido';
  } else if (!emailRegex.test(email)) {
    errors.email = 'El email es inválido';
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+[\]{};':"\\|,.<>\/?`~\-]{8,}$/;
  if (!password) {
    errors.password = 'La contraseña es requerida';
  } else if (!passwordRegex.test(password)) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
};

export const createWholesalerValidator = (name: string, phone: string, userId: number) => {
  let errors: { [key: string]: string } = {};

  if (!name) {
    errors.name = 'El nombre es requerido';
  } else if (name.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  const phoneRegex = /^\+?\d{1,4}(\s?\d{1,15}){1,}$/;
  if (!phone) {
    errors.phone = 'El teléfono es requerido';
  } else if (!phoneRegex.test(phone)) {
    errors.phone = 'El teléfono es inválido';
  }

  if (!userId || userId <= 0) {
    errors.userId = 'El ID de usuario es inválido';
  }

  return errors;
};

export const createManufacturerValidator = (name: string, phone: string, userId: number) => {
  let errors: { [key: string]: string } = {};

  if (!name) {
    errors.name = 'El nombre es requerido';
  } else if (name.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  const phoneRegex = /^\+?\d{1,4}(\s?\d{1,15}){1,}$/;
  if (!phone) {
    errors.phone = 'El teléfono es requerido';
  } else if (!phoneRegex.test(phone)) {
    errors.phone = 'El teléfono es inválido';
  }

  if (!userId || userId <= 0) {
    errors.userId = 'El ID de usuario es inválido';
  }

  return errors;
};