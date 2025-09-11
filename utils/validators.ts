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

export const createManufacturerValidator = (
  name: string, 
  phone: string, 
  userId: number,
  pointOfSale: string,
  street: string,
  galleryName: string,
  storeNumber: string,
  owner: string,
  minPurchase: number
) => {
  let errors: { [key: string]: string } = {};

  if (!name) {
    errors.name = 'El nombre es requerido';
  } else if (name.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  const phoneRegex = /^\+?\d{1,4}(\s?\d{1,15}){1,}$/;
  if (!phone) {
    errors.phone = 'El teléfono es requerido';
  } else if (!phoneRegex.test(phone) || phone.length < 10 || phone.length > 15) {
    errors.phone = 'El teléfono debe tener entre 10 y 15 caracteres y ser válido';
  }

  if (!userId || userId <= 0) {
    errors.userId = 'El ID de usuario es inválido';
  }

  if (!owner) {
    errors.owner = 'El propietario es requerido';
  } else if (owner.length < 3 || owner.length > 100) {
    errors.owner = 'El propietario debe tener entre 3 y 100 caracteres';
  }

  if (!minPurchase || minPurchase < 1) {
    errors.minPurchase = 'La compra mínima debe ser un número mayor a 0';
  }

  if (!pointOfSale) {
    errors.pointOfSale = 'El campo punto de venta es requerido';
  } else if (pointOfSale !== 'true' && pointOfSale !== 'false') {
    errors.pointOfSale = 'El campo punto de venta debe ser "Sí" o "No"';
  }

  if (pointOfSale === 'true') {
    if (!street) {
      errors.street = 'La dirección es requerida';
    } else if (street.length < 3 || street.length > 100) {
      errors.street = 'La dirección debe tener entre 3 y 100 caracteres';
    }
  }

  if (galleryName && (galleryName.length < 3 || galleryName.length > 100)) {
    errors.galleryName = 'El nombre de la galería debe tener entre 3 y 100 caracteres';
  }

  if (storeNumber && storeNumber.length > 50) {
    errors.storeNumber = 'El número del local debe tener un máximo de 50 caracteres';
  }

  return errors;
};