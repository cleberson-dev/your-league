import { useEffect, useState } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;

  return { width, height };
}

export default function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";
  const [windowDimensions, setWindowDimensions] = useState(hasWindow ? getWindowDimensions() : { width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
