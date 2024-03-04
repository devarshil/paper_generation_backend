const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const appRouter = require("./routes");
const { mkdirSync } = require("fs");
const { UPLOADS_DIR,IMAGE_DIR } = require("./config");
const bodyParser = require('body-parser');
connectDB()

mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use("/api", appRouter);

app.use('/',(req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'Something went wrong!'
    });
});


module.exports = app;
