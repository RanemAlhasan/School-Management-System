import authService from "./authService";
import Config from "../config/marksApi.json";
import { decodeClasses, getMyClasses } from "./classesService";
import { decodeClassroomsNumber, getClassrooms } from "./classroomsService";
import { decodeStudents, getStudentsInClassroom } from "./studentService";
import { getJwt } from "./loginService";

export async function showClasses(years, siteName) {
  try {
    let { data } = await getMyClasses(years, siteName);
    data = decodeClasses(data);
    return data;
  } catch (error) {
    return [];
  }
}

export async function showClassrooms(years, className, siteName) {
  try {
    let { data } = await getClassrooms(years, className, siteName);
    data = decodeClassroomsNumber(data);
    return data;
  } catch (error) {
    return [];
  }
}

export async function showStudents(
  years,
  className,
  classroomNumber,
  siteName
) {
  try {
    let { data } = await getStudentsInClassroom(
      years,
      className,
      classroomNumber,
      siteName
    );
    let students = decodeStudents(data);
    return students;
  } catch (error) {
    return [];
  }
}

export async function getExamType() {
  try {
    let { data } = await authService.get(Config.marskType);
    return data;
  } catch (error) {
    return [];
  }
}

export async function getClassroomMarks(
  years,
  className,
  classroomNumber,
  subjectId,
  typeId,
  siteName
) {
  className = className.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/classrooms/${classroomNumber}/subjects/${subjectId}/marks/types/${typeId}`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.exams;
    data = data.map((element) => {
      return {
        dateOfExam: element.dateOfExam,
        fullMark: element.fullMark,
        marks: element.marks.map((item) => {
          return {
            name: `${item.firstName} ${item.lastName}`,
            mark: item.value,
          };
        }),
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function getClassMarks(
  years,
  className,
  subjectId,
  typeId,
  siteName
) {
  className = className.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/subjects/${subjectId}/marks/types/${typeId}`;

  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.exams;
    data = data.map((element) => {
      return {
        dateOfExam: element.dateOfExam,
        fullMark: element.fullMark,
        marks: element.marks.map((item) => {
          return {
            name: `${item.firstName} ${item.lastName}`,
            mark: item.value,
          };
        }),
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function showSubjects(years, selectedClass, semester, siteName) {
  selectedClass = selectedClass ? selectedClass.replace(" ", "_") : "";
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/${selectedClass}/${semester}/subjects`;

  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    let subjects = data.subjects;
    subjects = subjects.map((element) => {
      return {
        id: element.id,
        name: element.subjectInYear.name,
      };
    });
    return subjects;
  } catch (error) {
    return [];
  }
}

export async function sendStudentsMark(
  years,
  selectedClass,
  selectedClassroom,
  fullMark,
  dateOfExam,
  examTypeId,
  subjectInSemesterId,
  marks,
  siteName
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${selectedClass}/classrooms/${selectedClassroom}/examMarks/add`;
  marks = marks.map((mark) => {
    return {
      studentInClassId: mark.id,
      value: mark.mark ? mark.mark : 0,
    };
  });
  console.log(marks);

  let newObj = {
    fullMark,
    dateOfExam,
    examTypeId,
    subjectInSemesterId,
    marks,
  };
  console.log(JSON.stringify(newObj));
  console.log(route);
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function sendStudentsExamMark(
  years,
  selectedClass,
  selectedClassroom,
  fullMark,
  marks,
  siteName,
  scheduledExamId
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${selectedClass}/classrooms/${selectedClassroom}/scheduledExamMarks/add`;

  marks = marks.map((mark) => {
    return {
      studentInClassId: mark.id,
      value: mark.mark ? mark.mark : 0,
    };
  });
  console.log(marks);

  let newObj = {
    fullMark,
    scheduledExamId,
    marks,
  };
  console.log(JSON.stringify(newObj));
  console.log(route);
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getMarksReport(studentId, years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/students/${studentId}/marks`;
  console.log(route);
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    let result = [];
    for (let semester in data) {
      result.push({
        semesterNumber: semester,
        subjects: data[semester].map((element) => ({
          subjectName: element.subjectInYear.name,
          exams: element.exams.map((exam) => ({
            examType: exam.examType.name,
            date: exam.dateOfExam,
            fullMark: exam.fullMark,
            mark: exam.marks[0] ? exam.marks[0].value : "",
          })),
        })),
      });
    }
    return result;
  } catch (error) {
    return [];
  }
}

export async function getStudentMarksReport(
  { studentId, startYear, endYear, siteName, parentId },
  type = "student"
) {
  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/marks`;
  let auth = type === "student" ? `student-${studentId}` : `parent-${parentId}`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(auth) },
    });
    let result = [];
    for (let semester in data) {
      result.push({
        semesterNumber: semester,
        subjects: data[semester].map((element) => ({
          subjectName: element.subjectInYear.name,
          exams: element.exams.map((exam) => ({
            examType: exam.examType.name,
            date: exam.dateOfExam,
            fullMark: exam.fullMark,
            mark: exam.marks[0] ? exam.marks[0].value : "",
          })),
        })),
      });
    }
    return result;
  } catch (error) {
    return [];
  }
}
