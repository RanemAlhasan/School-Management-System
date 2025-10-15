const SubjectInYear = require('../models/subject/subjectInYear')

module.exports = async (req, res, next) => {
    try {
        const subject = await SubjectInYear.findOne({
            attributes: ['id'], where: {
                id: req.params.subjectInYearId, schoolClassId: req.schoolClass[0].id
            }, required: true, include:{
                association: 'schoolClass', where:{startYear: req.params.startYear, endYear: req.params.endYear}
            }
        })
        if (!subject) return res.status(400).send('Subject doesn\'t belong to this class')

        req.subject = subject
        next()
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e.message)
    }
}