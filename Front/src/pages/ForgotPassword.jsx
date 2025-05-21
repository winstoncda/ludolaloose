import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/Reusable/Input";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 overflow-hidden">
      {/* Animated Gradient Blob */}
      <div className="absolute -z-10 top-0 left-1/2 w-[28rem] h-[28rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 opacity-60 blur-3xl animate-blob" />
      <div className="w-full max-w-sm flex flex-col items-center justify-center">
        <div className="flex items-center justify-between pt-2 mb-6 w-full">
          <div className="w-6" /> {/* Spacer for centering */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[28px] font-bold tracking-tight text-gray-900"
          >
            Forgot Password
          </motion.h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full text-center"
          >
            <p className="text-gray-800 text-lg font-medium mb-2">
              Check your email
            </p>
            <p className="text-gray-500 mb-6 text-sm">
              If an account exists for{" "}
              <span className="font-semibold">{email}</span>, you will receive a
              password reset link shortly.
            </p>
            <Link
              to="/signin"
              className="text-blue-500 hover:underline text-sm"
            >
              Back to Sign In
            </Link>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="w-full space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-medium text-base mt-1 shadow-md hover:bg-gray-900 transition"
            >
              Send Reset Link
            </motion.button>
            <Link
              to="/signin"
              className="block text-center text-sm text-gray-400 mt-1 hover:underline"
            >
              Back to Sign In
            </Link>
          </motion.form>
        )}
      </div>
      {/* Custom keyframes for animation */}
      <style>{`
        @keyframes blob {
          0%,100% { transform: scale(1) translate(-50%,-33%); }
          33% { transform: scale(1.05,0.95) translate(-50%,-33%); }
          66% { transform: scale(0.95,1.05) translate(-50%,-33%); }
        }
        .animate-blob {
          animation: blob 8s infinite linear;
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;
