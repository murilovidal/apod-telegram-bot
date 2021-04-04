[![GitHub issues](https://img.shields.io/github/issues/murilovidal/apod-telegram-bot)](https://github.com/murilovidal/apod-telegram-bot/issues) [![GitHub forks](https://img.shields.io/github/forks/murilovidal/apod-telegram-bot)](https://github.com/murilovidal/apod-telegram-bot/network) [![GitHub stars](https://img.shields.io/github/stars/murilovidal/apod-telegram-bot)](https://github.com/murilovidal/apod-telegram-bot/stargazers) [![GitHub license](https://img.shields.io/github/license/murilovidal/apod-telegram-bot)](https://github.com/murilovidal/apod-telegram-bot) ![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/murilovidal/apod-telegram-bot?color=teal)

# APOD Telegram BOT

A Telegram bot that lets you receive the picture of the day or a random picture from the website [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html).

## About

This bot uses the NASA's Astronomy Picture of the Day API to send to user the image or video of the day and its respective explanation.

Use the commands `/image` to retrieve the picture of the day or `/random` to receive a random image from the NASA Astronomy Picture of the Day website.

![example](animation.gif)

### Prerequisites

- axios: 0.21.1
- dotenv: 8.2.0
- telegraf: 4.0.3
- typeorm: 0.2.30

### Installation

- Clone the repository with command `git clone https://github.com/murilovidal/apod-telegram-bot`
- Fill the `.env` with the variables needed for TypeORM and the Nasa's APOD API. Refer to `.sample.env` or `.env.test` for an example.

Run:
`docker-compose up`

### Testing

- Start the testing database with `docker-compose -f docker-compose.local.yml up`

- Run `npm tests`

### Built With

- [Telegraf](https://telegraf.js.org/) - Telegraf is a library that makes it simple for you to develop your own Telegram bots using JavaScript or TypeScript.
- [NASA's APOD](https://api.nasa.gov/) - Astronomy Picture of the Day API.
- [Typeorm](https://typeorm.io/) - TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).

### Contact

- [**Murilo Vidal**](https://murilovidal.xyz/) - [**e-mail**](murilovidal@gmail.com)
- [Project Link](https://github.com/murilovidal)
