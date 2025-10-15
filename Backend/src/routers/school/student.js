const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const classBelongsToSchool = require('../../middlewares/classBelongsToSchool')

const Account = require('../../models/account')
const Student = require('../../models/student/student')
const Class = require('../../models/class/class')
const SchoolClass = require('../../models/class/schoolClass')
const StudentInSchool = require('../../models/student/studentInSchool')
const StudentInClass = require('../../models/student/studentInClass')
const Payment = require('../../models/student/payment')
const {Op} = require('sequelize')

// post New Student
// /alhbd/2020-2021/students/add
/*
{
        "fatherName": "Aamer",
        "motherName": "Hanaa",
        "lastSchoolAttended": "Bla",
        "schoolClassId":1,
        "account": {
        "email": "abd@hbd.com",
        "password": "12345678",
        "phoneNumber": "+961994418888"
        },
        "personalInfo": {
        "firstName": "Raghad",
        "lastName": "Al-Halabi",
        "birthDate": "04-17-2001",
        "residentialAddress": "Damascus"
        },
        "inLocoParent": {
        "account": {
        "user":"InLocoParent",
        "email": "inLocoParentis@gmail.com",
        "password": "57239000",
        "phoneNumber": "+963994418888"
        }
        }
}
*/

router.post('/:siteName/:startYear-:endYear/students/add', auth(['School']), async (req, res) => {
    try {
        const schoolClass = await SchoolClass.findByPk(req.body.schoolClassId)
        if (!schoolClass || schoolClass.schoolId !== req.account.school.id)
            return res.status(401).send('schoolClassId doesn\'t belong to this school.')

        if (schoolClass.startYear != req.params.startYear || schoolClass.endYear != req.params.endYear)
            return res.status(401).send('schoolClassId doesn\'t belong to this year.')

        if (!(req.body.account.email.localeCompare(req.body.inLocoParent.account.email)))
            return res.status(400).send('emails could not be identical.')

        let existedAccount = await Account.findOne({where: {[Op.or]: [{email: req.body.account.email}, {email: req.body.inLocoParent.account.email}]}})

        if (existedAccount)
            return res.status(400).send(existedAccount.email)

        req.body.account.user = 'Student'
        req.body.inLocoParent.account.user = 'InLocoParent'
        req.body.classId = schoolClass.classId
        delete req.body.schooClasslId

        const student = await Student.create(req.body, {
            include: [{association: 'account'}, {association: 'personalInfo'},
                {association: 'inLocoParent', include: ['account']}]
        })
        const studentInSchool = await StudentInSchool.create({studentId: student.id, schoolId: req.account.school.id})
        await StudentInClass.create({
            studentInSchoolId: studentInSchool.id, schoolClassId: schoolClass.id,
            classroomId: req.body.classroomId
        })

        student.account.sendMail('Welcome To Schoolink!', 'Have a nice experience as a student in our website!' +
            `\nYou have been added to ${req.account.school.schoolName} school.`)
        student.inLocoParent.account.sendMail('Welcome To Schoolink!', 'Have a nice experience as a in loco parentis in our website!' +
            `\nYour son/daughter has been added to ${req.account.school.schoolName} school.`)

        res.status(201).send(student)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

// post Existing Student
// /alhbd/2020-2021/students/addExisting
//{ "id":4,"email":"abd@hbd4.com", "schoolClassId":1}
router.post('/:siteName/:startYear-:endYear/students/addExisting', auth(['School']), async (req, res) => {
    try {
        const account = await Account.findByIdAndEmail(req.body.id, req.body.email)
        if (!account || !account.student) return res.status(404).send('Invalid student criteria.')

        const activeRecords = await StudentInSchool.count({
            where: {'$student.id$': account.student.id, active: true}, include: 'student'
        })

        if (activeRecords) return res.status(401).send('Student is already registered in a school.')

        await account.student.assignClassId(req.body.schoolClassId)
        const studentInSchool = await StudentInSchool.activateAccount(account.student.id, req.account.school.id)
        await studentInSchool.createStudentInClass({schoolClassId: req.body.schoolClassId})

        account.student.dataValues.account = {email: req.body.email}
        account.sendMail('Registration to a New School', `You have been added to ${req.account.school.schoolName} school.`)

        const inLocoParent = await account.student.getInLocoParent({include: 'account'})
        inLocoParent.account.sendMail('Registration in a New School', `Your son/daughter has been added to ${req.account.school.schoolName} school.`)

        res.send(account.student)
    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})
    }
})

// get Students In a School (in a year)
// /alhbd/2020-2021/students
router.get('/:siteName/:startYear-:endYear/students', auth(['School'])
    , async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))

