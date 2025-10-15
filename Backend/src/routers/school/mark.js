const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const Classroom = require('../../models/class/classroom')
const SchoolClass = require('../../models/class/schoolClass')
const StudentInClass = require('../../models/student/studentInClass')
const SubjectInSemester = require('../../models/subject/subjectInSemester')
const Exam = require('../../models/exam/exam')
const ExamType = require('../../models/exam/examType')
const Mark = require('../../models/exam/mark')
const ScheduledExam = require('../../models/exam/scheduledExam')

const sendMarks = async (body) => {
    const examType = await ExamType.findByPk(body.examTypeId, { attributes: ['name'] })
    const subject = await SubjectInSemester.findByPk(body.subjectInSemesterId, {
        attributes: ['id'], include: { association: 'subjectInYear', attributes: ['name'] }
    })

    body.marks.forEach(mark => {
        StudentInClass.findByPk(mark.studentInClassId, {
            attributes: ['id'], include: {
                association: 'studentInSchool', attributes: ['id'], include: {
                    association: 'student', attributes: ['id'],
                    include: ['account', { association: 'inLocoParent', include: ['account'] }]
                }
            }
        }
        ).then(studentInClass => {
            let message = ` got ${mark.value}/${body.fullMark} in ${subject.subjectInYear.name} `
            if (examType.name !== 'Other') message += examType.name
            message += '.'
            studentInClass.studentInSchool.student.account.sendMail('New Mark Has Been Released!', 'You' + message)
            studentInClass.studentInSchool.student.inLocoParent.account.sendMail('New Mark Has Been Released!', 'Your son/daughter' + message)
        })
    })
}
//adding marks of a scheduled exam for a subject in semester for students in a classroom 
/*
example
/alhbd/2020-2021/classes/Second_Grade/classrooms/1/scheduledExamMarks/add

{
    "fullMark": 100,
    "scheduledExamId": 1,
    "marks": [
        {
            "studentInClassId": 1,
            "value": 100
        },
        {
            "studentInClassId": 2,
            "value": 90
        }
    ]
}
*/
router.post('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber/scheduledExamMarks/add', auth(['School']), async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass)
            return res.status(404).send('This school does not have a ' + className + ' class')

        const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className, req.params.classroomNumber)

        if (!classroom)
            return res.status(404).send('This school does not have a classroom with number: ' + req.params.classroomNumber + 'in class' + req.params.className)

        const scheduledExam = await Classroom.findByPk(classroom.id, {
            subQuery: false,
            include: {
                association: 'examSchedules', attributes: ['id'], include: {
                    association: 'scheduledExams', attributes: ['id','date', 'examTypeId', 'subjectInSemesterId','examId'], where: { id: req.body.scheduledExamId }
                }, required: true
            }
        })

        if (!scheduledExam)
            return res.status(404).send('This classroom: ' + req.params.classroomNumber + ' does not have the requested scheduled exam.')

        if (scheduledExam.examSchedules[0].scheduledExams[0].examId) {
            let errArray = []
            let exam = await Exam.findByPk(scheduledExam.examSchedules[0].scheduledExams[0].examId)

            for (let index = 0; index < req.body.marks.length; index++) {
                const studentExamMark = await Mark.findOne({
                    where: {
                        examId: exam.id, studentInClassId: req.body.marks[index].studentInClassId
                    }
                })

                if (studentExamMark) {
                    errArray.push(studentExamMark.studentInClassId)
                }
            }

            if (errArray.length) {
                return res.status(400).send(errArray)
            }

            for (let index = 0; index < req.body.marks.length; index++) {
                req.body.marks[index].examId = exam.id
                await Mark.create(req.body.marks[index])
            }
            sendMarks(req.body)
            return res.status(201).send('Marks have been successfully added.')

        }

        req.body.dateOfExam = scheduledExam.examSchedules[0].scheduledExams[0].date
        req.body.examTypeId = scheduledExam.examSchedules[0].scheduledExams[0].examTypeId
        req.body.subjectInSemesterId = scheduledExam.examSchedules[0].scheduledExams[0].subjectInSemesterId


        let created= await Exam.create(req.body, { include: [Mark] })
        scheduledExam.examSchedules[0].scheduledExams[0].examId = created.id
       await scheduledExam.examSchedules[0].scheduledExams[0].save()

        sendMarks(req.body)
        res.status(201).send('Marks have been successfully added.')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})



//adding marks of an exam for a subject in semester for students in a classroom 
/*
example
/alhbd/2020-2021/classes/Second_Grade/classrooms/1/examMarks/add

{
    "fullMark": 100,
    "dateOfExam": "01-01-2021",
    "examTypeId": 1,
    "subjectInSemesterId": 1,
    "marks": [
        {
            "studentInClassId": 1,
            "value": 100
        },
        {
            "studentInClassId": 2,
            "value": 90
        }
    ]
}
*/


router.post('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber/examMarks/add', auth(['School']), async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass)
            return res.status(404).send('This school does not have a ' + className + ' class')

        const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className, req.params.classroomNumber)

        if (!classroom)
            return res.status(404).send('This school does not have a ' + req.params.classroomNumber + ' classroom')

        await Exam.create(req.body, { include: [Mark] })
        sendMarks(req.body)
        res.status(201).send('Marks have been successfully added.')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})

// get Students marks In a class (in a year)
// /alhbd/2020-2021/classes/Second_Grade/subjects/1/marks/types/1
router.get('/:siteName/:startYear-:endYear/classes/:className/subjects/:sisId' +
    '/marks/types/:typeId', auth(['School'])
    , async (req, res) => Mark.handleGetMarksRequest(req, res))


// get Students marks In a classroom (in a year)
// /alhbd/2020-2021/classes/Second_Grade/classrooms/1/marks/1
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms/' +
    ':classroomNumber/subjects/:sisId/marks/types/:typeId', auth(['School'])
    , async (req, res) => Mark.handleGetMarksRequest(req, res))


// get student marks (in every semester in a year)
// /alhbd/2020-2021/students/1/marks
router.get('/:siteName/:startYear-:endYear/students/:studentId/marks', auth(['School']), async (req, res) => {
    try {
        const studentInClass = await StudentInClass.getStudentInClass(req.params.studentId
            , req.account.school.id, req.params.startYear, req.params.endYear)
        if (!studentInClass) return res.status(400).send('Invalid student id.')
        const studentMarks = await SubjectInSemester.getStudentMarksInSemester(studentInClass.id, studentInClass.schoolClassId)
        res.send(studentMarks)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

module.exports = router