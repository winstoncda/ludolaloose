import { useUser } from "../../contexts/UserContext";
import Button from "../MotionButton";
import { toast } from "react-toastify";

const HeightSelection = ({ handleContinue }) => {
  const { user, setUser } = useUser();

  const height = user.height || "";
  const heightUnit = user.heightUnit || "cm";

  const setHeight = (value) => {
    // On accepte uniquement chiffres et vide, pas de validation bornes ici
    if (value === "" || /^\d*$/.test(value)) {
      setUser((prev) => ({ ...prev, height: value }));
    }
  };

  const setHeightUnit = (unit) => {
    setUser((prev) => ({ ...prev, heightUnit: unit }));
  };

  const onContinue = () => {
    if (height === "") {
      toast.error("Veuillez saisir une taille.");
      return;
    }
    if (heightUnit === "cm") {
      const num = Number(height);
      if (num < 100 || num > 200) {
        toast.error("La taille doit être comprise entre 100 cm et 200 cm.");
        return;
      }
    }
    handleContinue({ height, heightUnit });
  };

  return (
    <div className="h-full bg-white flex flex-col px-6">
      <h1 className="text-2xl font-semibold mt-8 mb-8 text-black text-center">
        Select height
      </h1>

      <div className="flex rounded-xl bg-[#F7F7F7] p-1 mb-8">
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
            heightUnit === "ft" ? "bg-white shadow" : "text-opacity-50"
          }`}
          onClick={() => setHeightUnit("ft")}
        >
          Feet
        </button>
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
            heightUnit === "cm" ? "bg-white shadow" : "text-opacity-50"
          }`}
          onClick={() => setHeightUnit("cm")}
        >
          Centimeter
        </button>
      </div>

      <div className="flex justify-center">
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="180"
          className="m-4 text-center border border-gray-400 focus-within:border-black flex items-center justify-center h-auto min-h-[56px] w-1/3 text-black rounded-md"
        />
        <div className="text-center text-lg flex items-center text-black">
          {heightUnit}
        </div>
      </div>

      <Button
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className={`w-full bg-black text-white py-4 rounded-xl font-medium ${
          !height ? "opacity-50" : ""
        }`}
        disabled={!height}
      >
        Continue
      </Button>
    </div>
  );
};

export default HeightSelection;
