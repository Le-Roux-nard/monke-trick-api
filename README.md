<p>
  <h1 align="left">Monke Trick Api</h1>
</p>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://le-roux-nard.github.io/monke-trick-api/" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
  <br/>
  <br/>
</p>

**This API is based on [zws.im](https://zws.im) and their usage of invisible characters to shorten URIs**

## How to use it :

First, you have to create your own link by using the `/create` endpoint, it can be used with either **GET** or **POST** methods
<br/>
<sub>
(**POST** requires the following elements in JSON body : `picture, video`)
</sub>
<br/>
<br/>
A link will then be available and you just have to send it on discord.

## Install

```sh
npm install
```

## Usage

#### Standalone

```sh
npm run start
```

#### Module

```ts
import express from "express";
import setupRouter from "./router";

const app = express();
const collection = ... //use any valid MongoDB collection
const monkeRouter = setupRouter({collection});
app.use("myPath", monkeRouter);
app.listen(process.env.PORT ?? 8080);
```

## Author

👤 **Le_Roux-Nard**

<!-- -   Website: ... -->

-   Github: [@le-roux-nard](https://github.com/le-roux-nard)

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
