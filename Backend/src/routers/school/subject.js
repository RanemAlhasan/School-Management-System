const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const SchoolClass = require('../../models/class/schoolClass')
const SubjectInYear = require('../../models/subject/subjectInYear')
const SubjectInSemester = require('../../models/subject/subjectInSemester')
const classBelongsToSchool = require('../../middlewares/classBelongsToSchool')
const subjectBelongsToClass = require('../../middlewares/subjectBelongsToClass')

//adding subjects from possible categories to a school class through specific semesters
/*
example
/alhbd/2020-2021/Second_Grade/subjects/add

{
    "subjects": [
        {
            "categoryId": 1,
            "name": "ck",
            "subjectInSemesters": [
                {"semester": 1},
                {"semester": 3}
            ]
        }
    ]
}
*/
router.post('/:siteName/:startYear-:endYear/:className/subjects/add', auth(['School']), async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass.id)
            return res.status(404).send('This school does not have a ' + className + ' class in this year.')


        await schoolClass.checkSubjectsExist(req.body.subjects)

        for (let subject of req.body.subjects)
            await schoolClass.createSubjectInYear(subject, { include: [SubjectInSemester] })
        res.status(201).send('Subjects were added for ' + className + ' class')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})

//get subjects for a school in a specific year and semester for some class
/*
example
/alhbd/2020-2021/Second_Grade/1/subjects
*/
router.get('/:siteName/:startYear-:endYear/:className/:semester/subjects', auth(['School']), async (req, res) => {
   return SubjectInSemester.handleGetSubjectsRequests(req, res)
})

//get subjects for a school in a specific year for some class
/*
example
/alhbd/2020-2021/Second_Grade/subjects
*/
router.get('/:siteName/:startYear-:endYear/:className/subjects', auth(['School']), async (req, res) => {
    return SubjectInSemester.handleGetSubjectsRequests(req, res)
 })
 

/* delete Subject
/alhbd/2020-2021/classes/Preschool/1
 */
router.delete('/:siteName/:startYear-:endYear/classes/:className/:subjectInYearId',classBelongsToSchool, subjectBelongsToClass,
    auth(['School']),  async (req, res) => {
        try {
            await req.subject.destroy()
            res.send('Subject has been deleted.')
        } catch (e) {
            console.log(e.message)
            res.status(400).send('You can\'t delete this subject as it either has a scheduled exam or an exam mark or a weekly schedule.')
        }
    })




module.exports = router