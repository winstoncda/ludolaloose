import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import React from "react";

function RegisterHeader({
  step,
  handleBack,
  handleContinue,
  hideSkip = false,
}) {
  return (
    <div className="flex items-center justify-between pt-3 bg-white">
      <button onClick={handleBack} className="p-2 -ml-2">
        <ChevronLeftIcon className="w-6 h-6 text-black" />
      </button>
      <span className="text-sm text-gray-600">Step {step} of 7</span>
      <button
        onClick={handleContinue}
        className={`text-sm font-medium text-gray-600 ${
          hideSkip ? "invisible pointer-events-none" : ""
        }`}
      >
        Skip
      </button>
    </div>
  );
}

export default RegisterHeader;
