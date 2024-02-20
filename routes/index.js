const commonRouter = require("../controllers/common");

const appRouter = require("express").Router();

appRouter.use('/api', commonRouter);

module.exports = appRouter;