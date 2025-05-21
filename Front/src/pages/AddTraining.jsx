import React, { useState, useEffect } from "react";
import StepWrapper from "../components/RegisterStep/StepWrapper";
import Button from "../components/MotionButton";
import Input from "../components/ui/Input";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";

// Step 1: Ask for number of trainings per week
const StepNumberOfTrainings = ({ nextStep, setNumTrainings }) => {
  const [input, setInput] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNumTrainings(Number(input));
    nextStep();
  };

  const handleIncrement = () =>
    setInput((prev) => Math.min(7, Math.max(1, Number(prev) + 1)));
  const handleDecrement = () =>
    setInput((prev) => Math.max(1, Number(prev) - 1));

  const handleInputChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    let num = val === "" ? 1 : Math.max(1, Math.min(7, Number(val)));
    setInput(num);
  };

  // Prevent negative or zero on blur
  const handleBlur = () => {
    if (!input || input < 1) setInput(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 mt-10 items-center"
    >
      <h2 className="text-2xl font-semibold text-black text-center mb-2">
        How many trainings per week?
      </h2>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={handleDecrement}
          className="w-9 h-9 flex items-center justify-center rounded-full  text-black text-xl font-bold hover:border-black transition bg-transparent"
          aria-label="Decrease"
        >
          -
        </button>
        <input
          type="number"
          min={1}
          max={7}
          value={input}
          onChange={handleInputChange}
          onBlur={handleBlur}
          required
          className="w-16 text-center text-lg font-semibold px-0 py-2 border border-gray-300 rounded-md mx-2"
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="w-9 h-9 flex items-center justify-center rounded-full  text-black text-xl font-bold hover:border-black transition bg-transparent"
          aria-label="Increase"
        >
          +
        </button>
      </div>
      <Button
        type="submit"
        className=" w-full bg-black text-white py-4 rounded-xl font-medium mt-2"
      >
        Next
      </Button>
    </form>
  );
};

