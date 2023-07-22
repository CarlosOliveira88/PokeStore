const express = require('express');
const router = express.Router();

const axios = require("axios");


router.get("/all", (req, res, next) => {

    axios
        .get(`https://pokeapi.co/api/v2/pokemon/`)
        .then((pokemons) => {
            console.log("pokemons.data " + pokemons.data.results[0])
            res.render("pokemon/all", { pokemons: pokemons.data });
        })
        .catch((err) => next(err));

})

router.get("/all/:pokemon", (req, res, next) => {
    // console.log("req.query = " + req.query);

    axios
        .get(`https://pokeapi.co/api/v2/pokemon/${req.query.search}/`)
        .then((pokemon) => {
            res.render("pokemon/details", { pokemon: pokemon.data });
        })
        .catch((err) => next(err));
});



router.get("/create", (req, res, next) => {
    res.render("pokemon/create");
});
router.get("/edit", (req, res, next) => {
    res.render("pokemon/edit");
});
router.get("/details", (req, res, next) => {
    res.render("pokemon/details");

});

module.exports = router;