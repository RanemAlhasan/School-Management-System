import { getSiteName } from "./studentService";
import { getTeacherSchools } from "./teacherService";

export async function getDefaultValues(account, type = "student") {
  let newObj = {};
  if (!account.startYear) {
    if (sessionStorage.getItem("selectedYear")) {
      let [startYear, endYear] = sessionStorage
        .getItem("selectedYear")
        .split(" - ");
      let siteName = sessionStorage.getItem("siteName");
      newObj["siteName"] = siteName;
      newObj["startYear"] = startYear;
      newObj["endYear"] = endYear;
    } else {
      let [siteName, , years] = await getSiteName(account, type);
      newObj["siteName"] = siteName;
      newObj["startYear"] = years.startYear;
      newObj["endYear"] = years.endYear;
    }
  } else {
    newObj["siteName"] = account.siteName;
    newObj["startYear"] = account.startYear;
    newObj["endYear"] = account.endYear;
  }
  newObj["studentId"] = account.studentId;
  newObj["parentId"] = account.parentId;
  return newObj;
}

export async function getTeacherDefaultValues(account) {
  let newObj = {},
    startYear,
    endYear,
    siteName,
    schoolId;
  if (!account.startYear) {
    let data = await getTeacherSchools(account);
    [startYear, endYear] = data[0].years.split("-");
    siteName = data[0].schools[0].siteName;
    schoolId = data[0].schools[0].schoolId;
  } else {
    siteName = account.siteName;
    schoolId = account.schoolId;
    startYear = account.startYear;
    endYear = account.endYear;
  }
  newObj = {
    startYear,
    endYear,
    siteName,
    schoolId,
    teacherId: account.teacherId,
  };
  return newObj;
}
