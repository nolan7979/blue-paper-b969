# Build stage
FROM node:18.16.0-alpine AS build

WORKDIR /tmp/app

COPY . .

RUN yarn install

RUN yarn build

RUN mkdir -p /app/.next

RUN cp ./package.json /app && \
    cp ./.env.local /app && \
    cp ./withTwin.js /app && \
    cp ./tailwind.config.js /app && \
    cp ./next.config.js /app && \
    cp ./next-sitemap.config.js /app && \
    cp ./i18n.config.js /app && \
    cp -r ./.next /app && \
    cp -r ./node_modules /app && \
    cp -r ./public /app

# Release stage
FROM node:18.16.0-alpine

WORKDIR /app

COPY --from=build /app .

ENTRYPOINT [ "yarn", "start" ]
