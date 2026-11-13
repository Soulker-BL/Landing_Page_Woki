export const brand = {
  name: 'Woki',
  legalName: 'Woki Mobility S.A.C.',
  city: 'Cerro de Pasco',
  region: 'Pasco',
  country: 'Perú',
  email: 'hola@woki.com.pe',
  whatsapp: '+51 900 000 000',
  whatsappIsTemporary: true,
  siteUrl: 'https://woki.com.pe',
  themeColor: '#218e97',
  demoPin: '4827',
  legalUpdated: '11 de noviembre de 2026',
  defaultTitle: 'Woki – Taxi urbano seguro y confiable en Cerro de Pasco',
  defaultDescription: 'Solicita tu taxi en segundos con Woki. Viajes con seguimiento y PIN de seguridad en Cerro de Pasco.',
} as const;

export const routes = {
  home: '/#inicio',
  howItWorks: '/#como-funciona',
  safety: '/#seguridad',
  drivers: '/#conductores',
  legalNotice: '/aviso-legal',
  download: '/#descargar',
  about: '/nosotros',
  contact: '/contacto',
  accountDeletion: '/eliminar-cuenta',
  terms: '/terminos',
  privacy: '/privacidad',
} as const;

export const assets = {
  socialImage: '/images/conductor.jpg',
  driverPhoto: '/images/conductor.jpg',
  aboutBanner: '/images/woki-nosotros.jpg',
  contactBanner: '/images/woki-contacto.jpg',
  passengerStep: (step: number) => `/images/pasos/pasajero-${step}.jpg`,
  driverStep: (step: number) => `/images/pasos/conductor-${step}.jpg`,
} as const;

export const navigation = [
  { href: routes.home, label: 'Inicio' },
  { href: routes.howItWorks, label: 'Cómo funciona' },
  { href: routes.safety, label: 'Seguridad' },
  { href: routes.drivers, label: 'Conductores' },
  { href: routes.about, label: 'Nosotros' },
  { href: routes.contact, label: 'Contáctanos' },
] as const;

export const footerNavigation = [
  navigation[0],
  ...navigation.slice(1),
] as const;

export const legalNavigation = [
  { href: routes.legalNotice, label: 'Información del sitio' },
  { href: routes.terms, label: 'Términos' },
  { href: routes.privacy, label: 'Privacidad' },
  { href: routes.accountDeletion, label: 'Eliminar cuenta' },
] as const;
