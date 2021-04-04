FROM node:15.11.0-stretch-slim

COPY . /apod-telegram-bot/

WORKDIR /apod-telegram-bot

RUN npm install

CMD ["npm","start"]
