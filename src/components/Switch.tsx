import { useSpring, animated, useSpringRef } from "@react-spring/web";
import React, { useEffect, useState } from "react";

type Props = {
  state: boolean;
  disable?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function Switch({ state, onClick, disable = false }: Props) {
  const [handleState, setState] = useState(() => state);
  const animation = {
    left: handleState ? "100%" : "0%",
    translateX: handleState ? "-120%" : "20%",
    translateY: "-50%",
    config: { duration: 200 },
  };
  const springRef = useSpringRef();
  const springs = useSpring(animation);
  useEffect(() => {
    setState(state);
  }, [state]);
  return (
    <button
      onClick={(e) => {
        if (disable) return;
        setState((prev) => !prev);
        springRef.start(animation);
        if (onClick) onClick(e);
      }}
      className={
        "border-2 duration-300 rounded-full w-[50px] h-[30px] relative" +
        (handleState
          ? " bg-blue-color border-blue-color"
          : " bg-transparent border-icon-color")
      }
    >
      <animated.div
        style={springs}
        className={
          (handleState ? "bg-white" : "bg-icon-color") +
          " w-[20px] h-[20px] rounded-full bg-icon-color absolute top-1/2 -translate-y-1/2"
        }
      ></animated.div>
    </button>
  );
}
