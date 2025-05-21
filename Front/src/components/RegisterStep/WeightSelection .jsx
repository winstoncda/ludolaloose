import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import Button from "../MotionButton";
import { toast } from "react-toastify";

const WeightSelection = ({ handleContinue, title = "Select weight", step }) => {
  const { user, setUser } = useUser();

  const weightKey = step === "current" ? "currentWeight" : "goalWeight";
  const weightUnitKey =
    step === "current" ? "currentWeightUnit" : "goalWeightUnit";

  const [weight, setWeight] = useState(user[weightKey] || "");
  const [weightUnit, setWeightUnit] = useState(user[weightUnitKey] || "Kg");

  // Sync local state vers contexte user
  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      [weightKey]: weight,
      [weightUnitKey]: weightUnit,
    }));
  }, [weight, weightUnit, setUser, weightKey, weightUnitKey]);

  const onWeightChange = (val) => {
    // Pas de validation de bornes ici, juste chiffres ou vide
    if (val === "" || /^\d*$/.test(val)) {
      setWeight(val);
    }
  };

  const onContinue = () => {
    const { gender, height, heightUnit } = user;

    // Validate weight only if filled (for both current and goal)
    if (weight !== "") {
      if (weightUnit === "Kg" && (weight < 30 || weight > 300)) {
        toast.error(
          `${
            step === "current" ? "Current" : "Goal"
          } weight must be between 30 and 300 kg`
        );
        return;
      }
      if (weightUnit === "Lb" && (weight < 66 || weight > 661)) {
        toast.error(
          `${
            step === "current" ? "Current" : "Goal"
          } weight must be between 66 and 661 lbs`
        );
        return;
      }
    }

    const payload = {
      userId: user._id,
      gender,
      height,
      heightUnit,
      [weightKey]: weight,
      [weightUnitKey]: weightUnit,
    };

    handleContinue(payload);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 flex-1">
        <h1 className="text-2xl font-semibold mt-4 mb-8 text-black text-center">
          {title}
        </h1>

        <div className="flex rounded-xl bg-[#F7F7F7] p-1 mb-8">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
              weightUnit === "Lb" ? "bg-white shadow" : "text-opacity-50"
            }`}
            onClick={() => setWeightUnit("Lb")}
          >
            Pounds
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
              weightUnit === "Kg" ? "bg-white shadow" : "text-opacity-50"
            }`}
            onClick={() => setWeightUnit("Kg")}
          >
            Kilograms
          </button>
        </div>

        <div className="flex justify-center">
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="75"
            className="m-4 text-center border border-gray-400 focus-within:border-black flex items-center justify-center h-auto min-h-[56px] w-1/3 text-black rounded-md"
          />
          <div className="text-center text-lg flex items-center text-black">
            {weightUnit}
          </div>
        </div>

        <Button
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className={`w-full bg-black text-white py-4 rounded-xl font-medium ${
            // Disable only if on current step and no weight
            step === "current" && !weight ? "opacity-50" : ""
          }`}
          disabled={step === "current" && !weight}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WeightSelection;
