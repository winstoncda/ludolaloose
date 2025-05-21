import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";

import GenderSelection from "../components/RegisterStep/GenderSelection";
import HeightSelection from "../components/RegisterStep/HeightSelection";
import WeightSelection from "../components/RegisterStep/WeightSelection ";
import RegisterForm from "../components/RegisterStep/RegisterForm";
import RegisterFinalSelection from "../components/RegisterStep/RegisterFinalSelection";
import StepWrapper from "../components/RegisterStep/StepWrapper";
import RegisterDone from "../components/RegisterStep/RegisterDone";
import ConfirmMail from "../components/RegisterStep/ConfirmMail";

const Register = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user, setUser, tempUser, setTempUser } = useUser();

  // Fusionner tempUser dans user une fois que l'on a l'ID
  useEffect(() => {
    if (tempUser?._id) {
      setUser((prev) => ({ ...prev, ...tempUser }));
      setTempUser(null);
    }
  }, [tempUser, setUser, setTempUser]);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const handleContinue = async (formData) => {
    // Mettre à jour l'user ou tempUser selon l'étape
    if (formData) {
      if (step <= 2) {
        setTempUser((prev) => ({ ...prev, ...formData }));
      } else {
        setUser((prev) => ({ ...prev, ...formData }));
      }
    }

    // Validation spécifique pour la taille (step 4)
    if (step === 4) {
      const height = formData?.height ?? user?.height;
      const heightUnit = formData?.heightUnit ?? user?.heightUnit ?? "cm";

      if (heightUnit === "cm") {
        if (height < 100 || height > 200) {
          toast.error("La taille doit être comprise entre 100 cm et 200 cm.");
          return; // Bloquer l’avancement
        }
      }
    }

    // Validation spécifique pour le poids (step 5 et step 6)
    if (step === 5 || step === 6) {
      // step 5 => poids actuel (currentWeight), step 6 => poids objectif (goalWeight)
      const weightKey = step === 5 ? "currentWeight" : "goalWeight";
      const weightUnitKey = step === 5 ? "currentWeightUnit" : "goalWeightUnit";

      const weight = formData?.[weightKey] ?? user?.[weightKey];
      const weightUnit =
        formData?.[weightUnitKey] ?? user?.[weightUnitKey] ?? "Kg";

      if (weight !== "" && weight !== null && weight !== undefined) {
        if (weightUnit.toLowerCase() === "kg") {
          if (weight < 30 || weight > 300) {
            toast.error(
              `Le poids doit être compris entre 30 kg et 300 kg (${
                step === 5 ? "poids actuel" : "objectif"
              }).`
            );
            return; // Bloquer l’avancement
          }
        } else {
          // Si en lbs
          if (weight < 66 || weight > 661) {
            toast.error(
              `Le poids doit être compris entre 66 lbs et 661 lbs (${
                step === 5 ? "poids actuel" : "objectif"
              }).`
            );
            return;
          }
        }
      }
    }

    if (step === 2) {
      setStep(step + 1);
      return;
    }

    if (step === 6) {
      try {
        const userId = user._id || tempUser?._id;
        if (!userId) throw new Error("User ID manquant");

        // Champs autorisés à envoyer, exactement comme dans le backend
        const allowedFields = [
          "gender",
          "height",
          "heightUnit",
          "currentWeight",
          "currentWeightUnit",
          "goalWeight",
          "goalWeightUnit",
        ];

        // Construire l'objet filtré à partir de user
        const filteredUserData = {};
        allowedFields.forEach((field) => {
          if (user[field] !== undefined) {
            filteredUserData[field] = user[field];
          }
        });

        const bodyToSend = { userId, ...filteredUserData };

        const res = await fetch("http://localhost:3000/auth/optional", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToSend),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMessage =
            errorData?.message || "Erreur lors de l’envoi des données.";
          throw new Error(errorMessage);
        }

        const data = await res.json();
        setUser(data.user);

        setStep(step + 1);
      } catch (error) {
        toast.error(
          "Erreur lors de la mise à jour du profil : " + error.message
        );
        return;
      }
      return;
    }

    setStep(step + 1);
  };

  const steps = {
    1: (
      <RegisterForm
        formData={tempUser}
        handleContinue={handleContinue}
        handleBack={handleBack}
      />
    ),
    2: (
      <ConfirmMail
        handleBack={handleBack}
        handleNext={handleContinue}
        email={tempUser?.email || ""}
      />
    ),
    3: (
      <GenderSelection
        selectedGender={user?.gender}
        setSelectedGender={(value) =>
          setUser((prev) => ({ ...prev, gender: value }))
        }
        handleContinue={handleContinue}
        handleBack={handleBack}
      />
    ),
    4: (
      <HeightSelection
        height={user?.height}
        setHeight={(value) => setUser((prev) => ({ ...prev, height: value }))}
        heightUnit={user?.heightUnit || "cm"}
        setHeightUnit={(value) =>
          setUser((prev) => ({ ...prev, heightUnit: value }))
        }
        handleContinue={handleContinue}
        handleBack={handleBack}
      />
    ),
    5: (
      <WeightSelection
        weight={user?.currentWeight}
        setWeight={(value) =>
          setUser((prev) => ({ ...prev, currentWeight: value }))
        }
        weightUnit={user?.currentWeightUnit || "Kg"}
        setWeightUnit={(value) =>
          setUser((prev) => ({ ...prev, currentWeightUnit: value }))
        }
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Select current weight"
        step="current"
      />
    ),
    6: (
      <WeightSelection
        weight={user?.goalWeight}
        setWeight={(value) =>
          setUser((prev) => ({ ...prev, goalWeight: value }))
        }
        weightUnit={user?.goalWeightUnit || "Kg"}
        setWeightUnit={(value) =>
          setUser((prev) => ({ ...prev, goalWeightUnit: value }))
        }
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Select goal weight"
        step="goal"
      />
    ),
    7: (
      <RegisterFinalSelection
        handleBack={handleBack}
        handleContinue={handleContinue}
        navigate={navigate}
        title="Would you like to enter your training information now?"
        step="Step 5"
      />
    ),
    8: (
      <RegisterDone
        handleBack={handleBack}
        handleContinue={handleContinue}
        navigate={navigate}
        step="Step 7"
        setStep={setStep}
        title="Ready to go!"
      />
    ),
  };

  return (
    <StepWrapper
      step={step}
      handleBack={handleBack}
      handleContinue={handleContinue}
      hideHeader={[2, 8].includes(step)}
      hideSkip={[1, 6, 7].includes(step)}
    >
      {steps[step] || null}
    </StepWrapper>
  );
};

export default Register;
