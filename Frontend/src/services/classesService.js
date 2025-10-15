import authService from "./authService";
import Config from "../config/classesApi.json";
import { getJwt } from "./loginService";

export function getGeneralClasses() {
  return authService.get(Config.getGeneralClasses);
}

export async function sendMyClasses(myClasses, years, siteName) {
  let resultObj = {
    classes: myClasses,
  };
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/add`;
  return await authService.post(route, resultObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function getMyClasses(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function decodeClasses({ schoolClasses }) {
  let newArr = schoolClasses.map((element) => element.class);
  newArr = newArr.sort((a, b) => {
    if (a.id < b.id) return -1;
    else return 1;
  });
  newArr = newArr.map((element) => element.name);
  return newArr;
}

export async function sendClassFee(siteName, account, id, fees) {
  let route = `http://localhost:3000/${siteName}/${account.startYear}-${account.endYear}/classes/addFees`;
  let newObj = {
    id,
    fees,
  };
  return authService.patch(route, [newObj], {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getClassesDeletion(siteName, { startYear, endYear }) {
  let route = `http://localhost:3000/${siteName}/${startYear}-${endYear}/classes`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.schoolClasses.map((element) => ({
      name: element.class.name,
      id: element.class.id,
    }));
    return data;
  } catch (error) {
    return [];
  }
}

export function deleteClass(selectedClass, siteName, { startYear, endYear }) {
  let route = `http://localhost:3000/${siteName}/${startYear}-${endYear}/classes/${selectedClass}`;
  return authService.delete(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}
