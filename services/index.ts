// Importamos todas las instancias para poder exportarlas como objeto
import * as axiosInstances from './axiosConfig';

// Servicios específicos
export * from './authService';
export * from './cartService';

// Re-export todas las instancias de axios para facilitar su uso
export {
  adminInstance, authInstance, cartInstance, categoryInstance, colorInstance, favoriteInstance, genderInstance, imageInstance, manufacturerInstance, orderInstance, packInstance, productInstance, reviewInstance, sizeInstance, userInstance, videoInstance, wholesalerInstance
} from './axiosConfig';

// Objeto con todas las instancias para acceso fácil
export const apiInstances = {
  manufacturer: axiosInstances.manufacturerInstance,
  user: axiosInstances.userInstance,
  product: axiosInstances.productInstance,
  video: axiosInstances.videoInstance,
  auth: axiosInstances.authInstance,
  wholesaler: axiosInstances.wholesalerInstance,
  category: axiosInstances.categoryInstance,
  size: axiosInstances.sizeInstance,
  image: axiosInstances.imageInstance,
  color: axiosInstances.colorInstance,
  pack: axiosInstances.packInstance,
  gender: axiosInstances.genderInstance,
  order: axiosInstances.orderInstance,
  review: axiosInstances.reviewInstance,
  favorite: axiosInstances.favoriteInstance,
  admin: axiosInstances.adminInstance,
  cart: axiosInstances.cartInstance,
};
