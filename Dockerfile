FROM node:alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --no-package-lock && npm install -g @angular/cli

COPY . .

RUN ng build --prod

FROM nginx:alpine

COPY --from=builder /app/dist/Restaurant-Delivery-Front-end /usr/share/nginx/html/