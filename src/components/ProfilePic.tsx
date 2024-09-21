import { HTMLAttributes } from "react";

type Props = {
  image: string | undefined;
  size?: number;
  active?: boolean;
  circle?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function ProfilePic({
  image,
  size = 56,
  active = true,
  circle = true,
  className,
  style,
  ...rest
}: Props) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
      className={`${
        circle ? "p-[2px] bg-red-color" : ""
      } rounded-full relative shrink-0 ${className}`}
      {...rest}
    >
      <img
        className="rounded-full w-full h-full object-cover"
        src={image}
        alt="profile"
      />
      {active ? (
        <div
          style={{ width: `${size / 5}px`, height: `${size / 5}px` }}
          className={`bg-active-green-color rounded-full absolute bottom-0 right-1 border-black border border-solid`}
        ></div>
      ) : (
        ""
      )}
    </div>
  );
}
