const BaseService = require(".");
const { uploadFile } = require("../helpers/avatar");
const SubjectModel = require('../models/subject')
class SubjectService extends BaseService {

    async addSubject(result) {
        const dbSub = new SubjectModel({...this.reqBody, icon: result});
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
        try {
            if (file && file.buffer) {
                const imageUrl = await uploadFile(file.buffer);
                
                return SubjectModel.findByIdAndUpdate(subjectId, {
                    ...this.reqBody,
                    icon: imageUrl,
                    updated_at: new Date()
                }, { new: true });
            } else {
                return SubjectModel.findByIdAndUpdate(subjectId, {
                    ...this.reqBody,
                    updated_at: new Date()
                }, { new: true });
            }
        } catch (error) {
            throw new Error("Error updating subject: " + error.message);
        }
    }

}

module.exports = SubjectService;