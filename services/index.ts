// Importamos todas las instancias para poder exportarlas como objeto
import * as axiosInstances from './axiosConfig';

// Re-export todas las instancias de axios para facilitar su uso
export {
  manufacturerInstance,
  userInstance,
  productInstance,
  authInstance,
  wholesalerInstance,
  categoryInstance,
  sizeInstance,
  imageInstance,
  colorInstance,
  packInstance,
  genderInstance,
  orderInstance,
  reviewInstance,
  favoriteInstance,
  adminInstance
} from './axiosConfig';

// Objeto con todas las instancias para acceso fácil
export const apiInstances = {
  manufacturer: axiosInstances.manufacturerInstance,
  user: axiosInstances.userInstance,
  product: axiosInstances.productInstance,
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
};
