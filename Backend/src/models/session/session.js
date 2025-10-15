const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const Classroom = require('../class/classroom')
const SubjectInSemester = require('../subject/subjectInSemester')
const TeacherInClass = require('../teacher/teacherInClass')
const Day = require('./day')


class Session extends Model {

    static async checkSessions(sessions, startYear, endYear) {
        const promises = [], errors = []
        for (const session of sessions) {
            promises.push(TeacherInClass.findByPk(session.teacherInClassId, {
                    include: {
                        association: 'teacherInYear', attributes: ['id'], include: {
                            association: 'teacherInSchool', attributes: ['id'], include: {
                                association: 'teacher', attributes: ['id']
                            }
                        }
                    }
                }).then(async teacherInClass => {
                    const subject = await SubjectInSemester.findByPk(session.subjectInSemesterId, {attributes: ['semester']})
                    const day = await Day.findByPk(session.dayId)
                    const {startTime, endTime} = session;
                    if (!Session.timeValidation(startTime, endTime)
                        || !await Day.checkTeacherAvailabilityInTime(teacherInClass.teacherInYear.teacherInSchool.teacher.id,
                            startYear, endYear, subject.semester, startTime, endTime, day.name))
                        errors.push({day: day.name, startTime, endTime})
                }
                )
            )
        }
        await Promise.all(promises)
        return errors
    }

    static timeValidation(startTime, endTime) {
        const date = new Date()
        const start = Day.getDate(startTime, date)
        const end = Day.getDate(endTime, date)
        return start <= end
    }
}

Session.init({
    startTime: {type: DataTypes.STRING, allowNull: false},
    endTime: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'session', timestamps: false})


Session.belongsTo(Classroom, {foreignKey: {allowNull: false}})
Classroom.hasMany(Session)

Session.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(Session)

Session.belongsTo(TeacherInClass, {foreignKey: {allowNull: false}})
TeacherInClass.hasMany(Session)

Session.belongsTo(Day, {foreignKey: {allowNull: false}})
Day.hasMany(Session)


module.exports = Session