FROM node:14.3.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --no-package-lock && npm install -g @angular/cli

COPY . .

RUN ng build --prod

FROM nginx:1.9.15-alpine
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/dist/Restaurant-Delivery-Front-end /usr/share/nginx/html/