const Joi = require("joi");
const handleException = require("../decorators/error");
const SubjectService = require("../services/subject");
const {upload} = require("../helpers/avatar");
const subjectRouter = require("express").Router()
const SubjectModel = require("../models/subject")

const CreateSubjectRequest = Joi.object({
    name: Joi.string().required(),
    std: Joi.number().required(),
    sem: Joi.number().required(),
    icon: Joi.string().optional(),
});

subjectRouter.post("/", upload.single("icon"), handleException(async (req, res) => {
    try {
        const reqBody = await CreateSubjectRequest.validateAsync(req.body);
        const subServ = new SubjectService(reqBody, req.user, req.query);
        const file = req.file
        const data = await subServ.addSubject(file);

        res.json({
            data,
            status: 200,
            message: "Subject created Successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

subjectRouter.get("/", handleException(async (req, res) => {
    try {
        const subServ = new SubjectService(req.body, req.user, req.query);
        const data = await subServ.getAllSubjects();

        res.json({
            data,
            status: 200
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

subjectRouter.get("/:id", handleException(async (req, res) => {
    try {
        const subServ = new SubjectService(req.body, req.user, req.query);
        const subjectId = req.params.id
        const data = await subServ.getSubject(subjectId);

        res.json({
            data,
            status: 200
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}));

subjectRouter.put("/:id", upload.single("icon"), handleException(async (req, res) => {
    try {
        const subjectId = req.params.id;
        const subServ = new SubjectService(req.body, req.user, req.query);
        const file = req.file
        const data = await subServ.updateSubject(subjectId, file);

        res.status(200).json({data, message: 'Subject updated successfully.'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}));

subjectRouter.put(
    "/:id/subject-icon",
    upload.single("image_url"),
    handleException(async (req, res) => {
        const subjectId = req.params.id;
        const file = req.file;
        const subServ = new SubjectService(req.body, req.user, req.query)
        const icon = subServ.uploadSubjectIcon(subjectId, file)

        res.json({
            data: {
                icon,
                message: "Subject icon uploaded successfully",
            },
        });
    })
);

subjectRouter.delete("/:id", handleException(async (req, res) => {
    try {
        const subjectId = req.params.id;

        const subject = await SubjectModel.findByIdAndUpdate(subjectId, {deleted_at: new Date()}, {new: true});

        res.status(200).json({subject, message: 'Subject deleted successfully.'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}))


module.exports = subjectRouter;
