import React from "react";

export default function Loader() {
  return (
    <div className="spinner-container relative  size-[50px] ">
      <div className="mx-auto w-full h-full border-[7px] z-[1] border-black  absolute rounded-[50%]"></div>
      <div className="spinner w-full h-full border-[7px] border-b-0 z-[2] border-blue1 border-x-[transparent] absolute top-0 rounded-[50%]"></div>
    </div>
  );
}
