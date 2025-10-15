const {DataTypes, Model, Op} = require('sequelize')
const sequelize = require('../../db/sequelize')


class Day extends Model {

    static getDate(time, date) {
        const dateWithTime = new Date(date.getTime())
        dateWithTime.setHours(time.split(':')[0])
        dateWithTime.setMinutes(time.split(':')[1])
        return dateWithTime
    }

    static async getScheduleForClassroomInSemester(classroomId, semester) {
        const schedule = await Day.findAll({
            attributes: ['name'], include: {
                association: 'sessions', attributes: ['startTime', 'endTime']
                , where: {classroomId: {[Op.and]: [{[Op.eq]: classroomId}, {[Op.not]: null}]}},
                include: [{
                    association: 'subjectInSemester', where: {semester},
                    attributes: ['id'], include: {association: 'subjectInYear', attributes: ['name']}
                }, {
                    association: 'teacherInClass', attributes: ['id'], include: {
                        association: 'teacherInYear', attributes: ['id'], include: {
                            association: 'teacherInSchool', attributes: ['id'], include: {
                                association: 'teacher', attributes: ['id'],
                                include: {association: 'personalInfo', attributes: ['firstName', 'lastName']}
                            }
                        }
                    }
                }]
            }
        })
        for (const day of schedule)
            for (const session of day.sessions) {
                session.dataValues.subjectName = session.subjectInSemester.subjectInYear.name
                delete session.dataValues.subjectInSemester
                session.dataValues.teacher = session.teacherInClass.teacherInYear.teacherInSchool.teacher
                delete session.dataValues.teacherInClass
            }
        return schedule
    }


    static async getScheduleForTeacher(teacherId, startYear, endYear, semester) {
        const schedule = await Day.findAll({
            attributes: ['name'], include: {
                association: 'sessions', attributes: ['startTime', 'endTime'],
                include: [{
                    association: 'subjectInSemester', where: {semester},
                    attributes: ['id'], include: {association: 'subjectInYear', attributes: ['name']}
                }, {
                    association: 'teacherInClass', attributes: ['id'], required: true, include: [{
                        association: 'teacherInYear', attributes: ['id'], required: true, include: {
                            association: 'teacherInSchool', attributes: ['id'], where: {teacherId},
                            include: {association: 'school', attributes: ['id', 'schoolName'],}
                        }
                    }]
                }, {
                    association: 'classroom', attributes: ['classroomNumber'], required: true,
                    include: {
                        association: 'schoolClass', attributes: ['id'], where: {startYear, endYear},
                        include: {association: 'class', attributes: ['name']}
                    }
                }]
            }
        })
        for (const day of schedule)
            for (const session of day.sessions) {
                session.dataValues.subjectName = session.subjectInSemester.subjectInYear.name
                delete session.dataValues.subjectInSemester
                session.dataValues.school = session.teacherInClass.teacherInYear.teacherInSchool.school
                delete session.dataValues.teacherInClass
                session.classroom.dataValues.className = session.classroom.schoolClass.class.name
                delete session.classroom.dataValues.schoolClass
            }
        return schedule
    }

    static async checkTeacherAvailabilityInTime(teacherId, startYear, endYear, semester, startTime, endTime, dayName) {
        const schedule = await Day.getScheduleForTeacher(teacherId, startYear, endYear, semester)
        for (const day of schedule) {
            if (day.name !== dayName) continue
            for (const session of day.sessions) {
                const currentDate = new Date()

                if (!(Day.getDate(startTime, currentDate) >= Day.getDate(session.endTime, currentDate)
                    || ((Day.getDate(endTime, currentDate) <= Day.getDate(session.startTime, currentDate)))))
                    return false
            }
        }
        return true
    }
}


Day.init({
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'day', timestamps: false})

Day.defaultDays = [
    {name: "Saturday"}, {name: "Sunday"}, {name: "Monday"}, {name: "Tuesday"},
    {name: "Wednesday"}, {name: "Thursday"}, {name: "Friday"}
]

module.exports = Day