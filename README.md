# APOD Telegram BOT

A Telegram bot that lets you receive the picture of the day or a random picture from the website [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html).

## About

This bot uses the NASA's Astronomy Picture of the Day API to send to user the image or video of the day and its respective explanation.

Use the commands `/image` to retrieve the picture of the day or `/random` to receive a random image from the NASA Astronomy Picture of the Day website.

![example](animation.gif)

### Prerequisites

```
axios: 0.21.1,
dotenv: 8.2.0,
telegraf: 4.0.3
typeorm: "0.2.30"

```

### Installation

Clone the repository with command `git clone https://github.com/murilovidal/apod-telegram-bot`
Fill the `.env` with your environment. Refer to `.sample.env` as an example.

run `npm install` && `npm start`

## Built With

- [Telegraf](https://telegraf.js.org/) - Telegraf is a library that makes it simple for you to develop your own Telegram bots using JavaScript or TypeScript.
- [NASA's APOD](https://api.nasa.gov/) - Astronomy Picture of the Day API.
- [Typeorm](https://typeorm.io/) - TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).

## Authors

- [**Murilo Vidal**](https://murilovidal.xyz/)

Contributor

- [**Felipe**](https://github.com/felipedesu/)
