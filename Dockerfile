FROM nginx:1.17.1-alpine
COPY /dist/carform /usr/share/nginx/html
