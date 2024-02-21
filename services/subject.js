const BaseService = require(".");
const SubjectModel = require('../models/subject')

class SubjectService extends BaseService {
    async addSubject(file) {

        const isExist = await SubjectModel.findOne({name: this.reqBody.name})

        if (isExist) {
            throw new Error("Subject with that name already exist.");
        }

        const dbSub = new SubjectModel({...this.reqBody, icon: file.filename})

        const subject = await dbSub.save();

        return subject;
    }

    async getAllSubjects() {
        const page = parseInt(this.reqQuery.page) || 1;
        const limit = parseInt(this.reqQuery.limit) || 10;
        const startIndex = (page - 1) * limit;

        let query = { deleted_at: null };
        const semester = parseInt(this.reqQuery.semester);
        const standard = parseInt(this.reqQuery.standard);

        if (semester) {
            query = {
                deleted_at: null,
                $or: [
                    { sem: semester },
                ],
            };
        }
        if (standard) {
            query = {
                deleted_at: null,
                $or: [
                    { std: standard },
                ],
            };
        }

        const subjects = await SubjectModel.find(query)
            .skip(startIndex)
            .limit(limit);

        const total = await SubjectModel.countDocuments(query);

        const data = {
            subjects,
            total,
            currentPage: page,
            per_page: limit,
            totalPages: Math.ceil(total / limit),
        };

        return data
    }

    async getSubject(subjectId) {

        const subject = await SubjectModel.findOne({
            _id: subjectId,
            deleted_at: null
        });

        if (!subject) {
            throw new Error("Subject not found.");
        }

        return subject
    }

    async updateSubject(subjectId, file) {

        if (file && file.filename) {
            return SubjectModel.findByIdAndUpdate(subjectId, {
                ...this.reqBody,
                icon: file.filename
            }, {new: true});
        } else {
            return SubjectModel.findByIdAndUpdate(subjectId,
                this.reqBody
                , {new: true});
        }
    }

    async uploadSubjectIcon(subjectId, file) {

        const icon = await SubjectModel.findByIdAndUpdate(subjectId, { icon: file.filename }, { new: true });

        return icon
    }
}

module.exports = SubjectService;