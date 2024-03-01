const BaseService = require(".");
const SubjectModel = require('../models/subject')

class SubjectService extends BaseService {
    async addSubject(file) {

        // const isExist = await SubjectModel.findOne({name: this.reqBody.name})
        //
        // if (isExist) {
        //     throw new Error("Subject with that name already exist.");
        // }

        const dbSub = new SubjectModel({...this.reqBody, icon: file?.filename || ""})

        const subject = await dbSub.save();

        return subject;
    }

    async getAllSubjects() {
        const query = { deleted_at: null };
    
        const semester = parseInt(this.reqQuery.semester);
        const standard = parseInt(this.reqQuery.standard);
    
        if (!isNaN(semester) || !isNaN(standard)) {
            query.$and = [
                !isNaN(semester) ? { sem: semester } : null,
                !isNaN(standard) ? { std: standard } : null,
            ].filter(Boolean);
        }
    
        const subjects = await SubjectModel.find(query);
    
        const total = subjects.length;
    
        const data = {
            subjects,
            total,
        };
    
        return data;
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