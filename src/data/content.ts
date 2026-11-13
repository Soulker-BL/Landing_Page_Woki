import { brand } from './site';

export interface ContentItem {
  title: string;
  description: string;
}

export interface IconItem extends ContentItem {
  iconPath: string;
}

export type JourneyStep = ContentItem;

export const benefits: IconItem[] = [
  { title: 'Viajes seguros', description: 'Conductores verificados con documentos y vehículo al día.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { title: 'Rápido', description: 'Solicita tu taxi en segundos y mira cuánto tarda en llegar.', iconPath: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
  { title: 'Confiable', description: 'Seguimiento del viaje en tiempo real, de principio a fin.', iconPath: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10m-2 0a2 2 0 104 0 2 2 0 10-4 0' },
  { title: 'Acompañamiento', description: 'Información clara para ayudarte durante la experiencia de viaje.', iconPath: 'M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19c0 2-3 2-6 2' },
];

export const passengerSteps: JourneyStep[] = [
  { title: 'Pide tu taxi', description: 'Indica dónde estás y a dónde vas. Añade una referencia si la necesitas.' },
  { title: 'Te asignamos conductor', description: `${brand.name} conecta contigo al taxi verificado más cercano.` },
  { title: 'Comparte tu PIN y viaja', description: 'Dale el PIN al conductor para confirmar que es el viaje correcto.' },
  { title: 'Paga y califica', description: 'Paga en efectivo o con Yape y deja tu reseña del conductor.' },
];

export const driverSteps: JourneyStep[] = [
  { title: 'Conéctate', description: 'Activa “En línea” y mira las solicitudes que tienes cerca.' },
  { title: 'Revisa el viaje', description: 'Ves recogida, destino, distancia, tiempo y forma de pago.' },
  { title: 'Acepta tu tarifa', description: 'Acepta la tarifa o súmale S/1, S/2 o S/3 en un toque.' },
  { title: 'Gana más', description: 'Controla lo ganado hoy y tu porcentaje de aceptación.' },
];

export const driverBenefits: ContentItem[] = [
  { title: 'Cada viaje, claro desde el inicio', description: 'Consulta recogida, destino, distancia, tiempo y forma de pago antes de aceptar la solicitud.' },
  { title: 'Participa en tu tarifa', description: 'Acepta la propuesta o ajústala con +S/1, +S/2 o +S/3.' },
  { title: 'Tus ganancias a la vista', description: 'Revisa cuánto llevas en el día y consulta tu porcentaje de aceptación.' },
  { title: 'Conéctate a tu ritmo', description: 'Activa “En línea” cuando estés listo para recibir solicitudes cerca de ti.' },
];

export const driverReasons: IconItem[] = [
  { title: 'Movilidad local, de verdad', description: `Woki nace en ${brand.city} para acercar a quienes conocen sus calles con las personas que necesitan moverse por la ciudad.`, iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M8 9h.01M12 9h.01M16 9h.01' },
  { title: 'La confianza se construye entre ambos', description: 'El PIN de seguridad confirma el inicio del viaje correcto y ayuda a que pasajero y conductor compartan la misma referencia.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { title: 'Una experiencia pensada para el taxi urbano', description: 'Las herramientas de Woki acompañan el servicio desde que te conectas hasta que completas cada recorrido.', iconPath: 'M4 12h16M13 5l7 7-7 7M4 5v14' },
];

export const faqs: { question: string; answer: string }[] = [
  { question: `¿Dónde funciona ${brand.name}?`, answer: `${brand.name} está disponible en ${brand.city} y alrededores. Pronto llegaremos a más ciudades.` },
  { question: '¿Cómo sé que mi conductor es de confianza?', answer: 'Todos los conductores son verificados: licencia, SOAT y datos del vehículo. Además, cada viaje usa un PIN de seguridad y puedes ver las reseñas de otros pasajeros.' },
  { question: '¿Cómo pago mi viaje?', answer: 'Puedes pagar en efectivo o con Yape directamente al conductor.' },
  { question: '¿Puedo seguir mi viaje en tiempo real?', answer: 'Sí. Ves al conductor en el mapa, su placa, su vehículo y el tiempo de llegada. También puedes escribirle o llamarlo desde la app.' },
  { question: '¿Cómo me registro como conductor?', answer: 'Descarga la app, elige la opción de conductor y sube tus documentos. Nuestro equipo los revisa y te activa.' },
];

export const edificios: [number, number, number][] = [[0,60,70],[60,44,110],[104,70,80],[174,50,130],[224,80,95],[304,46,60],[350,70,120],[420,56,85],[476,90,140],[566,50,75],[616,74,100],[690,60,125],[750,50,70]];
export const ventanas = edificios.flatMap(([x, w, h], i) => {
  const out: { x: number; y: number; d: number }[] = [];
  for (let y = 660 - h * 1.4 + 22, r = 0; y < 648; y += 24, r++)
    for (let cx = x + 8, c = 0; cx < x + w - 7; cx += 13, c++)
      if ((i * 7 + r * 3 + c * 5) % 4 !== 0) out.push({ x: cx, y, d: ((i + r + c) % 7) * 0.6 });
  return out;
});

const casaColores = ['#0b7480', '#1f95a0', '#65d9dd', '#e9f7f8', '#2a8a94', '#f5a524'];
export const casas = Array.from({ length: 34 }, (_, i) => {
  const w = 18 + ((i * 7) % 9), h = 14 + ((i * 5) % 11);
  return { x: 290 + i * 26 + ((i * 13) % 9), w, top: 106 - h, c: casaColores[i % 9 === 4 ? 5 : i % 5] };
}).filter((c) => c.x + c.w < 650 || c.x > 790);

export function buildJsonLd(site?: URL) {
  const base = site ?? new URL(brand.siteUrl);
  return [
    { '@context': 'https://schema.org', '@type': 'Organization', name: brand.name, url: base.href, logo: new URL('/favicon.svg', base).href },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ];
}

export const contacto = {
  email: brand.email,
  ubicacion: `${brand.city}, ${brand.region}, ${brand.country}`,
  whatsapp: brand.whatsapp,
  whatsappIsTemporary: brand.whatsappIsTemporary,
};

export const features: IconItem[] = [
  { title: 'PIN de seguridad', description: 'Cada viaje tiene un código único. Solo el conductor correcto puede iniciarlo.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9.5 12.5V11a2.5 2.5 0 015 0v1.5M9 12.5h6v4H9z' },
  { title: 'Seguimiento en tiempo real', description: 'Mira el recorrido en el mapa y cuánto falta para llegar.', iconPath: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0' },
  { title: 'Chat y llamada', description: 'Habla con tu conductor sin salir de la app.', iconPath: 'M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2h-7l-5 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z' },
  { title: 'Pago en efectivo o Yape', description: 'Elige cómo pagar antes de pedir tu taxi.', iconPath: 'M3 7a2 2 0 012-2h13v4M3 7v10a2 2 0 002 2h14a1 1 0 001-1v-8a1 1 0 00-1-1H5a2 2 0 01-2-2zM16 14h2' },
  { title: 'Reseñas reales', description: 'Consulta la calificación y los comentarios de otros pasajeros.', iconPath: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z' },
];

export const values: IconItem[] = [
  { title: 'Confianza', description: 'Conductores verificados y un PIN en cada viaje para que viajes tranquilo.', iconPath: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { title: 'Cercanía', description: 'Conectamos a vecinos con taxistas de la ciudad, con trato cercano.', iconPath: 'M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z' },
  { title: 'Modernidad', description: 'Tecnología actual para pedir, seguir y pagar tu viaje sin complicaciones.', iconPath: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
  { title: 'Facilidad de uso', description: 'Una app simple: pides tu taxi en segundos, sin vueltas.', iconPath: 'M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM11 18h2' },
];
