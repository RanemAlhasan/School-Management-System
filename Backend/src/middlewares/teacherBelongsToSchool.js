const School = require('../models/school/school')
const TeacherInYear = require('../models/teacher/teacherInYear')

module.exports = async (req, res, next) => {
    try {

        const school = await School.findOne({include: {association: 'account', where: {siteName: req.params.siteName}}})

        const teacherInYear = await TeacherInYear.getTeacherInYear(req.params.teacherId,
            school.id, req.params.startYear, req.params.endYear)

        if (!teacherInYear) throw new Error()
        req.teacherInYear = teacherInYear
        req.teacherInClassIds = teacherInYear.teacherInClasses.map(element => element.id)
        next()
    } catch (e) {
        res.status(401).send('Teacher doesn\'t belong to this school in this year.')
    }
}