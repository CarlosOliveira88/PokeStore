const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    user: String,
    comentario: String,
});


const review = model("review", reviewSchema);

module.exports = review;