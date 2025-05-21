import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/Reusable/Input";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { login } from "../apis/auth.api";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (!result.success) {
        toast.error(result.message || "Erreur lors de la connexion");
        setLoading(false);
        return;
      }

      // Mise à jour user dans contexte global
      setUser(result.user);

      toast.success("Connexion réussie !");
      navigate("/home"); // adapte la route si besoin
    } catch (error) {
      toast.error("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 overflow-hidden">
      <div className="absolute -z-10 top-0 left-1/2 w-[28rem] h-[28rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 opacity-60 blur-3xl animate-blob" />

      <div className="w-full max-w-sm flex flex-col items-center justify-center">
        <div className="flex items-center justify-between pt-2 mb-6 w-full">
          <div className="w-6" />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[32px] font-bold tracking-tight text-gray-900"
          >
            Sign In
          </motion.h1>
          <div className="w-6" />
        </div>

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
            autoFocus
            autoComplete="email"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl font-medium text-base mt-1 shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
          <Link
            to="/forgot-password"
            className="block text-center text-sm text-gray-400 mt-1 hover:underline"
          >
            Forgot Password?
          </Link>
        </motion.form>
      </div>

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

export default SignIn;
