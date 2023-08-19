const express = require('express');
const router = express.Router();

const axios = require("axios");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const admin = require("../middleware/admin");

const User = require("../models/User.model");
const Review = require("../models/Review.model");

router.get("/all", (req, res, next) => {
    res.render("review/all");
});

router.get("/create", (req, res, next) => {

    const { title, comment } = req.body;
    const userID = req.session.currentUser._id;
    let oldUserID = userID;

    const newReview = new Review({
        user: oldUserID,
        author: userID,
        title: title,
        content: comment,
    })

    newReview.save()
        .then((savedComment) => {
            return User.findByIdAndUpdate(
                oldUserID,
                { $push: { review: savedComment } },
                { new: true }
            );
        })
        .then((coment) => {
            // console.log("Comentario: ", coment);
            res.redirect("/auth/profile");
        })
        .catch((error) => {

            res.render("pokemon/create", { errorMessage: "Error al crear el Pokémon." });
        });


    res.render("review/create");
});
router.get("/edit", (req, res, next) => {
    res.render("review/edit");
});
router.get("/details", (req, res, next) => {
    res.render("review/details");
});

module.exports = router;