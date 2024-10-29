import React, { useState } from "react";
import { useThrottledCallback } from "use-debounce";

export default function useBottomScroll() {
  const [isShowBottom, setIsShowBottom] = useState(false);

  const handleScrollFn = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!e.currentTarget) return;
    const clientHeight = e.currentTarget.clientHeight;
    const scrollHeight = e.currentTarget.scrollHeight;
    const scrollTop = e.currentTarget.scrollTop;

    if (scrollTop + clientHeight >= scrollHeight - 500) {
      setIsShowBottom(false);
    } else {
      setIsShowBottom(true);
    }
  };

  const handleScroll = useThrottledCallback(handleScrollFn, 50);

  return { isShowBottom, handleScroll };
}
