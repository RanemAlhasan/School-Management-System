const SchoolClass = require('../models/class/schoolClass')

module.exports = async (req, res, next) => {
    try {
        const className = req.params.className.replace('_', ' ')
        const schoolClass = await SchoolClass.findAll({
            where: {startYear: req.params.startYear, endYear: req.params.endYear},
            attributes: ['id', 'classId'], required: true, include: {
                association: 'class', where: {name: className}
            }
        })
        if (!schoolClass.length) return res.status(400).send('Class doesn\'t belong to this school')

        req.schoolClass = schoolClass
        next()
    } catch (e) {
        res.status(400).send('This school doesn\'t have the required class.')
    }
}