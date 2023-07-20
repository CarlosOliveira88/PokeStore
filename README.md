
# PokéStore

PokéStore es una plataforma en línea que he desarrollado con el objetivo de crear un espacio donde los entrenadores de Pokémon (representando a empresas) puedan registrar y vender sus Pokémon, mientras que los clientes podrán explorar y comprar Pokémon para mejorar sus equipos.

![Project Image]( "image del proyecto" "Project Image")

## Deployment

You can access the fully deployed application [here](https://pokestore-backend.herokuapp.com/api/).

## About

¡Hola! Mi nombre es Carlos, soy un estudiante de desarrollo web en el campus de IronHack en Barcelona. Estoy emocionado de presentarte mi proyecto, el cual es una tienda en línea llamada "PokéStore".

La idea detrás de PokéStore surgió de mi pasión por el mundo Pokémon y mi interés en la creación de aplicaciones web. Quise combinar mis habilidades en diseño y desarrollo para crear una tienda virtual única y atractiva para los amantes de Pokémon.

## Work Structure

Este proyecto fue desarrollado individualmente, y utilicé [Trello](https://trello.com/home) para organizar mi flujo de trabajo.

## Installation Guide

- Hacer un fork de este repositorio.
- Clonar este repositorio

```shell
$ cd portfolio-back
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  admin: Boolean,
});
```
#### Pokemon.model.js
```js
const pokemonSchema = new Schema({
  name: { type: String, unique: true, required: true },
  type: String,
  level: Number,
  price: Number,
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer" },
  image: String,
});
```
#### Trainer.model.js
```js
const trainerSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  contact: String,
});
````
#### Order.model.js
```js
const orderSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  modComment: {
    type: String,
    default: "Pendiente",
  },
  status: {
    type: String,
    enum: ["Aprobado", "Pendiente", "Denegado"],
    default: "Pendiente",
  },
});
```
## User roles

| Rol       | Capacidades                                                                                                                          | Propiedad       |
| :-------: | ------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Usuario   | Puede iniciar sesión/cerrar sesión. Puede ver todos los Pokémon disponibles. Puede crear un nuevo pedido.                           | admin: false |
| Administrador  | Puede iniciar sesión/cerrar sesión. Puede ver, editar o eliminar todos los Pokémon. Puede crear un nuevo Pokémon. Puede ver todos los pedidos de usuarios y editar o eliminar los pedidos. | admin: true  |
| Entrenador | Puede iniciar sesión/cerrar sesión. Puede crear, ver, actualizar y eliminar sus Pokémon en venta. Puede ver todos los pedidos de usuarios y editar o eliminar los pedidos.           | admin: false |

## Routes

| Método | Endpoint                   | Cuerpo de la Petición                                  | Respuesta (200)                                                       | Acción                                                                |
| ------ | -------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| POST   | /signup                    | { username, email, password }                           | Devuelve la vista de registro de usuario.                              | Registra al usuario en la base de datos y redirige a la vista de inicio de sesión.    |
| POST   | /login                     | { email, password }                                     | Devuelve la vista de inicio de sesión exitoso.                         | Inicia sesión de un usuario ya registrado y redirige a la vista de inicio de sesión exitoso.                             |
| GET    | /pokemons                  | -                                                       | Devuelve la vista con todos los Pokémon disponibles en la tienda.       | Devuelve un array con todos los Pokémon disponibles en la tienda.         |
| GET    | /pokemons/:id              | { id }                                                  | Devuelve la vista con la información del Pokémon especificado.          | Devuelve la información del Pokémon especificado.                     |
| POST   | /pokemons                  | { name, type, level, price, trainer }                   | Devuelve la vista de registro exitoso de Pokémon por el entrenador.     | Registra un nuevo Pokémon en venta por el entrenador (requiere autenticación). |
| PUT    | /pokemons/:id              | { name, type, level, price }                            | Devuelve la vista de edición exitosa del Pokémon por su ID.             | Edita la información de un Pokémon existente por su ID (requiere autenticación). |
| DELETE | /pokemons/:id              | { id }                                                  | Devuelve la vista de eliminación exitosa del Pokémon por su ID.         | Elimina un Pokémon por su ID (requiere autenticación).                 |
| GET    | /trainers                  | -                                                       | Devuelve la vista con todos los entrenadores registrados en la tienda. | Devuelve un array con todos los entrenadores registrados en la tienda.       |
| GET    | /trainers/:id              | { id }                                                  | Devuelve la vista con la información del entrenador especificado.        | Devuelve la información del entrenador especificado.                      |
| POST   | /trainers                  | { name, description, contact }                          | Devuelve la vista de registro exitoso del entrenador.                   | Registra un nuevo entrenador para vender Pokémon (requiere autenticación). |
| PUT    | /trainers/:id              | { name, description, contact }                          | Devuelve la vista de edición exitosa del entrenador por su ID.           | Edita la información de un entrenador existente por su ID (requiere autenticación). |
| DELETE | /trainers/:id              | { id }                                                  | Devuelve la vista de eliminación exitosa del entrenador por su ID.       | Elimina un entrenador por su ID (requiere autenticación).                 |
| GET    | /profile                   | -                                                       | Devuelve la vista con el objeto del usuario actual.                      | Devuelve el objeto del usuario actual.                                      |
| POST   | /profile                   | { title, description, reference }                       | Devuelve la vista de creación exitosa de pedido.                         | Crea un pedido en la base de datos y actualiza el documento del usuario actual. |
| DELETE | /profile/:orderId          | { orderId }                                             | Devuelve la vista de eliminación exitosa del pedido.                     | Elimina un pedido de la base de datos.                                   |
| GET    | /orders                    | -                                                       | Devuelve la vista con todos los pedidos registrados en la base de datos. | Devuelve un array con todos los pedidos registrados en la base de datos.      |
| GET    | /orders/:id                | { id }                                                  | Devuelve la vista con la información del pedido especificado.            | Devuelve la información del pedido especificado.                        |
| PATCH  | /orders/:id                | { id }                                                  | Devuelve la vista de edición exitosa del pedido por su ID.                | Edita un pedido existente por su ID.                                    |



