import { media } from './media';

export const brand = {
  name: 'Woki',
  legalName: 'Woki Mobility S.A.C.',
  city: 'Cerro de Pasco',
  region: 'Pasco',
  country: 'Perú',
  email: 'hola@woki.com.pe',
  emailIsTemporary: true,
  whatsapp: '+51 900 000 000',
  whatsappIsTemporary: true,
  siteUrl: (import.meta.env.PUBLIC_SITE_URL?.trim() || 'https://woki.com.pe').replace(/\/+$/, ''),
  themeColor: '#218e97',
  demoPin: '4827',
  legalUpdated: '17 de noviembre de 2026',
  defaultTitle: 'Taxi en Cerro de Pasco fácil y seguro | Woki',
  defaultDescription: 'Pide tu taxi en Cerro de Pasco con Woki: conoce tu tarifa, sigue el viaje y comparte un PIN de seguridad. Descubre una forma más fácil de moverte.',
} as const;

export const analytics = {
  gtmContainerId: 'GTM-P487G36D',
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
  socialImage: media.driverPhoto,
  driverPhoto: media.driverPhoto,
  aboutBanner: media.aboutBanner,
  contactBanner: media.contactBanner,
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
