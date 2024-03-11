const BaseService = require(".");
const ChapterModel = require('../models/chapter')

class ChapterService extends BaseService {
    async addChapter() {

        // const isExist = await ChapterModel.findOne({name: this.reqBody.name, deleted_at: null})

        // if (isExist) {
        //     throw new Error("Chapter with that name already exist.");
        // }

        const dbChapter = new ChapterModel(this.reqBody)

        const chapter = await dbChapter.save();

        return chapter;
    }

    // async addChapter() {
    //     const isExist = await ChapterModel.findOne({
    //         std: this.reqBody.std,
    //         sub: this.reqBody.sub,
    //         name: this.reqBody.name,
    //         deleted_at: null
    //     });

    //     if (isExist) {

    //         const isSameSemester = isExist.sem === this.reqBody.sem;

    //         if (isSameSemester) {
    //             throw new Error("Chapter with the same name, subject, and standard already exists in the same semester.");
    //         }
    //     }

    //     const dbChapter = new ChapterModel(this.reqBody);
    //     const chapter = await dbChapter.save();
    //     return chapter;
    // }

    async getAllChapters() {

        let query = { deleted_at: null };
    
        const semester = parseInt(this.reqQuery.semester);
        const standard = parseInt(this.reqQuery.standard);
        const subject = this.reqQuery.subject;
    
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
    
        const chapters = await ChapterModel.find(query);
    
        const total = await ChapterModel.countDocuments(query);
    
        const data = {
            chapters,
            total,
        };
    
        return data;
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