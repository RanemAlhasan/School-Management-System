const Classroom = require('../models/class/classroom')

module.exports = async (req, res, next) => {
    try {
        const classroom = await Classroom.findOne({
            attributes: ['id'], where: {
                classroomNumber: req.params.classroomNumber, schoolClassId: req.schoolClass[0].id
            }, required: true, include:{
                association: 'schoolClass', where:{startYear: req.params.startYear, endYear: req.params.endYear}
            }
        })
        if (!classroom) return res.status(400).send('Classroom doesnt belong to this class')

        req.classroom = classroom
        next()
    } catch (e) {
        res.status(400).send('This school doesn\'t have the required classroom.')
    }
}