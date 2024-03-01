// const connectDB = require("./config/db");
// const express = require("express");
// const cors = require("cors");
// const appRouter = require("./routes");
// const { mkdirSync } = require("fs");
// const { UPLOADS_DIR,IMAGE_DIR } = require("./config");

// connectDB()

// mkdirSync(UPLOADS_DIR, { recursive: true });

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use("/uploads", express.static(UPLOADS_DIR));
// app.use(express.static('public'));
// app.set('view engine', 'ejs');

// app.use("/api", appRouter);

// app.use('/',(req, res, next) => {
//     res.status(404).json({
//         error: 'Not Found',
//         message: 'Something went wrong!'
//     });
// });


// module.exports = app;

const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const appRouter = require("./routes");
const { mkdirSync } = require("fs");
const { UPLOADS_DIR, IMAGE_DIR } = require("./config");
const path = require('path')

connectDB();

mkdirSync(UPLOADS_DIR, { recursive: true });

const app = express();

// // Set up static middleware for serving images
// app.use("/uploads", express.static(path.join(__dirname, "assets/images")));
console.log("Script is running...");

console.log("UPLOADS_DIR:", UPLOADS_DIR);
console.log("IMAGE_DIR:", IMAGE_DIR);

// app.use(express.static(path.resolve('./assets/images')));
app.use(express.static(path.resolve('D:/paper ganration app final/assets/images')));
app.use(express.static('assets'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use("/api", appRouter);

app.use('/', (req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'Something went wrong!'
    });
});

module.exports = app;
