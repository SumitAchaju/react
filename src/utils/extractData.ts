import { FormEvent } from "react";
import { userType } from "../types/fetchTypes";

export function extractDataForm(e: FormEvent<HTMLFormElement>) {
  let elements = [...e.currentTarget.elements].filter(
    (el: any) => el.tagName == "INPUT"
  );
  let data: any = {};
  elements.forEach((el: any) => {
    data[el.name] = el.value;
  });
  return data;
}

export function excludeFields<T extends object, K extends keyof T>(
  obj: T | undefined,
  exclude: K[]
): Omit<T, K> | undefined {
  if (obj === undefined) return undefined;
  return Object.keys(obj).reduce((result, key) => {
    if (!exclude.includes(key as K)) {
      (result as T)[key as K] = obj[key as K];
    }
    return result;
  }, {} as Omit<T, K>);
}

export function excludeFriendsFromUser(user: userType | undefined) {
  return excludeFields(user, [
    "friend_by",
    "friend",
    "requested_by",
    "requested_user",
    "blocked_by",
    "blocked_user",
  ]);
}
