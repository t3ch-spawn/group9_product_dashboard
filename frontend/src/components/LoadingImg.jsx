import React, { useState } from "react";
import Loader from "./Loader";

export default function LoadingImg({ src, alt, className }) {
  const [hasLoaded, setHasLoaded] = useState(false);

  function handleLoad() {
    setHasLoaded(true);
  }
  return (
    <>
      <img
        onLoad={handleLoad}
        className={`${
          hasLoaded ? "opacity-100 relative" : "opacity-0 absolute"
        } duration-300 pointer-events-none ${className}`}
        src={src}
        alt={alt}
      />

      <div
        className={`${
          !hasLoaded ? "block" : "hidden"
        } w-full ${className} flex justify-center items-center`}
      >
        <Loader />
      </div>
    </>
  );
}