// Step 2: For each training, ask for title and exercises
const StepTrainingDetails = ({
  trainingIndex,
  trainings,
  setTrainings,
  nextStep,
  prevStep,
  numTrainings,
  finishNow,
}) => {
  const [title, setTitle] = useState(trainings[trainingIndex]?.title || "");
  const [exercises, setExercises] = useState(
    trainings[trainingIndex]?.exercises || []
  );
  const [exercise, setExercise] = useState({
    name: "",
    sets: 1,
    weight: "",
    breakTime: "",
  });
  const [addingExercise, setAddingExercise] = useState(false);

  useEffect(() => {
    setTitle(trainings[trainingIndex]?.title || "");
    setExercises(trainings[trainingIndex]?.exercises || []);
  }, [trainingIndex]);

  const handleAddExercise = (e) => {
    e.preventDefault();
    setExercises([...exercises, exercise]);
    setExercise({ name: "", sets: 1, weight: "", breakTime: "" });
    setAddingExercise(false);
  };

  const handleSaveTraining = () => {
    const updatedTrainings = [...trainings];
    updatedTrainings[trainingIndex] = { title, exercises };
    setTrainings(updatedTrainings);
  };

  const handleNextTraining = () => {
    handleSaveTraining();
    nextStep();
  };

  const handleFinishNow = () => {
    handleSaveTraining();
    finishNow();
  };

  return (
    <div className="flex flex-col gap-6 mt-10">
      <h2 className="text-2xl font-semibold text-black text-center mb-2">
        Training {trainingIndex + 1} of {numTrainings}
      </h2>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Training Title"
        required
        className="max-w-xs mx-auto"
      />
      <h3 className="text-lg font-medium text-black mt-2">Exercises</h3>
      <ul className="space-y-2">
        {exercises.map((ex, idx) => (
          <li
            key={idx}
            className="bg-gray-100 rounded-lg px-4 py-2 flex flex-col"
          >
            <span className="font-semibold text-black">{ex.name}</span>
            <span className="text-sm text-gray-600">
              {ex.sets} sets, {ex.weight}kg, {ex.breakTime} sec break
            </span>
          </li>
        ))}
      </ul>
      {addingExercise ? (
        <form
          onSubmit={handleAddExercise}
          className="flex flex-col gap-3 bg-gray-50 rounded-lg p-4 mt-2"
        >
          <Input
            type="text"
            placeholder="Exercise Name"
            value={exercise.name}
            onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
            required
          />
          <Input
            type="number"
            min={1}
            placeholder="Sets"
            value={exercise.sets}
            onChange={(e) => setExercise({ ...exercise, sets: e.target.value })}
            required
          />
          <Input
            type="number"
            min={0}
            placeholder="Weight (kg)"
            value={exercise.weight}
            onChange={(e) =>
              setExercise({ ...exercise, weight: e.target.value })
            }
            required
          />
          <Input
            type="number"
            min={0}
            placeholder="Break Time (sec)"
            value={exercise.breakTime}
            onChange={(e) =>
              setExercise({ ...exercise, breakTime: e.target.value })
            }
            required
          />
          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-xl font-medium"
            >
              Add Exercise
            </Button>
            <Button
              type="button"
              className="flex-1 bg-gray-200 text-black py-3 rounded-xl font-medium"
              onClick={() => setAddingExercise(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          className="w-full bg-black text-white py-3 rounded-xl font-medium mt-2"
          onClick={() => setAddingExercise(true)}
        >
          Add Exercise
        </Button>
      )}
      <div className="flex gap-2 mt-4">
        <Button
          className="flex-1 bg-gray-200 text-black py-3 rounded-xl font-medium"
          onClick={prevStep}
        >
          Back
        </Button>
        {trainingIndex < numTrainings - 1 && (
          <Button
            className="flex-1 bg-black text-white py-3 rounded-xl font-medium"
            onClick={handleNextTraining}
            disabled={!title || exercises.length === 0}
          >
            Add Next Training
          </Button>
        )}
        <Button
          className="flex-1 bg-black text-white py-3 rounded-xl font-medium"
          onClick={handleFinishNow}
          disabled={!title || exercises.length === 0}
        >
          Finish Now
        </Button>
      </div>
    </div>
  );
};

// Step 3: Summary
const StepSummary = ({ trainings, restart, goToCongrats }) => (
  <div className="flex flex-col gap-6 mt-10">
    <h2 className="text-2xl font-semibold text-black text-center mb-2">
      Summary
    </h2>
    {trainings.map((training, idx) => (
      <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-black mb-2">{training.title}</h3>
        <ul className="space-y-1">
          {training.exercises.map((ex, exIdx) => (
            <li key={exIdx} className="text-gray-700">
              <span className="font-semibold">{ex.name}</span> - {ex.sets} sets,{" "}
              {ex.weight}kg, {ex.breakTime} sec break
            </li>
          ))}
        </ul>
      </div>
    ))}
    <div className="flex gap-2 mt-4">
      <Button
        className="flex-1 bg-gray-200 text-black py-3 rounded-xl font-medium"
        onClick={restart}
      >
        Start Over
      </Button>
      <Button
        className="flex-1 bg-black text-white py-3 rounded-xl font-medium"
        onClick={goToCongrats}
      >
        Finish
      </Button>
    </div>
  </div>
);

// Step 4: Congratulations
const StepCongratulations = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-2xl font-semibold text-black text-center mb-4">
      Congratulations!
    </h2>
    <p className="text-gray-700 text-center mb-6">
      Your training program has been created.
    </p>
    <span role="img" aria-label="party" className="text-6xl">
      🎉
    </span>
  </div>
);

const AddTraining = () => {
  const [step, setStep] = useState(1);
  const [numTrainings, setNumTrainings] = useState(1);
  const [trainings, setTrainings] = useState([]);
  const [currentTraining, setCurrentTraining] = useState(0);

  // Step navigation
  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => {
    if (step === 2 && currentTraining > 0) {
      setCurrentTraining(currentTraining - 1);
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

  // When user finishes a training or all trainings
  const finishNow = () => {
    setStep(3);
  };

  // When user adds next training
  const handleNextTraining = () => {
    setCurrentTraining(currentTraining + 1);
  };

  // Restart the process
  const restart = () => {
    setStep(1);
    setNumTrainings(1);
    setTrainings([]);
    setCurrentTraining(0);
  };

  // Go to congratulations
  const goToCongrats = () => setStep(4);

  return (
    <StepWrapper step={step} handleBack={prevStep} handleContinue={nextStep}>
      {step === 1 && (
        <StepNumberOfTrainings
          nextStep={() => setStep(2)}
          setNumTrainings={(n) => {
            setNumTrainings(n);
            setTrainings(Array(n).fill({ title: "", exercises: [] }));
          }}
        />
      )}
      {step === 2 && (
        <StepTrainingDetails
          trainingIndex={currentTraining}
          trainings={trainings}
          setTrainings={setTrainings}
          nextStep={
            currentTraining < numTrainings - 1 ? handleNextTraining : nextStep
          }
          prevStep={prevStep}
          numTrainings={numTrainings}
          finishNow={finishNow}
        />
      )}
      {step === 3 && (
        <StepSummary
          trainings={trainings}
          restart={restart}
          goToCongrats={goToCongrats}
        />
      )}
      {step === 4 && <StepCongratulations />}
    </StepWrapper>
  );
};

export default AddTraining;
