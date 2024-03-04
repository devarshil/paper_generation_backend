const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const appRouter = require("./routes");
const bodyParser = require('body-parser');
connectDB()
const app = express();
// app.use(cors());
const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
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