// patch Disable Student In School
// /alhbd/2020-2021/students/disable
// {"studentId":1}
router.patch('/:siteName/:startYear-:endYear/students/disable', auth(['School']),
    async (req, res) => {
        try {
            const updateRows = await StudentInSchool.update({active: false},
                {where: {schoolId: req.account.school.id, studentId: req.body.studentId}})
            if (!updateRows[0]) return res.status(404).send('Student not found in this school.')
            res.send('Account has been disabled.')
        } catch (e) {
            console.log(e)
            res.status(500).send('Disabling failed.')
        }
    })

/* promote student to a higher class
   /alhbd/2019-2020/classes/:className/students/promotion
    {"studentIds":[1,2]}
*/
router.post('/:siteName/:startYear-:endYear/classes/:className/students/promotion', auth(['School']), classBelongsToSchool,
    async (req, res) => {
        try {
            const newClassId = req.schoolClass[0].classId + 1
            const newStartYear = parseInt(req.params.startYear) + 1
            const newEndYear = parseInt(req.params.endYear) + 1

            if (!await Class.findByPk(newClassId)) return res.status(400).send('Promotion can\'t be done for this class.')

            const newSchoolClass = await SchoolClass.findOne({
                where: {schoolId: req.account.school.id, startYear: newStartYear, endYear: newEndYear}
            })
            if (!newSchoolClass) return res.status(404).send('New class wasn\'t found in the next period.')

            const activeRecords = [], registeredStudents = []

            req.body.studentIds.forEach(id => {
                activeRecords.push(StudentInSchool.count({
                    include: [{association: 'student', where: {id}},
                        {
                            association: 'studentInClasses', required: true,
                            include: {association: 'schoolClass', where: {startYear: newStartYear, endYear: newEndYear}}
                        }]
                }).then(result => result ? registeredStudents.push(id) : 0))
            })

            await Promise.all(activeRecords)
            if(registeredStudents.length)
                return res.status(400).send(registeredStudents)


            const promotions = []
            req.body.studentIds.forEach(id => {
                promotions.push(Student.findByPk(id, {
                    where: {schoolId: req.account.school.id},
                    include: {association: 'studentInSchools', attributes: ['id']}
                })
                    .then(async student => {
                            await student.studentInSchools[0].createStudentInClass({schoolClassId: newSchoolClass.id})
                            await student.update({classId: newClassId})
                        }
                    ))
            })

            await Promise.all(promotions)
            res.send('Promotion is done.')

        } catch (e) {
            console.log(e)
            res.status(500).send('Promotion failed.')
        }
    }
)


/*
 post payment
 /alhbd/2020-2021/students/payments/add
 {
    "studentInClassId": 1,
    "value": 1000,
    "date": "1-1-2020"
 }
 */
router.post('/:siteName/:startYear-:endYear/students/payments/add', auth(['School']), async (req, res) => {
    try {
        await Payment.create(req.body)
        res.send('Adding a payment is done.')
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})

// get payments
// /alhbd/2020-2021/students/1/payments
router.get('/:siteName/:startYear-:endYear/students/:studentId/payments', auth(['School']), async (req, res) => {
    try {
        const studentInClass = await StudentInClass.getStudentInClass(req.params.studentId
            , req.account.school.id, req.params.startYear, req.params.endYear)
        if (!studentInClass) return res.status(400).send('Invalid student id.')
        const payments = await StudentInClass.getPayments(studentInClass.id)
        res.send(payments)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


module.exports = router