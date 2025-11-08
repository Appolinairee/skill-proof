"use client";

import { useEffect } from "react";

const useBodyScrollLock = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const scrollY = window.scrollY;
    
    const originalStyle = window.getComputedStyle(document.body);
    const originalPosition = originalStyle.position;
    const originalTop = originalStyle.top;
    const originalWidth = originalStyle.width;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll";

    return () => {
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.overflowY = "";
      
      window.scrollTo(0, scrollY);
    };
  }, [isActive]);
};

export default useBodyScrollLock;
