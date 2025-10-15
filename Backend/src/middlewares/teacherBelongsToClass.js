const TeacherInClass = require('../models/teacher/teacherInClass')

module.exports = async (req, res, next) => {
    try{
        const className = req.params.className.replace('_', ' ')
        const teacherInClass = await TeacherInClass.findAll({
            attributes: ['id', 'schoolClassId'],
            required: true, include: {
                association: 'schoolClass',where:{startYear: req.params.startYear, endYear: req.params.endYear} 
                ,attributes: ['classId'], required: true, include: {
                    association: 'class', where: {name: className}
                }
            }
        })
        if (!teacherInClass.length) throw new Error()
        req.teacherInClass = teacherInClass
        next()
        
    }catch (e) {
        return res.status(400).send('Teacher doesn\'t belong to this class.')
    }
}