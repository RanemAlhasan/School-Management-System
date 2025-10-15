import authService from "./authService";
import { getJwt } from "./loginService";

export function setAbsence(
  years,
  date,
  reason,
  destinationId,
  selectedDestination,
  siteName
) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/absences/add`;

  let destination;

  console.log(selectedDestination);

  switch (selectedDestination) {
    case "Student":
      destination = "studentInClassId";
      break;
    case "Teacher":
      destination = "teacherInYearId";
      break;
    default:
  }

  let newArr = [
    {
      sessionId: null,
      date,
      reason,
      [destination]: destinationId,
    },
  ];

  console.log(JSON.stringify(newArr));

  return authService.post(route, newArr, {
    headers: { Authorization: getJwt(siteName) },
  });
}
