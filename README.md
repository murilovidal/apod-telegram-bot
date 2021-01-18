# APOD Telegram BOT

A Telegram bot that lets you receive the picture of the day or a random picture from the website [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html).

## Getting Started

This bot uses the NASA's Astronomy Picture of the Day API to send to user the image or video of the day and its respective explanation.

Use the commands `/image` to retrieve the picture of the day or `/random` to receive a random image from the NASA Astronomy Picture of the Day website.

![example](animation.gif)

### Prerequisites

```
axios: 0.21.1,
dotenv: 8.2.0,
telegraf: 4.0.1
```

### Installation

Clone the repository with command `git clone https://github.com/murilovidal/api-telegram.git`
Fill the `.sample_env` file with the Telegram Bot API key and the NASA's API key and rename it to `.env`.

run `npm install`

## Built With

- [Telegraf](https://telegraf.js.org/) - Telegraf is a library that makes it simple for you to develop your own Telegram bots using JavaScript or TypeScript.
- [NASA's APOD](https://api.nasa.gov/) - Astronomy Picture of the Day API.

## Authors

- [**Murilo Vidal**](https://murilovidal.xyz/)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
