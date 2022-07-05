const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UserModel } = require("../schemas/user");

function generateAccessToken(email) {
    return jwt.sign({ email }, process.env.TOKEN_SECRET, {
        // EXPIRE TIME
        expiresIn: "1800s",
    });
}

router.post("/signUp", (req, res) => {
    const query = UserModel.findOne({ email: req.body.email });
    query.exec((err, found) => {
        if (err) return HandleError(err);

        console.log(req.body);

        if (!found) {
            const user = new UserModel({
                ...req.body,
            });
            user.save().then((item) => {
                const token = generateAccessToken(req.body.email);

                res.json({
                    saved: true,
                    token: `Bearer ${token}`,
                });
                console.log("data saved in DB");
            });
        } else {
            res.json({ saved: false });
        }
    });
});

router.post("/signIn", (req, res) => {
    const query = UserModel.findOne({ email: req.body.email });
    query.exec((err, found) => {
        if (err) return HandleError(err);
        if (found && found.password === req.body.password) {
            const token = generateAccessToken(found.email);

            res.json({
                found: true,
                token: `Bearer ${token}`,
            });
        } else {
            res.json({ found: false });
        }
    });
});

module.exports = router;
