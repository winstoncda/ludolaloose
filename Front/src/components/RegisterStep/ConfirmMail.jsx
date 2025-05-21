import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../MotionButton";
import { checkEmailValidation } from "../../apis/auth.api";
import { useUser } from "../../contexts/UserContext";

const ConfirmMail = ({ handleBack, handleNext }) => {
  const { tempUser, setTempUser, setUser } = useUser();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!tempUser?.email) return;

    const interval = setInterval(async () => {
      try {
        const res = await checkEmailValidation(tempUser.email);
        console.log("Réponse checkEmailValidation:", res);

        if (res?.validated) {
          setValidated(true);
          clearInterval(interval);

          if (res.userId) {
            console.log("Set user avec ID :", res.userId);
            setUser((prev) => ({
              ...prev,
              _id: res.userId,
              email: tempUser.email,
            }));
            setTempUser(null);
          } else {
            console.warn("Aucun userId dans la réponse");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'email :", error);
      }
    }, 5000);

    const bc = new BroadcastChannel("mail_verification_channel");
    bc.onmessage = (event) => {
      console.log("Message BroadcastChannel reçu :", event.data);
      if (event.data.verified && event.data.userId) {
        setValidated(true);
        console.log("Set user avec ID BroadcastChannel :", event.data.userId);
        setUser({ id: event.data.userId, email: tempUser.email });
        setTempUser(null);
        clearInterval(interval);
      }
    };

    return () => {
      clearInterval(interval);
      bc.close();
    };
  }, [tempUser, setTempUser, setUser]);

  return (
    <div className="h-full bg-white flex flex-col justify-center">
      <div className="px-6 flex flex-col items-center text-center">
        <h1 className="text-[28px] font-semibold mt-8 mb-4 px-4">
          Veuillez confirmer votre mail
        </h1>
        <motion.img
          src="https://em-content.zobj.net/source/microsoft-teams/363/incoming-envelope_1f4e8.png"
          alt="Email emoji"
          className="w-40 h-40 my-8"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="text-gray-600 px-4 mb-10">
          Un email de confirmation vient de vous être envoyé. Merci de vérifier
          votre boîte mail et de cliquer sur le lien pour activer votre compte.
        </p>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <Button
          whileTap={{ scale: 0.95 }}
          className={`w-full py-4 rounded-xl font-medium ${
            validated ? "bg-black text-white" : "bg-gray-300 text-gray-500"
          }`}
          onClick={handleNext}
          disabled={!validated}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default ConfirmMail;
