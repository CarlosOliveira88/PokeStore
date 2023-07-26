const express = require('express');
const router = express.Router();

const axios = require("axios");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const admin = require("../middleware/admin");

const User = require("../models/User.model");
const Pokemon = require("../models/Pokemon.model");



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
    console.log("req.query = " + req.query);

    axios
        .get(`https://pokeapi.co/api/v2/pokemon/${req.query.search}/`)
        .then((pokemon) => {
            res.render("pokemon/details", { pokemon: pokemon.data });
        })
        .catch((err) => next(err));
});

router.get("/all/all/:pokemon", isLoggedIn, (req, res, next) => {


    if (req.query.search == undefined) {

        Pokemon
            .findById({ _id: req.params.pokemon })
            .then((pokemon) => {
                console.log("pokemon.namePokemoID = " + pokemon)
                res.render("pokemon/pokemonDetails", { pokemon });
            })
            .catch((err) => next(err));
    } else {
        Pokemon
            .find({ name: req.query.search })
            .then((pokemon) => {
                console.log("pokemon.name = " + pokemon[0])
                res.render("pokemon/pokemonDetails", { pokemon: pokemon[0] });
            })
            .catch((err) => next(err));
    }

    console.log("req.query.search = " + req.query.search)

});


router.get("/create", isLoggedIn, (req, res, next) => {
    res.render("pokemon/create");
});

router.post("/create", isLoggedIn, (req, res, next) => {
    const { name, abilities, types, imagen, price } = req.body;
    const userID = req.session.currentUser._id

    const newPokemon = new Pokemon({
        name: name,
        abilities: abilities.split(","),
        types: types.split(","),
        imagen: imagen,
        price: parseFloat(price),
        user: userID,
    });
    console.log("new pokemon = " + newPokemon)

    // newPokemon.save()
    //     .then((savedPokemon) => {
    //         console.log("savedPokemon = " + savedPokemon)
    //         return User.findByIdAndUpdate(userID, { $push: { pokemons: { _id: savedPokemon._id, name: savedPokemon.name } } }, { new: true });
    //     })
    //     .then((updatedUser) => {

    //         console.log("Pokemon guardado y usuario actualizado:", updatedUser);
    //     })
    //     .then(() => {
    //         res.redirect("/auth/profile");
    //     })
    //     .catch((error) => {
    //         console.error('Erro ao criar o Pokémon:', error);
    //         res.render("pokemon/create", { errorMessage: "Erro ao criar o Pokémon." });
    //     });

    newPokemon.save()
        .then((savedPokemon) => {
            return User.findByIdAndUpdate(
                userID,
                { $push: { pokemons: savedPokemon } },
                { new: true }
            );
        })
        .then((updatedUser) => {
            console.log("Pokemon guardado y usuario actualizado:", updatedUser);
            res.redirect("/auth/profile");
        })
        .catch((error) => {
            console.error('Error al crear el Pokémon:', error);
            res.render("pokemon/create", { errorMessage: "Error al crear el Pokémon." });
        });

});

router.get("/edit/:id", isLoggedIn, (req, res, next) => {

    Pokemon.findById(req.params.id)
        .then((pokemon) => {
            console.log("resp pokemon ========================" + pokemon);
            res.render("pokemon/edit", { pokemon });
        })
        .catch((error) => {
            console.error('Error al editar el Pokémon:', error);
            res.render("pokemon/edit", { errorMessage: "Error al editar el Pokémon." });
        });
});

router.post("/edit/:id", isLoggedIn, (req, res, next) => {
    let { name, abilities, types, imagen, price } = req.body;
    let { id } = req.params;

    const EditPokemon = { name, abilities, types, imagen, price };

    Pokemon.findOneAndUpdate({ _id: id }, EditPokemon, { new: true })
        .then((pokemonEdit) => {
            console.log("pokemon editado ==================== " + pokemonEdit)
            res.redirect(`/pokemon//all/all/${id}`)
        })
        .catch((error) => {
            console.error('Error al editar el Pokémon:', error);
            res.render("pokemon/edit", { errorMessage: "Error al editar el Pokémon." });
        });
});

router.get("/details", isLoggedIn, (req, res, next) => {
    res.render("pokemon/details");
});

module.exports = router;