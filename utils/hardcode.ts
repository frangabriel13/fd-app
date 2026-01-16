import image from '@/assets/images/categorias/otros/porDefecto.png';
import bermudasShorts from '@/assets/images/categorias/hombre/bermudas-y-shorts.png';
import buzosHombre from '@/assets/images/categorias/hombre/buzos.png';
import calzadosHombre from '@/assets/images/categorias/hombre/calzados.png';
import camisasHombre from '@/assets/images/categorias/hombre/camisas.png';
import camperasHombre from '@/assets/images/categorias/hombre/camperas.png';
import jeansHombre from '@/assets/images/categorias/hombre/jeans.png';
import remerasHombre from '@/assets/images/categorias/hombre/remeras.png';
import interiorHombre from '@/assets/images/categorias/hombre/ropa-interior.png';
import sweatersHombre from '@/assets/images/categorias/hombre/sweaters.png';
import pantalonesHombre from '@/assets/images/categorias/hombre/pantalones.png';
import sweatersMujer from '@/assets/images/categorias/mujer/sweaters.png';
import camisasMujer from '@/assets/images/categorias/mujer/camisas.png';
import camperasMujer from '@/assets/images/categorias/mujer/camperas.png';
import jeansMujer from '@/assets/images/categorias/mujer/jeans.png';
import lenceriaMujer from '@/assets/images/categorias/mujer/lenceria-y-mallas.png';
import pantalonesCalzasMujer from '@/assets/images/categorias/mujer/pantalones-y-calzas.png';
import shortsPollerasMujer from '@/assets/images/categorias/mujer/shorts-y-polleras.png';
import calzadosMujer from '@/assets/images/categorias/mujer/calzados.png';
import vestidosMujer from '@/assets/images/categorias/mujer/vestidos.png';
import buzosNino from '@/assets/images/categorias/nino/buzos.png';
import camperasNino from '@/assets/images/categorias/nino/camperas.png';
import otrosNino from '@/assets/images/categorias/nino/otros.png';
import interiorNino from '@/assets/images/categorias/nino/ropa-interior.png';
import otrosNina from '@/assets/images/categorias/nina/otros.png';
import vestidosNina from '@/assets/images/categorias/nina/vestidos.png';
import abrigosBebe from '@/assets/images/categorias/bebes/ABRIGOS.png';
import accesoriosBebe from '@/assets/images/categorias/bebes/ACCESORIOS.png';
import bodysBebe from '@/assets/images/categorias/bebes/bodys.png';
import calzadosBebe from '@/assets/images/categorias/bebes/CALZADOS.png';
import camisasBebe from '@/assets/images/categorias/bebes/CAMISAS.png';
import conjuntosBebe from '@/assets/images/categorias/bebes/CONJUNTOS.png';
import eneteritosBebe from '@/assets/images/categorias/bebes/ENTERIZOS.png';
import mediasBebe from '@/assets/images/categorias/bebes/MEDIAS.png';
import otrosBebe from '@/assets/images/categorias/bebes/otros.png';
import pantalonesBebe from '@/assets/images/categorias/bebes/PANTALONES.png';
import remerasBebe from '@/assets/images/categorias/bebes/remeras.png';
import vestidosBebe from '@/assets/images/categorias/bebes/VESTIDOS.png';
import bisuteriaImg from '@/assets/images/categorias/otros/BISUTERIA.png';
import blanqueriaImg from '@/assets/images/categorias/otros/BLANQUERIA.png';

export const parentCategories = [
  { id: 88, name: 'Indumentaria' },
  { id: 130, name: 'Blanquería' },
  { id: 131, name: 'Bisutería' },
  { id: 132, name: 'Artículos de confección' }, // Debo crear la categoría
];

