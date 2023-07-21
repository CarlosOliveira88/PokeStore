const express = require('express');
const router = express.Router();

router.get("/all", (req, res, next) => {
    res.render("review/all");
});
router.get("/create", (req, res, next) => {
    res.render("review/create");
});
router.get("/edit", (req, res, next) => {
    res.render("review/edit");
});
router.get("/details", (req, res, next) => {
    res.render("review/details");
});

module.exports = router;