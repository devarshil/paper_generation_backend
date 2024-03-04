const BaseService = require(".");
const { uploadFile } = require("../helpers/avatar");
const QuestionModel = require('../models/question')

class QuestionService extends BaseService {
    async addQuestion(result) {
    
        let dbQue;
    
        if (result) {
            dbQue = new QuestionModel({ ...this.reqBody, image_url: result });
        } else {
            dbQue = new QuestionModel(this.reqBody);
        }
    
        const question = await dbQue.save();
    
        return question;
    }
  
    async getAllQuestions() {

        const page = parseInt(this.reqQuery.page) || 1;
        const limit = parseInt(this.reqQuery.limit) || 10;
        const startIndex = (page - 1) * limit;

        let query = {deleted_at: null};

        const semester = parseInt(this.reqQuery.semester);
        const standard = parseInt(this.reqQuery.standard);
        const chapter = this.reqQuery.chapter;
        const subject = this.reqQuery.subject
        const type = this.reqQuery.type

        if (!isNaN(semester) || !isNaN(standard) || subject || chapter || type) {
            query = {
                deleted_at: null,
                $and: [
                    !isNaN(semester) ? { sem: semester } : null,
                    !isNaN(standard) ? { std: standard } : null,
                    subject ? { sub: subject } : null,
                    chapter ? { chapter: chapter } : null,
                    type ? { type: type } : null,
                ].filter(Boolean),
            };
        }

        const questions = await QuestionModel.find(query)
            .skip(startIndex)
            .limit(limit);

        const total = await QuestionModel.countDocuments(query);

        const data = {
            questions,
            total,
            currentPage: page,
            per_page: limit,
            totalPages: Math.ceil(total / limit),
        };

        return data
    }

    async getQuestion(questionId) {

        const question = await QuestionModel.findOne({
            _id: questionId,
            deleted_at: null
        });

        if (!question) {
            throw new Error("Question not found.");
        }

        return question
    }

    async updateQuestion(questionId, file) {

        if (file && file.buffer) {
            const imageUrl = await uploadFile(file.buffer);

            return QuestionModel.findByIdAndUpdate(questionId, {
                ...this.reqBody,
                image_url: imageUrl
            }, {new: true});
        } else {
            return QuestionModel.findByIdAndUpdate(questionId,
                this.reqBody
                , {new: true});
        }

    }
}

module.exports = QuestionService;