export function getPaginatedArray(array, index, pagesize) {
  let arr = [];
  for (let i = index * 5; i < index * 5 + pagesize; i++) {
    arr.push(array[i]);
  }
  return arr;
}

export function getPaginatedStudents(array, index, pageSize) {
  let arr = [];
  for (let i = index * pageSize; i < index * pageSize + pageSize; i++) {
    if (array[i]) arr.push(array[i]);
  }
  return arr;
}
