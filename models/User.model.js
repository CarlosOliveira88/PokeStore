const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,

    },
    password: {
      type: String,
      required: true,
    },
    cash: {
      type: Number,
      default: 100
    },
    pokemons: [{
      type: Schema.Types.ObjectId,
      ref: "Pokemon",
    }],
    review: [{
      type: Schema.Types.ObjectId,
      ref: "Review",
    }],
    team: String,
    admin: Boolean,
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
