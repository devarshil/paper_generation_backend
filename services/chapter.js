
const BaseService = require(".");
const ChapterModel = require('../models/chapter')

class ChapterService extends BaseService {
    async addChapter() {

        const isExist = await ChapterModel.findOne({name: this.reqBody.name, deleted_at: null})

        if (isExist) {
            throw new Error("Chapter with that name already exist.");
        }

        const dbChapter = new ChapterModel(this.reqBody)

        const chapter = await dbChapter.save();

        return chapter;
    }

    async getAllChapters() {

        const page = parseInt(this.reqQuery.page) || 1;
        const limit = parseInt(this.reqQuery.limit) || 10;
        const startIndex = (page - 1) * limit;

        let query = { deleted_at: null };

        const semester = parseInt(this.reqQuery.semester);
        const standard = parseInt(this.reqQuery.standard);
        const subject = this.reqQuery.subject

        if (!isNaN(semester) || !isNaN(standard) || subject) {
            query = {
                deleted_at: null,
                $and: [
                    !isNaN(semester) ? { sem: semester } : null,
                    !isNaN(standard) ? { std: standard } : null,
                    subject ? { sub: subject } : null,
                ].filter(Boolean),
            };
        }

        const chapters = await ChapterModel.find(query)
            .skip(startIndex)
            .limit(limit);

        const total = await ChapterModel.countDocuments(query);

        const data = {
            chapters,
            total,
            currentPage: page,
            per_page: limit,
            totalPages: Math.ceil(total / limit),
        };

        return data
    }

    async getChapter(chapterId) {

        const chapter = await ChapterModel.findOne({
            _id: chapterId,
            deleted_at: null
        });

        if (!chapter) {
            throw new Error("Chapter not found.");
        }

        return chapter
    }

    async updateChapter(chapterId) {

        const chapter = await ChapterModel.findByIdAndUpdate(chapterId, this.reqBody, { new: true });

        if (!chapter) {
            throw new Error('Chapter not found');
        }

        return chapter
    }
}

module.exports = ChapterService;