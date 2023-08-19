const express = require('express');
const router = express.Router();

const axios = require("axios");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const admin = require("../middleware/admin");

const User = require("../models/User.model");
const Pokemon = require("../models/Pokemon.model");



router.get("/pokedex", isLoggedIn, (req, res, next) => {

    axios
        .get(`https://pokeapi.co/api/v2/pokemon?limit=1281`)
        .then((pokemons) => {
            // console.log("pokemons.data " + pokemons.data.results[0])
            res.render("pokemon/pokedex", { pokemons: pokemons.data });
        })
        .catch((err) => next(err));

})

router.get("/pokedex/:pokemon", isLoggedIn, (req, res, next) => {
    // console.log("req.query = " + req.query);

    axios
        .get(`https://pokeapi.co/api/v2/pokemon/${req.query.search}/`)
        .then((pokemon) => {
            res.render("pokemon/pokedexDetails", { pokemon: pokemon.data });
        })
        .catch((err) => next(err));
});

router.get("/all/all/:pokemon", isLoggedIn, (req, res, next) => {
    let session = req.session.currentUser._id
    let autor = false;

    if (req.query.search == undefined) {

        Pokemon
            .findById({ _id: req.params.pokemon })
            .populate("user")
            .then((pokemon) => {


                if (pokemon.user._id == session) {
                    autor = true
                }

                console.log("session 1 ===== >>> " + session)
                console.log("pokemon.user._id y autor ===== >>> " + pokemon.user._id + " y " + autor)
                res.render("pokemon/pokemonDetails", { pokemon, autor });


            })
            .catch((err) => next(err));
    } else {
        Pokemon
            .find({ name: req.query.search })
            .then((pokemon) => {

                if (pokemon[0].user._id == session) {
                    autor = true
                }

                console.log("session 2 ===== >>> " + session)
                console.log("autor 4 ===== >>> " + autor)
                console.log("pokemon  search ========= " + pokemon[0])
                res.render("pokemon/pokemonDetails", { pokemon: pokemon[0], autor });
            })
            .catch((err) => next(err));
    }

    // console.log("req.query.search = " + req.query.search)

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


    newPokemon.save()
        .then((savedPokemon) => {
            return User.findByIdAndUpdate(
                userID,
                { $push: { pokemons: savedPokemon } },
                { new: true }
            );
        })
        .then((updatedUser) => {
            // console.log("Pokemon guardado y usuario actualizado:", updatedUser);
            res.redirect("/auth/profile");
        })
        .catch((error) => {
            // console.error('Error al crear el Pokémon:', error);
            res.render("pokemon/create", { errorMessage: "Error al crear el Pokémon." });
        });

});

router.get("/edit/:id", isLoggedIn, admin, (req, res, next) => {

    Pokemon.findById(req.params.id)
        .then((pokemon) => {
            // console.log("resp pokemon ========================" + pokemon);
            res.render("pokemon/edit", { pokemon });
        })
        .catch((error) => {
            // console.error('Error al editar el Pokémon:', error);
            res.render("pokemon/edit", { errorMessage: "Error al editar el Pokémon." });
        });
});

router.post("/edit/:id", isLoggedIn, admin, (req, res, next) => {
    let { name, abilities, types, imagen, price } = req.body;
    let { id } = req.params;

    const EditPokemon = { name, abilities, types, imagen, price };

    Pokemon.findOneAndUpdate({ _id: id }, EditPokemon, { new: true })
        .then((pokemonEdit) => {
            // console.log("pokemon editado ==================== " + pokemonEdit)
            res.redirect(`/pokemon//all/all/${id}`)
        })
        .catch((error) => {
            // console.error('Error al editar el Pokémon:', error);
            res.render("pokemon/edit", { errorMessage: "Error al editar el Pokémon." });
        });
});

router.get("/details", isLoggedIn, (req, res, next) => {
    res.render("pokemon/details");
});

router.get("/users/pokemons", isLoggedIn, (req, res, next) => {
    Pokemon.find()
        .then((arrayPokemon) => {

            const pokemons = arrayPokemon.map((pokemon) => {
                return {
                    _id: pokemon._id,
                    name: pokemon.name,
                    imagen: pokemon.imagen,
                    price: pokemon.price
                };
            });
            // console.log("poquemons array === " + pokemons[0].name)
            res.render("pokemon/userPokemon", { pokemons });
        })
        .catch((error) => {
            // console.error('Error al obtener la lista de Pokémon:', error);
            res.render("pokemon/userPokemon", { errorMessage: "Error al obtener la lista de Pokémon." });
        });


});

router.get("/buy/:pokemonId/:ownerId", isLoggedIn, (req, res, next) => {
    let idPropietario = req.params.ownerId;
    let idPokemon = req.params.pokemonId;
    let pokemon;

    let dinero;
    User.findById(req.session.currentUser)
        .then((user) => {
            dinero = user.cash
            // console.log("dinerooooooo ======>>>  " + dinero)
        })

    Pokemon.findById(idPokemon)
        .then((result) => {
            pokemon = result;
            console.log("pokemon =============>>>>  " + result)
            if (dinero < pokemon.price) {
                return res.send("No tienes suficiente dinero para esta compra")
            }
            return User.findById(idPropietario)
        }).then((userDueño) => {

            userDueño.cash = userDueño.cash + pokemon.price;
            userDueño.pokemons = userDueño.pokemons.filter((pokemon) => { return pokemon._id != idPokemon });
            return User.findByIdAndUpdate(idPropietario, { pokemons: userDueño.pokemons, cash: userDueño.cash }, { new: true })
        })
        .then((propietarioActualizado) => {
            // console.log("Propietario actualizado en BBDD: ", propietarioActualizado);
            return User.findById(req.session.currentUser._id)
        })
        .then((buyer) => {
            buyer.cash = buyer.cash - pokemon.price;

            buyer.pokemons.push(idPokemon);
            return User.findByIdAndUpdate(buyer._id, { pokemons: buyer.pokemons, cash: buyer.cash }, { new: true })
                .then((updatedBuyer) => {
                    req.session.currentUser.pokemons = updatedBuyer.pokemons;

                    res.redirect("/auth/profile")
                })
        })
        .then(() => {
            return Pokemon.findByIdAndUpdate(idPokemon, { user: req.session.currentUser }, { new: true })
        })
        .then((pokemon) => {
            console.log("user actualizado  " + pokemon);

        })
        .catch((error) => {
            console.error('Error al comprar el Pokémon:', error);
            // res.render("pokemon/edit", { errorMessage: "Error al editar el Pokémon." });
        });
});


router.get("/delete/:id", (req, res, next) => {
    const pokemonId = req.params.id;

    Pokemon.findByIdAndDelete(pokemonId)
        .then(() => {
            console.log("pokemon deletado con sucesso")
            res.redirect("/auth/profile")
        })
        .catch((error) => {
            console.error('Error al deletar el Pokémon:', error);

        });
})
module.exports = router;