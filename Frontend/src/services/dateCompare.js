export function dateCompare(firstDate, secondDate) {
  firstDate.setHours(0, 0, 0, 0);
  secondDate.setHours(0, 0, 0, 0);
  return firstDate.getTime() <= secondDate.getTime();
}

export function replaceEverything(target, original, newOne) {
  let str = "";
  for (let i = 0; i < target.length; i++) {
    if (target[i] === original) str += newOne;
    else str += target[i];
  }
  return str;
}
