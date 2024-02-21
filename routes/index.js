const commonRouter = require("../controllers/common");
const subjectRouter = require("../controllers/subjects");
const chapterRouter = require("../controllers/chapter");
const questionRouter = require("../controllers/question");

const appRouter = require("express").Router();

appRouter.use('/', commonRouter);
appRouter.use('/subject', subjectRouter);
appRouter.use('/chapter', chapterRouter);
appRouter.use('/question', questionRouter);

module.exports = appRouter;