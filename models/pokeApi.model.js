const { Schema, model } = require("mongoose");

const pokeApiSchema = new Schema({
    name: String,
    url: String,
});


const PokeApi = model("PokeApi", pokeApiSchema);

module.exports = PokeApi;