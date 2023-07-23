const express = require('express');
const router = express.Router();

const axios = require("axios");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const admin = require("../middleware/admin");

const User = require("../models/User.model");
const Pokemon = require("../models/pokemon.model");



router.get("/all", isLoggedIn, (req, res, next) => {

    axios
        .get(`https://pokeapi.co/api/v2/pokemon?limit=1281`)
        .then((pokemons) => {
            console.log("pokemons.data " + pokemons.data.results[0])
            res.render("pokemon/all", { pokemons: pokemons.data });
        })
        .catch((err) => next(err));

})

router.get("/all/:pokemon", isLoggedIn, (req, res, next) => {
    // console.log("req.query = " + req.query);

    axios
        .get(`https://pokeapi.co/api/v2/pokemon/${req.query.search}/`)
        .then((pokemon) => {
            res.render("pokemon/details", { pokemon: pokemon.data });
        })
        .catch((err) => next(err));
});



router.get("/create", isLoggedIn, (req, res, next) => {
    res.render("pokemon/create");
});

router.post("/pokemon/create", isLoggedIn, (req, res, next) => {
    const { name, abilities, types, imagen, price } = req.body;

    const newPokemon = new Pokemon({
        name: name,
        abilities: abilities.split(","),
        types: types.split(","),
        imagen: imagen,
        price: parseFloat(price),
        user: req.session.currentUser._id,
    });
    console.log("new pokemon = " + newPokemon)

    newPokemon.save()
        .then(() => {
            res.redirect("/auth/profile");
        })
        .catch((error) => {
            console.error('Erro ao criar o Pokémon:', error);
            res.render("pokemon/create", { errorMessage: "Erro ao criar o Pokémon." });
        });
});

router.get("/edit", isLoggedIn, (req, res, next) => {
    res.render("pokemon/edit");
});

router.get("/details", isLoggedIn, (req, res, next) => {
    res.render("pokemon/details");
});

module.exports = router;