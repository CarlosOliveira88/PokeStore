const express = require('express');
const router = express.Router();
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const admin = require("../middleware/admin");


router.get("/edit/:id", isLoggedIn, (req, res, next) => {

    User.findById(req.params.id)
        .then((user) => {
            res.render("user/edit", user);
        })
        .catch((err) => next(err));
});

router.post('/edit/:id', isLoggedIn, (req, res, next) => {
    const userId = req.params.id;
    const { name, user, email, team } = req.body;

    User.findByIdAndUpdate(userId, { name, user, email, team })
        .then(() => {
            res.redirect('/auth/profile');
        })
        .catch((error) => {
            console.error('Error al actualizar el user:', error);
        });
});

router.get('/delete/:id', (req, res, next) => {
    const userId = req.params.id;

    User.findByIdAndDelete(userId)
        .then(() => {
            res.redirect("/auth/logout");
        })
        .catch((error) => {
            console.error('Error al eliminar el usuario:', error);
            res.redirect('/auth/profile');
        });
});

module.exports = router;