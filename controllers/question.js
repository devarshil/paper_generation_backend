const Joi = require("joi");
const multer = require("multer");
const handleException = require("../decorators/error");
const QuestionService = require("../services/question");
// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const questionRouter = require("express").Router()
const QuestionModel = require("../models/question");
const { uploadFile } = require("../helpers/avatar");


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

        if (req.file && req.file.buffer) {
            try {
                const result = await uploadFile(req.file.buffer);
                const data = await queServ.addQuestion(result);

                res.json({
                    data,
                    status: 200,
                    message: "Subject created Successfully."
                });
            } catch (uploadError) {
                if (uploadError.message === "File size exceeds the maximum allowed limit.") {
                    return res.status(400).json({ error: "File size exceeds the maximum allowed limit." });
                }
                throw uploadError;
            }
        } else {
            const data = await queServ.addQuestion(); 
            res.json({
                data,
                status: 200,
                message: "Subject created Successfully."
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
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
        res.status(500).json({ error: "Internal Server Error" });
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
        res.status(500).json({ error: "Internal Server Error" });
    }
}));

questionRouter.put("/:id", upload.single("image_url"), handleException(async (req, res) => {
    try {
        const questionId = req.params.id;
        const queServ = new QuestionService(req.body, req.user, req.query);
        const file = req.file
        const data = await queServ.updateQuestion(questionId, file);

        res.status(200).json({ data, message: 'Question updated successfully.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

questionRouter.delete("/:id", handleException(async (req, res) => {
    try {
        const questionId = req.params.id;

        const question = await QuestionModel.findByIdAndUpdate(questionId, { deleted_at: new Date() }, { new: true });

        res.status(200).json({ question, message: 'Question deleted successfully.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}))


module.exports = questionRouter;
