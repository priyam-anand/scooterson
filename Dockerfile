#build stage
FROM node:20-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build


#production stage
FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist

COPY --from=build usr/src/app/package*.json ./

COPY --from=build usr/src/app/keys ./keys

COPY --from=build usr/src/app/.env ./.env

RUN npm ci --only=production

RUN rm package-lock.json

EXPOSE 3000

CMD [ "npm", "run", "start" ]