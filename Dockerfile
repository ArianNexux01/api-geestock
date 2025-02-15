FROM node:16 AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npm run build

FROM node:16-alpine3.14

WORKDIR /usr/app

COPY package*.json  ./
COPY .env .

RUN npm config rm proxy && npm config rm https-proxy

RUN npm install --omit=dev


COPY --from=builder /app/dist ./dist
RUN mkdir -m 777 public
COPY --from=builder /app/public/* ./dist/public/
COPY ./prisma ./dist/src/database

WORKDIR /usr/app/dist/src/database

RUN npx prisma generate

WORKDIR /usr/app

EXPOSE 3004

CMD [ "node", "./dist/src/main.js" ]

#CMD [ "tail","-f" "/dev/null" ]