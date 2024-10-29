import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  labelname?: string;
}

export default function Input({ type = "text", ...props }: Props) {
  return (
    <div className={"w-full " + props.className}>
      {props.labelname ? (
        <label
          className="text-primary-text block mb-2 text-[14px]"
          htmlFor={props.name}
        >
          {props.labelname}
        </label>
      ) : null}
      <input
        className="py-2 text-primary-text rounded-[5px] w-full bg-main block px-3 placeholder:text-icon-color border border-icon-color"
        type={type}
        autoComplete="off"
        {...props}
      />
    </div>
  );
}
