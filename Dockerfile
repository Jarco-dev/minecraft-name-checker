FROM node:22-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps

COPY package*.json ./

RUN npm ci

FROM deps AS development

RUN apk add --no-cache bash

USER node

CMD npm run dev

FROM deps AS build

COPY ./src ./src
COPY tsconfig.json ./tsconfig.json

RUN npm run build

FROM base AS production

RUN mkdir storage
RUN chown -R node:node /usr/src/app

USER node

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD npm run start
