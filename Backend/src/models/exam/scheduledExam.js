const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../db/sequelize')
const Classroom = require('../class/classroom')
const SubjectInSemester = require('../subject/subjectInSemester')
const Exam = require('./exam')
const ExamType = require('./examType')

class ScheduledExam extends Model {

    
}


ScheduledExam.init({
    date: { type: DataTypes.DATE, allowNull: false },
    startTime: { type: DataTypes.STRING, allowNull: false },
    endTime: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'scheduledExam', timestamps: false })



ScheduledExam.belongsTo(SubjectInSemester, { foreignKey: { allowNull: false } })
SubjectInSemester.hasMany(ScheduledExam)

ScheduledExam.belongsTo(ExamType, { foreignKey: { allowNull: false } })
ExamType.hasMany(SubjectInSemester)

ScheduledExam.belongsTo(Exam)
Exam.hasOne(ScheduledExam)

module.exports = ScheduledExam