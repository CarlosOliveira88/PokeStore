const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");
const Pokemon = require("../models/Pokemon.model");


const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const admin = require("../middleware/admin");



// //registro
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  let { username, password, passwordRepeat } = req.body;

  if (username == "" || password == "" || passwordRepeat == "") {
    res.render("auth/signup", {
      errorMessage: "Por favor rellene todos los campos.",
    });
    return;
  }

  if (password != passwordRepeat) {
    res.render("auth/signup", {
      errorMessage: "Las contraseñas NO coinciden.",
    });
    return;
  }

  User.find({ username })
    .then((result) => {
      if (result.length != 0) {
        console.log("RESULT.LENGTH =! 0");
        res.render("auth/signup", {
          errorMessage:
            "El usuario ya existe, por favor elija otro.",
        });
        return;
      }

      let salt = bcrypt.genSaltSync(saltRounds);
      let passwordEncriptada = bcrypt.hashSync(password, salt);

      User.create({
        username,
        name: username,
        email: username + "@gmail.com",
        team: "azul",
        password: passwordEncriptada
      })
        .then(() => {
          res.redirect("/auth/login");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// Login 
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  let { username, password } = req.body;

  if (username == "" || password == "") {
    res.render("auth/login", { errorMessage: "Faltan campos por rellenar." });
  }


  User.find({ username })
    .then((result) => {

      if (result.length == 0) { // hay un error aqui 
        res.render("auth/login", {
          errorMessage: "El usuario no existe, por favor regístrate.",
        });
      }

      if (bcrypt.compareSync(password, result[0].password)) {
        let usuario = {
          _id: result[0]._id,
          username: result[0].username,
          admin: result[0].admin,
        };
        console.log('usuario: ' + JSON.stringify(usuario));

        req.session.currentUser = usuario;
        res.redirect("/auth/profile");

      } else {
        res.render("auth/login", {
          errorMessage: "Credenciales incorrectas.",

        });
      }
    })
    .catch((err) => next(err));
});

// Perfil
// router.get("/profile", isLoggedIn, (req, res, next) => {

//   User.find({ username: req.session.currentUser.username })
//     .then((user) => {
//       console.log("user joao = " + user[0].pokemons)
//       res.render("auth/profile", user[0]);
//     })
//     .catch((err) => next(err));

// });

// logout

router.get("/profile", isLoggedIn, (req, res, next) => {
  User.find({ username: req.session.currentUser.username })
    .then(async (user) => {
      console.log("user joao = " + user[0])
      let pokemonIds = user[0].pokemons;
      // Uso Promise.all para buscar cada Pokémon por su ID
      const pokemonPromises = pokemonIds.map(pokemonId => Pokemon.findById(pokemonId));
      // Espero a que todas las búsquedas de Pokémon sean completadas
      const foundPokemons = await Promise.all(pokemonPromises);
      // Ahora, foundPokemons contendrá un array con todos los Pokémon encontrados
      // Mapeamos los nombres de los Pokémon encontrados
      const pokemonNames = foundPokemons.map(pokemon => pokemon.name);
      // Renderizamos la vista con los datos del usuario y los nombres de los Pokémon
      res.render("auth/profile", { user: user[0], pokemonNames });
    })
    .catch((err) => next(err));
});


router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/auth/login");
    }
  });
});

//  administrador
router.get("/admin", isLoggedIn, (req, res, next) => {
  res.send("eres admin");
});

// No administrador
router.get("/no-admin", isLoggedIn, (req, res, next) => {
  res.send("no eres admin");
});



module.exports = router;

