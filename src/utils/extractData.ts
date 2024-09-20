import { FormEvent } from "react";

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
