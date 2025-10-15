export function getStudentsCount(students, classrooms) {
    let studentsCount = [];
    let studentsNumber = students.length;
    let classroomsCount = classrooms.length;
    for (let i = 0; i < classroomsCount; i++) {
        if (studentsNumber > classrooms[i].capacity) {
            studentsCount[i] = classrooms[i].capacity;
            studentsNumber -= classrooms[i].capacity;
        }
        else {
            studentsCount[i] = studentsNumber;
            studentsNumber = 0;
        }
    }

    if (studentsNumber > classroomsCount) {
        studentsCount = studentsCount.map(element => element += Math.floor(studentsNumber / classroomsCount))
        studentsNumber -= classroomsCount * Math.floor(studentsNumber / classroomsCount)
    }

    while (studentsNumber > 0) {
        for (let i = 0; i < studentsCount.length; i++) {
            if (studentsNumber > 0) {
                studentsCount[i] += 1;
                studentsNumber -= 1;
            }
        }
    }
    studentsCount = studentsCount.map((element, index) => {
        return ({
            number: classrooms[index].number,
            studentsCount: element
        })
    })
    return studentsCount;
}