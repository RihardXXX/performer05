<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Описание проекта

[Nest](https://github.com/nestjs/nest) мощный фреймворк для бэкенд разработки

## Установка проекта

```bash
$ npm install
```

## Запуск проекта

```bash
# режим разработки
$ npm run start

# режим слежки разработки
$ npm run start:dev

# запуск билда для продакшина
$ npm run start:prod
```

## Запуск проекта дополнительно

```bash
# Установка БД Postgres
# Получние порта пароля и настройка БД
# Создание БД под проект
# Создание пользователя и установка ему всез привилегий и связки под БД
# Настройка ОРМ файла с настроками
# Удаление текущих миграций
# Запуск миграций 
```


## Поддержка

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Автор фреймворка

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Текущие планы
1. Реализация Лайков заказов +
2. Реализация Лайков для клиентов и мастеров +
3. Получение списка заказов на которые поданы заявки для Клиента с пагинацией
4. Реализация списка лиц которые лайкали анкету клиента или мастера
5. Реализация Отзывов по клиентам и мастерам
6. Реализация Рейтинга у клиентов и мастеров
7. Реализация Подписок на Клиентов и мастеров
8. Реализация Просмотра заказов на которые подана заявка(Мастер)
9. Реализация Просмотра моих опубликованных заказов(Клиент)

## Спецификация по работе с API
- Создание клиента
```js
method: post
path: http://localhost:3000/users
```
```js
{
  "user":{
    "username": "test@test.ru",
    "email": "test@test.ru",
    "password": "test@test.ru",
    "role": "customer"
  }
}
```
- Создание мастера
```js
method: post
path: http://localhost:3000/users
```
```js
{
  "user":{
    "username": "test@test.ru",
    "email": "test@test.ru",
    "password": "test@test.ru",
    "role": "performer"
  }
}
```
- Вход на сайт
```js
method: post
path: http://localhost:3000/users/login
```
```js
{
  "user":{
    "email": "test@test.ru",
    "password": "test@test.ru"
  }
}
```
- Получить данные текущего юзера
```js
method: get
path: http://localhost:3000/user
```
```js
Header Authorization 
token tdtdskdjfkf47564756
```
- Обновить данные текущего пользователя
```js
method: patch
path: http://localhost:3000/user
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "user":{
    "username": "rihard@rihard.ru"
  }
}
```
- Создание заказа
```js
method: post
path: http://localhost:3000/orders
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "order":{
  "title": "починить",
    "description": "description котёл",
    "body": "котёл",
    "price": "price",
    "address": "address",
    "category": ["angular", "react"],
    "dueDate": "dueDate",
    "dueTime": "dueTime"
  }
}
```

- Получение информации по текущему заказу
```js
method: get
path: http://localhost:3000/orders/:slug
```
```js
Response
{
  "order": {
    "id": 1,
    "slug": "hello-1-52908ca3",
    "title": "test 123",
    "description": "описание",
    "body": "",
    "price": "price",
    "address": "address",
    "category": [
        "test"
      ],
    "dueDate": "dueDate",
    "dueTime": "dueTime",
    "listOfPerformers": [],
    "selectedPerformer": true,
    "status": "в работе",
    "victory": "2",
    "createdAt": "2022-01-22T08:06:38.827Z",
    "user": {
        "id": 1,
          "username": "test@test.ru",
          "email": "test@test.ru",
          "role": "customer",
          "bio": ""
    }
  }
}
```
- Удаление заказа
```js
method: delete
path: http://localhost:3000/orders/:slug
```
```js
Header Authorization 
token tdtdskdjfkf47564756
```
- Обновление заказа
```js
method: put
path: http://localhost:3000/orders/:slug
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "order":  {
    "title": "test 123",
    "description": "описание",
    "price": "price",
    "address": "address",
    "category": ["test"],
    "dueDate": "dueDate",
    "dueTime": "dueTime"
  }
}
```
- Подача заявки на заказ
```js
method: patch
path: http://localhost:3000/orders/:slug/submit
```
```js
Header Authorization 
token tdtdskdjfkf47564756
```
- Определение победителя заявки
```js
method: post
path: http://localhost:3000/orders/victory
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "victory": {
    "idPerformer": "2",
    "slugOrder": "hello-1-52908ca3"
  }
}
```
- Получение списка заказов а также поиск по квери параметрам
```js
method: get
path: http://localhost:3000/orders/list
```
```js
поиск взаимоисключающий
пагинация ?limit=10&offset=0
поиск по автору ?username=victor
поиск по категории ?category=сантехника
поиск по ключевой фразе в названии, описании или основном тексте заказа ?name=котёл
```
- Лайк к текущему заказу
```js
method: post
path: http://localhost:3000/orders/:slug/favorite
```
```js
Header Authorization 
token tdtdskdjfkf47564756
```
- Дизлайк к текущему заказу
```js
method: delete
path: http://localhost:3000/orders/:slug/favorite
```
```js
Header Authorization 
token tdtdskdjfkf47564756
```
- Лайк или дизлайк аккаунтам
```js
method: post
path: http://localhost:3000/user/:id/like
id это айди анкеты которую будем лайкать
```
```js
Header Authorization 
token tdtdskdjfkf47564756
```