export const genders = [
  { 
    id: 2, 
    name: 'Hombre', 
    url: 'hombre',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'jeans', img: jeansHombre },
      { id: 136, name: 'Pantalones', image, url: 'pantalones', img: pantalonesHombre },
      { id: 139, name: 'Bermudas y shorts', image, url: 'bermudas-y-shorts', img: bermudasShorts },
      { id: 141, name: 'Camperas', image, url: 'camperas', img: camperasHombre },
      { id: 142, name: 'Remeras', image, url: 'remeras', img: remerasHombre },
      { id: 143, name: 'Camisas', image, url: 'camisas', img: camisasHombre },
      { id: 144, name: 'Chombas', image, url: 'chombas', img: remerasBebe },
      { id: 146, name: 'Buzos', image, url: 'buzos', img: buzosHombre },
      { id: 147, name: 'Sweaters', image, url: 'sweaters', img: sweatersHombre },
      { id: 151, name: 'Ropa interior', image, url: 'ropa-interior', img: interiorHombre },
      { id: 154, name: 'Calzados', image, url: 'calzados', img: calzadosHombre },
      { id: 155, name: 'Otros', image, url: 'otros', img: otrosNino },
    ],
  },
  { 
    id: 3, 
    name: 'Mujer', 
    url: 'mujer',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'jeans', img: jeansMujer },
      { id: 137, name: 'Pantalones y calzas', image, url: 'pantalones-y-calzas', img: pantalonesCalzasMujer },
      { id: 140, name: 'Shorts y polleras', image, url: 'shorts-y-polleras', img: shortsPollerasMujer },
      { id: 141, name: 'Camperas', image, url: 'camperas', img: camperasMujer },
      { id: 142, name: 'Remeras', image, url: 'remeras', img: remerasBebe },
      { id: 143, name: 'Camisas', image, url: 'camisas', img: camisasMujer },
      { id: 146, name: 'Buzos', image, url: 'buzos', img: buzosHombre },
      { id: 147, name: 'Sweaters', image, url: 'sweaters', img: sweatersMujer },
      { id: 149, name: 'Vestidos', image, url: 'vestidos', img: vestidosMujer },
      { id: 153, name: 'Lencería y mallas', image, url: 'lenceria-y-mallas', img: lenceriaMujer },
      { id: 154, name: 'Calzados', image, url: 'calzados', img: calzadosMujer },
      { id: 155, name: 'Otros', image, url: 'otros', img: otrosNina },
    ],
  },
  { 
    id: 4, 
    name: 'Niño', 
    url: 'niño',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'jeans', img: jeansHombre },
      { id: 136, name: 'Pantalones', image, url: 'pantalones', img: pantalonesHombre },
      { id: 139, name: 'Bermudas y shorts', image, url: 'bermudas-y-shorts', img: bermudasShorts },
      { id: 141, name: 'Camperas', image, url: 'camperas', img: camperasNino },
      { id: 142, name: 'Remeras', image, url: 'remeras', img: remerasHombre },
      { id: 143, name: 'Camisas', image, url: 'camisas', img: camisasHombre },
      { id: 144, name: 'Chombas', image, url: 'chombas', img: remerasBebe },
      { id: 146, name: 'Buzos', image, url: 'buzos', img: buzosNino },
      { id: 147, name: 'Sweaters', image, url: 'sweaters', img: sweatersHombre },
      { id: 151, name: 'Ropa interior', image, url: 'ropa-interior', img: interiorNino },
      { id: 154, name: 'Calzados', image, url: 'calzados', img: calzadosHombre },
      { id: 155, name: 'Otros', image, url: 'otros', img: otrosNino },
    ], 
  },
  { 
    id: 5, 
    name: 'Niña', 
    url: 'niña',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'jeans', img: jeansMujer },
      { id: 137, name: 'Pantalones y calzas', image, url: 'pantalones-y-calzas', img: pantalonesCalzasMujer },
      { id: 140, name: 'Shorts y polleras', image, url: 'shorts-y-polleras', img: shortsPollerasMujer },
      { id: 141, name: 'Camperas', image, url: 'camperas', img: camperasMujer },
      { id: 142, name: 'Remeras', image, url: 'remeras', img: remerasBebe },
      { id: 143, name: 'Camisas', image, url: 'camisas', img: camisasMujer },
      { id: 146, name: 'Buzos', image, url: 'buzos', img: buzosNino },
      { id: 147, name: 'Swaters', image, url: 'swaters', img: sweatersMujer },
      { id: 149, name: 'Vestidos', image, url: 'vestidos', img: vestidosNina },
      { id: 152, name: 'Ropa interior y mallas', image, url: 'ropa-interior-y-mallas', img: interiorNino },
      { id: 154, name: 'Calzados', image, url: 'calzados', img: calzadosHombre },
      { id: 155, name: 'Otros', image, url: 'otros', img: otrosNina },
    ],
  },
  { 
    id: 6, 
    name: 'Bebés', 
    url: 'bebes',
    image: image,
    categories: [
      { id: 145, name: 'Bodys', image, url: 'bodys', img: bodysBebe },
      { id: 142, name: 'Remeras', image, url: 'remeras', img: remerasBebe },
      { id: 143, name: 'Camisas', image, url: 'camisas', img: camisasBebe },
      { id: 156, name: 'Abrigos', image, url: 'abrigos', img: abrigosBebe },
      { id: 149, name: 'Vestidos', image, url: 'vestidos', img: vestidosBebe },
      { id: 136, name: 'Pantalones', image, url: 'pantalones', img: pantalonesBebe },
      { id: 150, name: 'Conjuntos', image, url: 'conjuntos', img: conjuntosBebe },
      { id: 157, name: 'Enterizos', image, url: 'enterizos', img: eneteritosBebe },
      { id: 154, name: 'Calzados', image, url: 'calzados', img: calzadosBebe },
      { id: 158, name: 'Medias', image, url: 'medias', img: mediasBebe },
      { id: 159, name: 'Accesorios', image, url: 'accesorios', img: accesoriosBebe },
      { id: 155, name: 'Otros', image, url: 'otros', img: otrosBebe },
    ],
  },
  { 
    id: 7, 
    name: 'Más', 
    url: 'mas',
    image: image,
    categories: [
      { id: 130, name: 'Blanquería', image, url: 'blanqueria', img: bisuteriaImg },
      { id: 131, name: 'Bisutería', image, url: 'bisuteria', img: blanqueriaImg },
    ],
  },
];