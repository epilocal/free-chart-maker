//https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
import { useState, useEffect } from 'react';

function getWindowDimensions() {
  //modified so Gatsby could build
  let width;
  let height;
  if (typeof window !== `undefined`) {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
