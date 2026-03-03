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
  { id: 161, name: 'Packs' },
  { id: 162, name: 'Telas textiles' },
  { id: 163, name: 'Artículos de confección' },
  { id: 164, name: 'Máquinas textiles' },
];

export const genders = [
  { 
    id: 2, 
    name: 'Hombre', 
    url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/generos/hombre.png',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/7+jeans.png', img: jeansHombre },
      { id: 136, name: 'Pantalones', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/8+pantalones.png', img: pantalonesHombre },
      { id: 139, name: 'Bermudas y shorts', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/9+bermudas.png', img: bermudasShorts },
      { id: 141, name: 'Camperas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/1+camperas.png', img: camperasHombre },
      { id: 142, name: 'Remeras', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/4+remeras.png', img: remerasHombre },
      { id: 143, name: 'Camisas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/6+camisas.png', img: camisasHombre },
      { id: 144, name: 'Chombas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/5+chombas.png', img: remerasBebe },
      { id: 146, name: 'Buzos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/2+buzos.png', img: buzosHombre },
      { id: 147, name: 'Sweaters', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/3+sweaters.png', img: sweatersHombre },
      { id: 151, name: 'Ropa interior', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/10+ropa+interior.png', img: interiorHombre },
      { id: 154, name: 'Calzados', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/11+calzados.png', img: calzadosHombre },
      { id: 155, name: 'Otros', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/hombre/12+otros.png', img: otrosNino },
    ],
  },
  { 
    id: 3, 
    name: 'Mujer', 
    url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/generos/mujer.png',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/7+jeans.png', img: jeansMujer },
      { id: 137, name: 'Pantalones y calzas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/8+calzas+-+pantalones.png', img: pantalonesCalzasMujer },
      { id: 140, name: 'Shorts y polleras', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/9+shorts+-+polleras.png', img: shortsPollerasMujer },
      { id: 141, name: 'Camperas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/1+camperas.png', img: camperasMujer },
      { id: 142, name: 'Remeras', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/4+remeras.png', img: remerasBebe },
      { id: 143, name: 'Camisas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/5+camisas.png', img: camisasMujer },
      { id: 146, name: 'Buzos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/2+buzos.png', img: buzosHombre },
      { id: 147, name: 'Sweaters', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/3+sweaters.png', img: sweatersMujer },
      { id: 149, name: 'Vestidos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/6+vestidos.png', img: vestidosMujer },
      { id: 153, name: 'Lencería y mallas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/10+mallas.png', img: lenceriaMujer },
      { id: 154, name: 'Calzados', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/11+calzados.png', img: calzadosMujer },
      { id: 155, name: 'Otros', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png', img: otrosNina },
    ],
  },
  { 
    id: 4, 
    name: 'Niño', 
    url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/generos/ni%C3%B1o.png',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/7+jeans.png', img: jeansHombre },
      { id: 136, name: 'Pantalones', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/8+pantalones.png', img: pantalonesHombre },
      { id: 139, name: 'Bermudas y shorts', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/9+bermudas.png', img: bermudasShorts },
      { id: 141, name: 'Camperas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/1+camperas.png', img: camperasNino },
      { id: 142, name: 'Remeras', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/4+remeras.png', img: remerasHombre },
      { id: 143, name: 'Camisas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/6+camisas.png', img: camisasHombre },
      { id: 144, name: 'Chombas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/5+chombas.png', img: remerasBebe },
      { id: 146, name: 'Buzos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/2+buzos.png', img: buzosNino },
      { id: 147, name: 'Sweaters', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/3+sweaters.png', img: sweatersHombre },
      { id: 151, name: 'Ropa interior', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/10+ropa+interior.png', img: interiorNino },
      { id: 154, name: 'Calzados', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/11+calzados.png', img: calzadosHombre },
      { id: 155, name: 'Otros', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1o/12+otros.png', img: otrosNino },
    ], 
  },
  { 
    id: 5, 
    name: 'Niña', 
    url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/generos/ni%C3%B1a.png',
    image: image,
    categories: [
      { id: 135, name: 'Jeans', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/7+jeans.png', img: jeansMujer },
      { id: 137, name: 'Pantalones y calzas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/8+calzas+pantalones.png', img: pantalonesCalzasMujer },
      { id: 140, name: 'Shorts y polleras', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/9+short+-+polleras.png', img: shortsPollerasMujer },
      { id: 141, name: 'Camperas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/1+camperas.png', img: camperasMujer },
      { id: 142, name: 'Remeras', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/4+remeras.png', img: remerasBebe },
      { id: 143, name: 'Camisas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/5+camisas.png', img: camisasMujer },
      { id: 146, name: 'Buzos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/2+buzos.png', img: buzosNino },
      { id: 147, name: 'Swaters', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/3+sweaters.png', img: sweatersMujer },
      { id: 149, name: 'Vestidos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/6+vestidos.png', img: vestidosNina },
      { id: 152, name: 'Ropa interior y mallas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/10+mallas+y+ropa+interior.png', img: interiorNino },
      { id: 154, name: 'Calzados', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/11+calzados.png', img: calzadosHombre },
      { id: 155, name: 'Otros', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/ni%C3%B1a/12+otros.png', img: otrosNina },
    ],
  },
  { 
    id: 6, 
    name: 'Bebés', 
    url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/generos/bebe.png',
    image: image,
    categories: [
      { id: 145, name: 'Bodys', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/6+bodys.png', img: bodysBebe },
      { id: 142, name: 'Remeras', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/4+remeritas.png', img: remerasBebe },
      { id: 143, name: 'Camisas', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/3+camisas.png', img: camisasBebe },
      { id: 156, name: 'Abrigos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/1+camperitas.png', img: abrigosBebe },
      { id: 149, name: 'Vestidos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/5+vestiditos.png', img: vestidosBebe },
      { id: 136, name: 'Pantalones', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/7+pantalones.png', img: pantalonesBebe },
      { id: 150, name: 'Conjuntos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/8+conjuntos.png', img: conjuntosBebe },
      { id: 157, name: 'Enterizos', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/2+enteritos.png', img: eneteritosBebe },
      { id: 154, name: 'Calzados', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/9+zapatitos.png', img: calzadosBebe },
      { id: 158, name: 'Medias', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/10+medias.png', img: mediasBebe },
      { id: 159, name: 'Accesorios', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/12+otros.png', img: accesoriosBebe },
      { id: 155, name: 'Otros', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/bebe/11+accesorios.png', img: otrosBebe },
    ],
  },
  { 
    id: 7, 
    name: 'Más', 
    url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png',
    image: image,
    categories: [
      { id: 130, name: 'Blanquería', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png', img: bisuteriaImg },
      { id: 131, name: 'Bisutería', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png', img: blanqueriaImg },
      { id: 161, name: 'Packs', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png', img: image },
      { id: 162, name: 'Telas textiles', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png', img: image },
      { id: 163, name: 'Costura y confección', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png', img: image },
      { id: 164, name: 'Máquinas textiles', image, url: 'https://fabricante-directo-node.s3.sa-east-1.amazonaws.com/images/mujer/12+otros.png', img: image },
    ],
  },
];