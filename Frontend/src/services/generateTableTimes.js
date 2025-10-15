export function getActiveTimes(
  startTime,
  breakFrequency,
  numOfSessions,
  breakDuration,
  sessionDuration
) {
  let times = [],
    firstTime,
    secondTime;
  startTime = startTime.split(":");
  let time = new Date();
  time.setHours(startTime[0], startTime[1]);

  for (let i = 0; i < numOfSessions; i++) {
    if (i % breakFrequency === 0 && i !== 0) {
      firstTime = formatTime(
        time.getHours(),
        time.getMinutes() + breakDuration
      );
      time.setMinutes(time.getMinutes() + sessionDuration + breakDuration);
    } else {
      firstTime = formatTime(time.getHours(), time.getMinutes());
      time.setMinutes(time.getMinutes() + sessionDuration);
    }
    secondTime = formatTime(time.getHours(), time.getMinutes());
    times.push(`${firstTime} - ${secondTime}`);
  }
  return times;
}

function formatTime(hours, minutes) {
  minutes = minutes === 0 ? "00" : minutes;
  if (minutes === 60) {
    hours = hours + 1;
    minutes = "00";
  }
  return `${hours}:${minutes}`;
}
