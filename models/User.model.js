const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cash: {
      type: Number,
      default: 100
    },
    pokemons: {
      type: Schema.Types.ObjectId,
      ref: "Pokemon",
    },
  }
);

const User = model("User", userSchema);

module.exports = User;
