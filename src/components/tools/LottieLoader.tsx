"use client";

import Lottie from "lottie-react";
import animationData from "@/assets/lottie/upload animation.json";

interface LottieLoaderProps {
  message: string;
}

export default function LottieLoader({ message }: LottieLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-36 h-36">
        <Lottie animationData={animationData} loop />
      </div>
      <p className="text-center font-medium text-slate-700">{message}</p>
    </div>
  );
}
