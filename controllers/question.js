const Joi = require("joi");
const handleException = require("../decorators/error");
const QuestionService = require("../services/question");
const {upload} = require("../helpers/avatar");
const questionRouter = require("express").Router()
const QuestionModel = require("../models/question")

const CreateQuestionRequest = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().required(),
    sub: Joi.string().required(),
    std: Joi.number().required(),
    sem: Joi.number().required(),
    chapter: Joi.string().required(),
    image_url: Joi.string().optional(),
    options: Joi.object().optional(),
    answer: Joi.string().optional(),
    isAnswered: Joi.boolean().required(),
    marks: Joi.number().required(),
});

questionRouter.post("/", upload.single("image_url"), handleException(async (req, res) => {
    try {
        const reqBody = await CreateQuestionRequest.validateAsync(req.body);
        const queServ = new QuestionService(reqBody, req.user, req.query);
        const file = req.file
        const data = await queServ.addQuestion(file);

        res.json({
            data,
            status: 200,
            message: "Question created Successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

questionRouter.get("/", handleException(async (req, res) => {
    try {
        const queServ = new QuestionService(req.body, req.user, req.query);
        const data = await queServ.getAllQuestions();

        res.json({
            data,
            status: 200
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

questionRouter.get("/:id", handleException(async (req, res) => {
    try {
        const queServ = new QuestionService(req.body, req.user, req.query);
        const questionId = req.params.id
        const data = await queServ.getQuestion(questionId);

        res.json({
            data,
            status: 200
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

questionRouter.put("/:id", upload.single("image_url"), handleException(async (req, res) => {
    try {
        const questionId = req.params.id;
        const queServ = new QuestionService(req.body, req.user, req.query);
        const file = req.file
        const data = await queServ.updateQuestion(questionId, file);

        res.status(200).json({data, message: 'Question updated successfully.'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}));

questionRouter.delete("/:id", handleException(async (req, res) => {
    try {
        const questionId = req.params.id;

        const question = await QuestionModel.findByIdAndUpdate(questionId, {deleted_at: new Date()}, {new: true});

        res.status(200).json({question, message: 'Question deleted successfully.'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}))


module.exports = questionRouter;
