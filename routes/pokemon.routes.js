const express = require('express');
const router = express.Router();

router.get("/all", (req, res, next) => {
    res.render("pokemon/all");
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