import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import Button from "../components/MotionButton";

const slides = [
  {
    title: "Welcome to GolemBro's",
    description: "Train Hard. Progress. Build your Strength.",
    image: "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg",
    primaryButton: { text: "Start Training", action: "next" },
    secondaryButton: { text: "Sign In", action: "/signin" },
  },
  {
    title: "Progressive Overload",
    description:
      "Master Progressive Overload with a Story that's uniquely yours.",
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    primaryButton: { text: "Next training", action: "next" },
    secondaryButton: { text: "Sign In", action: "/signin" },
  },
  {
    title: "Train together",
    description: "Connect with your gym bros. Train smarter, together.",
    image:
      "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    primaryButton: { text: "Get Started", action: "/register" },
    secondaryButton: { text: "Sign In", action: "/signin" },
  },
];

function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (action) => {
    if (action === "next") {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        navigate("/register");
      }
    } else {
      navigate(action);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      currentSlide < slides.length - 1 && setCurrentSlide(currentSlide + 1),
    onSwipedRight: () => currentSlide > 0 && setCurrentSlide(currentSlide - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black" {...handlers}>
      <div className="h-full flex flex-col">
        <div className="relative flex-1">
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative px-6 pb-12 pt-6">
          <h1 className="text-3xl font-bold mb-2 text-center">{slide.title}</h1>
          <p className="text-gray-400 mb-8 text-center">{slide.description}</p>

          <div className="space-y-4 max-w-xs mx-auto">
            <Button
              onClick={() => handleNavigation(slide.primaryButton.action)}
              className="w-full bg-white text-black"
            >
              {slide.primaryButton.text}
            </Button>

            <Link
              to={slide.secondaryButton.action}
              className="block text-center text-sm text-gray-500 mt-4"
            >
              Already have an account? Sign In
            </Link>
          </div>

          <div className="flex gap-2 justify-center mt-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
