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
        type: String,
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
    }
});




const Pokemon = model("Pokemon", pokemonSchema);

module.exports = Pokemon;