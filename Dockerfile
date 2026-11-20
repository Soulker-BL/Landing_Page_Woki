FROM node:22-alpine AS build

WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ARG PUBLIC_SITE_URL=https://www.woki.pe
ARG PUBLIC_NOINDEX=false
ARG PUBLIC_GOOGLE_SITE_VERIFICATION=
ARG PUBLIC_GOOGLE_PLAY_URL=
ARG PUBLIC_CONTACT_FORM_ENDPOINT=

ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL} \
    PUBLIC_NOINDEX=${PUBLIC_NOINDEX} \
    PUBLIC_GOOGLE_SITE_VERIFICATION=${PUBLIC_GOOGLE_SITE_VERIFICATION} \
    PUBLIC_GOOGLE_PLAY_URL=${PUBLIC_GOOGLE_PLAY_URL} \
    PUBLIC_CONTACT_FORM_ENDPOINT=${PUBLIC_CONTACT_FORM_ENDPOINT}

RUN npm run check && npm run build

FROM nginx:stable-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
