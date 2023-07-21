const express = require('express');
const router = express.Router();


router.get("/edit", (req, res, next) => {
    res.render("user/edit");
});

router.get("/profile", (req, res, next) => {
    res.render("user/profile");
});

module.exports = router;