const Joi = require("joi");
const handleException = require("../decorators/error");
const ChapterService = require("../services/chapter");
const chapterRouter = require("express").Router()
const ChapterModel = require("../models/chapter")

const CreateChapterRequest = Joi.object({
    name: Joi.string().required(),
    std: Joi.number().integer().min(1).max(12).required(),
    sem: Joi.number().required(),
    sub: Joi.string().required(),
    isLocked: Joi.boolean().required(),
});

chapterRouter.post("/", handleException(async (req, res) => {
    try {
        const reqBody = await CreateChapterRequest.validateAsync(req.body);
        const subServ = new ChapterService(reqBody, req.user, req.query);
        const data = await subServ.addChapter();

        res.json({
            data,
            status: 200,
            message: "Chapter created Successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

chapterRouter.get("/", handleException(async (req, res) => {
    try {
        const subServ = new ChapterService(req.body, req.user, req.query);
        const data = await subServ.getAllChapters();

        res.json({
            data,
            status: 200
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

chapterRouter.get("/:id", handleException(async (req, res) => {
    try {
        const chapterServ = new ChapterService(req.body, req.user, req.query);
        const chapterId = req.params.id
        const data = await chapterServ.getChapter(chapterId);

        res.json({
            data,
            status: 200
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

chapterRouter.put("/:id", handleException(async (req, res) => {
    try {
        const chapterId = req.params.id;
        const chapterServ = new ChapterService(req.body, req.user, req.query);
        const data = await chapterServ.updateChapter(chapterId);

        res.status(200).json({data, message: 'Chapter updated successfully.'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}));


chapterRouter.delete("/:id", handleException(async (req, res) => {
    try {
        const chapterId = req.params.id;

        const chapter = await ChapterModel.findByIdAndUpdate(chapterId, {deleted_at: new Date()}, {new: true});

        res.status(200).json({chapter, message: 'Chapter deleted successfully.'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}))


module.exports = chapterRouter;
