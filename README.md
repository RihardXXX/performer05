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
3. Получение списка заказов на которые поданы заявки для Клиента +
4. Реализация списка лиц которые лайкали анкету клиента или мастера +
5. Реализация поля черный список у Пользователей +
6. Добавление в черный список +
7. Удаление пользователя из чёрного списка +
8. Получение списка всех клиентов необходимо чтобы делать поиск по автору заказа
9. Реализация Отзывов по клиентам и мастерам +
10. Реализация Рейтинга у клиентов и мастеров +
11. Реализация Подписок на Клиентов и мастеров
12. Реализация Просмотра заказов на которые подана заявка(Мастер)
13. Реализация Просмотра моих опубликованных заказов(Клиент)

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
- Получение заказов своих (я клиент) на которые подали заявки мастера
```js
method: get
path: http://localhost:3000/orders/submitted/applications
id это айди анкеты которую будем лайкать
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "orders": [
      {
        "id": 1,
        "slug": "pochinit-1-b0215e1f",
        "title": "починить 1",
        "description": "description котёл",
        "body": "котёл",
        "price": "price",
        "address": "address",
        "category": [
          "angular",
          "react"
        ],
        "dueDate": "dueDate",
        "dueTime": "dueTime",
        "listOfPerformers": [
          "2"
        ],
        "selectedPerformer": false,
        "status": "свободен",
        "victory": "",
        "favoritesCount": 0,
        "createdAt": "2022-01-27T17:21:52.484Z",
        "user": {
          "id": 1,
          "username": "test@test.ru",
          "email": "test@test.ru",
          "role": "customer",
          "bio": "",
          "listIdLikes": [],
          "countLikes": 0
        }
      }
  ],
  "ordersCount": 1
}
```

- Получение списка лиц кто лайкал анкету по текущему айди
```js
method: get
path: http://localhost:3000/users/who/likes/account/:id
id это айди анкеты которую мы будем проверять на лайки кто её лайкал
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "whoLikesAccounts": [
      {
        "id": 3,
        "username": "performer3",
        "email": "performer3@performer.ru",
        "role": "performer",
        "bio": "",
        "listIdLikes": [],
        "countLikes": 0
      },
      {
        "id": 1,
        "username": "test@test.ru",
        "email": "test@test.ru",
        "role": "customer",
        "bio": "",
        "listIdLikes": [],
        "countLikes": 0
      }
  ]
}
```

- Добавление пользователя в черный список
```js
method: patch
path: http://localhost:3000/users/black/list/account/:id
id это айди анкеты которую мы будем блокировать
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "id": 1,
  "username": "test@test.ru",
  "email": "test@test.ru",
  "role": "customer",
  "bio": "",
  "blackList": [
      "[]",
      "4"
    ],
  "listIdLikes": [],
  "countLikes": 0
}
```

- Удаление пользователя из черного списка
```js
method: delete 
path: http://localhost:3000/users/black/list/account/:id
id это айди анкеты которую мы будем блокировать
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "id": 1,
  "username": "test@test.ru",
  "email": "test@test.ru",
  "role": "customer",
  "bio": "",
  "blackList": [
      "[]"
    ],
  "listIdLikes": [],
  "countLikes": 0
}
```

- Получение аккаунта и информации по ней по айди
```js
method: get 
path: http://localhost:3000/users/:id
id аккаунта юзера
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "user": {
    "id": 6,
    "username": "новый клиент",
    "role": "performer",
    "bio": "",
    "blackList": [],
    "listIdLikes": [],
    "countLikes": 0
}
}
```

- Создание отзыва для аккаунта
```js
method: post
path: http://localhost:3000/reviews
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "review":{
      "author": "test@test.ru",
        // автор отзыва
        "idAuthor": 1,
        "text": "Еще один отзыв",
        // на кого оставляем отзыв
        "idAccount": 2
    }
}
```

- Получение списка отзывов по конкруетной анкете
```js
method: get
path: http://localhost:3000/rewies/:id
```
```js
пагинация ?limit=10&offset=0
```

- Получение списка мастеров или клиентов
```js
method: get
path: http://localhost:3000/users/role/:role
role должно быть performer || customer
пагинация ?limit=10&offset=0
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "users": [
      {
        "id": 6,
        "username": "новый клиент",
        "email": "yandex@yandex.ru",
        "role": "performer",
        "bio": "",
        "blackList": [],
        "listIdLikes": [],
        "countLikes": 0
      },
      {
        "id": 4,
        "username": "performer4",
        "email": "performer4@performer.ru",
        "role": "performer",
        "bio": "",
        "blackList": [],
        "listIdLikes": [],
        "countLikes": 0
      },
    ],
  "usersCount": 4
}
```

- Получение списка заказов для клиента, то заказы созданные мною
```js
method: get
path: http://localhost:3000/orders/my/all/customer
пагинация ?limit=10&offset=0
```
```js
Header Authorization 
token tdtdskdjfkf47564756
{
  "orders": [
      {
        "id": 48,
        "slug": "test1@test.ru-4bc96226",
        "title": "test1@test.ru",
        "description": "test1@test.ru",
        "body": "test1@test.ru",
        "price": "2333333",
        "address": "test1@test.ru",
        "category": [
          "Демонтажные работы",
          "Строительные работы"
        ],
        "dueDate": "2022/02/04",
        "dueTime": "13:05",
        "listOfPerformers": [],
        "selectedPerformer": false,
        "status": "свободен",
        "victory": "",
        "favoritesCount": 0,
        "createdAt": "2022-02-15T15:51:37.263Z",
        "user": {
          "id": 5,
          "username": "Роман11",
          "email": "test1@test.ru",
          "role": "customer",
          "bio": "Добрый клиент",
          "blackList": [],
          "listIdLikes": [],
          "countLikes": 0
        }
      }
    ],
  "ordersCount": 1
}
```

