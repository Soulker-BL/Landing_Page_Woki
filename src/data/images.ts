import driver from '../assets/images/conductor.jpg';
import aboutBanner from '../assets/images/woki-nosotros.jpg';
import contactBanner from '../assets/images/woki-contacto.jpg';
import passenger1 from '../assets/images/pasos/pasajero-1.jpg';
import passenger2 from '../assets/images/pasos/pasajero-2.jpg';
import passenger3 from '../assets/images/pasos/pasajero-3.jpg';
import passenger4 from '../assets/images/pasos/pasajero-4.jpg';
import driver1 from '../assets/images/pasos/conductor-1.jpg';
import driver2 from '../assets/images/pasos/conductor-2.jpg';
import driver3 from '../assets/images/pasos/conductor-3.jpg';
import driver4 from '../assets/images/pasos/conductor-4.jpg';

const image = (src: typeof driver, path: string, alt: string, purpose: string) => ({ src, path, alt, purpose });

const images = {
  driver: image(driver, 'src/assets/images/conductor.jpg', 'Conductor de taxi dentro de un vehículo en Cerro de Pasco.', 'Foto principal de conductores y base provisional de las vistas al compartir.'),
  aboutBanner: image(aboutBanner, 'src/assets/images/woki-nosotros.jpg', 'Imagen provisional del equipo y la propuesta local de Woki.', 'Fondo del banner de Nosotros.'),
  contactBanner: image(contactBanner, 'src/assets/images/woki-contacto.jpg', 'Imagen provisional para el banner de contacto de Woki.', 'Fondo del banner de Contáctanos.'),
  passengerSteps: [
    image(passenger1, 'src/assets/images/pasos/pasajero-1.jpg', 'Pasajero solicitando un taxi desde la app de Woki en Cerro de Pasco.', 'Etapa 1: pedir un taxi.'),
    image(passenger2, 'src/assets/images/pasos/pasajero-2.jpg', 'Pasajero revisando el conductor asignado para su viaje en la app de Woki.', 'Etapa 2: revisar la asignación.'),
    image(passenger3, 'src/assets/images/pasos/pasajero-3.jpg', 'Pasajero compartiendo el PIN antes de iniciar su viaje con Woki.', 'Etapa 3: confirmar el viaje con el PIN.'),
    image(passenger4, 'src/assets/images/pasos/pasajero-4.jpg', 'Pasajero consultando el pago y la calificación de un viaje en Woki.', 'Etapa 4: pagar y calificar.'),
  ],
  driverSteps: [
    image(driver1, 'src/assets/images/pasos/conductor-1.jpg', 'Conductor activando su disponibilidad para recibir solicitudes de taxi en Woki.', 'Etapa 1: conectarse.'),
    image(driver2, 'src/assets/images/pasos/conductor-2.jpg', 'Conductor revisando los detalles de una solicitud de viaje en la app de Woki.', 'Etapa 2: revisar el viaje.'),
    image(driver3, 'src/assets/images/pasos/conductor-3.jpg', 'Conductor revisando y aceptando la tarifa propuesta para un viaje en Woki.', 'Etapa 3: aceptar la tarifa.'),
    image(driver4, 'src/assets/images/pasos/conductor-4.jpg', 'Conductor consultando sus viajes y ganancias en la app de Woki.', 'Etapa 4: consultar las ganancias.'),
  ],
} as const;

export default images;
