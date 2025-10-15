const app = require("./app")
const sequelize = require("./db/sequelize")

const Class = require("./models/class/class")
const Category = require("./models/subject/category")
const ExamType = require("./models/exam/examType")
const Day = require("./models/session/day")
const AnnouncementType = require("./models/announcement/announcementType")

const createData = (Model, array) => {
    return new Promise((async (resolve, reject) => {
        try {
            for (const data of array)
                await Model.findOrCreate({where: data})
            resolve('Done.')
        } catch (e) {
            reject(e)
        }
    }))
}

const runServer = async () => {
    await sequelize.authenticate()
  
   // await sequelize.sync({force: true})
    await sequelize.sync()

    const promises = []
    try {
        promises.push(createData(Class, Class.defaultClasses))
        promises.push(createData(Category, Category.defaultCategories))
        promises.push(createData(ExamType, ExamType.defaultExamTypes))
        promises.push(createData(Day, Day.defaultDays))
        promises.push(createData(AnnouncementType, AnnouncementType.defaultAnnouncementTypes))

        await Promise.all(promises)
        app.listen(process.env.PORT, () => console.log(`Server is up at port: ${process.env.PORT}`))
    } catch (e) {
        console.log(e)
    }
}

runServer()
