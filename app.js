const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const signRouter = require("./routes/sign");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(signRouter);

mongoose
    .connect(
        process.env.NODE_ENV === "production"
            ? process.env.MONGODB_PROD_URL
            : process.env.MONGODB_DEV_URL
    )
    .then((result) => {
        console.log("Connected");

        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });
