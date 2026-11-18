import driverPhoto from '../assets/images/conductor.jpg';
import aboutBanner from '../assets/images/woki-nosotros.jpg';
import contactBanner from '../assets/images/woki-contacto.jpg';
import passengerStep1 from '../assets/images/pasos/pasajero-1.jpg';
import passengerStep2 from '../assets/images/pasos/pasajero-2.jpg';
import passengerStep3 from '../assets/images/pasos/pasajero-3.jpg';
import passengerStep4 from '../assets/images/pasos/pasajero-4.jpg';
import driverStep1 from '../assets/images/pasos/conductor-1.jpg';
import driverStep2 from '../assets/images/pasos/conductor-2.jpg';
import driverStep3 from '../assets/images/pasos/conductor-3.jpg';
import driverStep4 from '../assets/images/pasos/conductor-4.jpg';

export const media = {
  driverPhoto,
  aboutBanner,
  contactBanner,
  passengerSteps: [passengerStep1, passengerStep2, passengerStep3, passengerStep4],
  driverSteps: [driverStep1, driverStep2, driverStep3, driverStep4],
} as const;
