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

RUN npm install --production

#RUN npm install pm2 -g

COPY --from=builder /app/dist ./dist

COPY ./prisma ./dist/src/database

WORKDIR /usr/app/dist/src/database

RUN npx prisma generate
#RUN npx prisma migrate deploy --schema=./dist/src/database/schema.prisma

WORKDIR /usr/app

EXPOSE 3004

CMD [ "node", "./dist/src/main.js" ]

#CMD [ "tail","-f" "/dev/null" ]