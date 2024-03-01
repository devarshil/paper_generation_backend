// const path = require('path')
// const multer = require('multer')
// const uuid = require("uuid");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'assets/images/');
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = path.extname(file.originalname);
//         const fileName = uuid.v4() + fileExtension;
//         cb(null, fileName);
//     },
// });

// const upload = multer({storage});

// module.exports = {upload}
//------------------------------------------------
// const path = require('path')
// const multer = require('multer')
// const uuid = require("uuid");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '..', 'assets', 'images')); 
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = path.extname(file.originalname);
//         const fileName = uuid.v4() + fileExtension;
//         cb(null, fileName);
//     },
// });

// const upload = multer({ storage });

// module.exports = {upload};
//--------------------------------------------------

// helpers/avatar.js

const path = require('path')
const multer = require('multer')
const uuid = require("uuid");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/images/')); // Update the destination path
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = uuid.v4() + fileExtension;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

module.exports = { upload };

