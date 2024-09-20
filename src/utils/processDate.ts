export type dateType = {
  year: number;
  month: string;
  day: number;
  hour: number;
  minute: number;
  second: number;
  hour12: string;
};

function timeToSeconds(time: dateType) {
  return time.hour * 3600 + time.minute * 60 + time.second;
}

export function checkTimeDiff(date1: string, date2: string, time: number) {
  const firstDate = extractDate(date1);
  const secondDate = extractDate(date2);

  if (
    firstDate.month != secondDate.month ||
    firstDate.year != secondDate.year ||
    firstDate.day != secondDate.day
  ) {
    return false;
  }
  const firstSecond = timeToSeconds(firstDate);
  const secondSecond = timeToSeconds(secondDate);

  return Math.abs(firstSecond - secondSecond) <= time;
}

export function checkDateOneDay(date1: dateType, date2: dateType) {
  return (
    Math.abs(date1.day - date2.day) == 0 &&
    date1.month == date2.month &&
    date1.year == date2.year
  );
}

export function checkYear(date1: dateType, date2: dateType) {
  return date1.year != date2.year;
}

export function extractDate(date: string) {
  let [month, day, year, time, hour12] = date.split(" ");
  const [hour, minute, second] = String(time)
    .split(":")
    .map((time) => Number(time));

  return {
    year: Number(year),
    month,
    day: Number(day),
    hour,
    minute,
    second,
    hour12,
  };
}

function extractFormatedDate(date: dateType, type: "short" | "half" | "full") {
  let hour = String(date.hour);
  let minute = String(date.minute);
  if (date.hour < 10) {
    hour = "0" + hour;
  }
  if (date.minute < 10) {
    minute = "0" + minute;
  }
  const timeOnly = [hour, minute].join(":") + " " + date.hour12;
  if (type == "short") {
    return timeOnly;
  } else if (type == "half") {
    return `${date.day} ${date.month} At ${timeOnly}`;
  } else {
    return `${date.day} ${date.month} ${date.year} At ${timeOnly}`;
  }
}

export function extracteDateToOneWord(date: string) {
  const currentDate = extractDate(getFormattedDateInKathmandu());
  const extractedDate = extractDate(date);
  let hour = String(extractedDate.hour);
  let minute = String(extractedDate.minute);
  if (extractedDate.hour < 10) {
    hour = "0" + hour;
  }
  if (extractedDate.minute < 10) {
    minute = "0" + minute;
  }

  const oneDay = checkDateOneDay(currentDate, extractedDate);
  if (oneDay) {
    return [hour, minute].join(":") + " " + extractedDate.hour12;
  }
  const oneYear = checkYear(currentDate, extractedDate);
  if (oneYear) {
    return String(extractedDate.year);
  }
  return `${extractedDate.month} ${extractedDate.day}`;
}

export function formatedDate(date: string) {
  const currentDate = extractDate(getFormattedDateInKathmandu());
  const extractedDate = extractDate(date);

  const oneDay = checkDateOneDay(currentDate, extractedDate);
  if (oneDay) {
    return extractFormatedDate(extractedDate, "short");
  }
  const oneYear = checkYear(currentDate, extractedDate);
  if (oneYear) {
    return extractFormatedDate(extractedDate, "full");
  }
  return extractFormatedDate(extractedDate, "half");
}

function getFormattedDateInKathmandu() {
  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })
  );
  return date
    .toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      hour12: true,
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(",", "")
    .split(",")
    .join("");
}
