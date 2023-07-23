const { Schema, model } = require("mongoose");

const pokemonSchema = new Schema({
    name: String,
    abilities: [String],
    types: [String],
    imagen: String,
    price: {
        type: Number,
        default: 10,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});




const Pokemon = model("pokemon", pokemonSchema);

module.exports = Pokemon;