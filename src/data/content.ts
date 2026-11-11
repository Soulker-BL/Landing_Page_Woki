export const beneficios = [
  { t: 'Viajes seguros', d: 'Conductores verificados con documentos y vehículo al día.', p: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { t: 'Rápido', d: 'Solicita tu taxi en segundos y mira cuánto tarda en llegar.', p: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
  { t: 'Confiable', d: 'Seguimiento del viaje en tiempo real, de principio a fin.', p: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10m-2 0a2 2 0 104 0 2 2 0 10-4 0' },
  { t: 'Acompañamiento', d: 'Información clara para ayudarte durante la experiencia de viaje.', p: 'M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19c0 2-3 2-6 2' },
];

export const pasajero: [string, string][] = [
  ['Pide tu taxi', 'Indica dónde estás y a dónde vas. Añade una referencia si la necesitas.'],
  ['Te asignamos conductor', 'Woki conecta contigo al taxi verificado más cercano.'],
  ['Comparte tu PIN y viaja', 'Dale el PIN al conductor para confirmar que es el viaje correcto.'],
  ['Paga y califica', 'Paga en efectivo o con Yape y deja tu reseña del conductor.'],
];

export const conductor: [string, string][] = [
  ['Conéctate', 'Activa “En línea” y mira las solicitudes que tienes cerca.'],
  ['Revisa el viaje', 'Ves recogida, destino, distancia, tiempo y forma de pago.'],
  ['Acepta tu tarifa', 'Acepta la tarifa o súmale S/1, S/2 o S/3 en un toque.'],
  ['Gana más', 'Controla lo ganado hoy y tu porcentaje de aceptación.'],
];

export const faqs: [string, string][] = [
  ['¿Dónde funciona Woki?', 'Woki está disponible en Cerro de Pasco y alrededores. Pronto llegaremos a más ciudades.'],
  ['¿Cómo sé que mi conductor es de confianza?', 'Todos los conductores son verificados: licencia, SOAT y datos del vehículo. Además, cada viaje usa un PIN de seguridad y puedes ver las reseñas de otros pasajeros.'],
  ['¿Cómo pago mi viaje?', 'Puedes pagar en efectivo o con Yape directamente al conductor.'],
  ['¿Puedo seguir mi viaje en tiempo real?', 'Sí. Ves al conductor en el mapa, su placa, su vehículo y el tiempo de llegada. También puedes escribirle o llamarlo desde la app.'],
  ['¿Cómo me registro como conductor?', 'Descarga la app, elige la opción de conductor y sube tus documentos. Nuestro equipo los revisa y te activa.'],
];

// Ciudad de noche (sección de funcionalidades)
export const edificios: [number, number, number][] = [[0,60,70],[60,44,110],[104,70,80],[174,50,130],[224,80,95],[304,46,60],[350,70,120],[420,56,85],[476,90,140],[566,50,75],[616,74,100],[690,60,125],[750,50,70]];
export const ventanas = edificios.flatMap(([x, w, h], i) => {
  const out: { x: number; y: number; d: number }[] = [];
  for (let y = 150 - h + 10, r = 0; y < 140; y += 14, r++)
    for (let cx = x + 8, c = 0; cx < x + w - 10; cx += 12, c++)
      if ((i * 7 + r * 3 + c * 5) % 3 === 0) out.push({ x: cx, y, d: ((i + r + c) % 7) * 0.6 });
  return out;
});

// Casitas del paisaje del footer
const casaColores = ['#0b7480', '#1f95a0', '#65d9dd', '#e9f7f8', '#2a8a94', '#f5a524'];
export const casas = Array.from({ length: 34 }, (_, i) => {
  const w = 18 + ((i * 7) % 9), h = 14 + ((i * 5) % 11);
  return { x: 290 + i * 26 + ((i * 13) % 9), w, top: 106 - h, c: casaColores[i % 9 === 4 ? 5 : i % 5] };
}).filter((c) => c.x + c.w < 650 || c.x > 790);

// Datos estructurados para SEO
export function buildJsonLd(site?: URL) {
  const base = site ?? new URL('https://woki.com.pe');
  return [
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'Woki', url: base.href, logo: new URL('/favicon.svg', base).href },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
}

// Datos de contacto (cámbialos por los reales)
export const contacto = {
  email: 'hola@woki.com.pe',
  ubicacion: 'Cerro de Pasco, Pasco, Perú',
};

export const funciones = [
  { t: 'PIN de seguridad', d: 'Cada viaje tiene un código único. Solo el conductor correcto puede iniciarlo.', p: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9.5 12.5V11a2.5 2.5 0 015 0v1.5M9 12.5h6v4H9z' },
  { t: 'Seguimiento en tiempo real', d: 'Mira el recorrido en el mapa y cuánto falta para llegar.', p: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0' },
  { t: 'Chat y llamada', d: 'Habla con tu conductor sin salir de la app.', p: 'M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2h-7l-5 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z' },
  { t: 'Pago en efectivo o Yape', d: 'Elige cómo pagar antes de pedir tu taxi.', p: 'M3 7a2 2 0 012-2h13v4M3 7v10a2 2 0 002 2h14a1 1 0 001-1v-8a1 1 0 00-1-1H5a2 2 0 01-2-2zM16 14h2' },
  { t: 'Reseñas reales', d: 'Consulta la calificación y los comentarios de otros pasajeros.', p: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z' },
];

export const valores = [
  { t: 'Confianza', d: 'Conductores verificados y un PIN en cada viaje para que viajes tranquilo.', p: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3zM9 12l2 2 4-4' },
  { t: 'Cercanía', d: 'Conectamos a vecinos con taxistas de la ciudad, con trato cercano.', p: 'M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z' },
  { t: 'Modernidad', d: 'Tecnología actual para pedir, seguir y pagar tu viaje sin complicaciones.', p: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
  { t: 'Facilidad de uso', d: 'Una app simple: pides tu taxi en segundos, sin vueltas.', p: 'M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM11 18h2' },
];
