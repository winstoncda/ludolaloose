const mongoose = require("mongoose");
const User = require("../models/user.schema");
const TempUser = require("../models/tempuser.schema");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendValidationAccount,
  sendInvalidEmailToken,
} = require("../email/email");

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;

// 🔐 Génère un token JWT signé avec email + tokenId (UUID)
const createEmailToken = (email, tokenId) => {
  return jwt.sign({ email, tokenId }, SECRET_KEY, { expiresIn: "15m" });
};

// 📩 Étape 1 - Inscription (signup)
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Champs requis manquants." });
    }

    // Vérifie si utilisateur déjà confirmé (email ou username)
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) {
      // Message RGPD friendly : pas de détail sur le champ en conflit
      return res.status(400).json({
        success: false,
        message:
          "Les identifiants fournis sont déjà utilisés. Veuillez en choisir d’autres.",
      });
    }

    // Vérifie si compte temporaire existe déjà (email ou username)
    const tempUserExists = await TempUser.findOne({
      $or: [{ email }, { username }],
    });
    if (tempUserExists) {
      return res.status(400).json({
        success: false,
        message:
          "Les identifiants fournis sont déjà utilisés. Veuillez en choisir d’autres ou vérifier votre boîte mail.",
      });
    }

    // Génère un tokenId UUID
    const tokenId = uuidv4();

    // Crée le token JWT (email + tokenId)
    const token = createEmailToken(email, tokenId);

    // Envoie email de confirmation avec token JWT
    await sendConfirmationEmail(email, token);

    // Crée un compte temporaire (avec tokenId et mot de passe hashé dans le modèle)
    const tempUser = new TempUser({ username, email, password, tokenId });
    await tempUser.save();

    return res.status(201).json({
      success: true,
      message: "Confirmation envoyée. Consultez votre boîte mail.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

// ✅ Vérification email depuis le lien de confirmation
const verifyMail = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.redirect(`${CLIENT_URL}/register?message=error`);
    }

    // Décode et vérifie le token JWT
    const decoded = jwt.verify(token, SECRET_KEY);
    const { email, tokenId } = decoded;

    // Recherche compte temporaire correspondant à email + tokenId
    const tempUser = await TempUser.findOne({ email, tokenId });
    if (!tempUser) {
      return res.redirect(`${CLIENT_URL}/register?message=error`);
    }

    // Vérifie qu'aucun utilisateur final n'existe déjà
    const existingUser = await User.findOne({ email: tempUser.email });
    if (existingUser) {
      await tempUser.deleteOne();
      return res.redirect(`${CLIENT_URL}/register?message=alreadyRegistered`);
    }

    // Crée utilisateur final avec les infos temporaires
    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
    });
    await newUser.save();

    // Supprime le compte temporaire
    await tempUser.deleteOne();

    // Envoie mail de validation
    await sendValidationAccount(newUser.email);

    // Envoi d’une page HTML simple avec message de succès et BroadcastChannel
    return res.send(`<!DOCTYPE html>
<html><head><title>Email confirmé</title></head>
<body>
  <h2>Email confirmé ✅</h2>
  <p>Vous pouvez revenir sur votre onglet précédent.</p>
  <script>
    const bc = new BroadcastChannel("mail_verification_channel");
    bc.postMessage(${JSON.stringify({
      verified: true,
      userId: newUser._id.toString(),
    })});
    bc.close();
  </script>
</body>
</html>`);
  } catch (err) {
    console.error("Email verification error:", err);

    // En cas de token invalide ou expiré
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      // Pas d’info supplémentaire exposée côté client
      return res.redirect(`${CLIENT_URL}/register?message=error`);
    }

    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

// 👀 Vérifie si un email est déjà validé
const checkEmailValidation = async (req, res) => {
  const { email } = req.query;
  if (!email)
    return res.status(400).json({ validated: false, message: "Email requis." });

  try {
    const user = await User.findOne({ email });
    return res.json({
      validated: !!user,
      userId: user ? user._id : null,
    });
  } catch (err) {
    console.error("Check email validation error:", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

// 🧑‍⚕️ Mise à jour des données optionnelles utilisateur
const updateOptionalUserData = async (req, res) => {
  try {
    const { userId, ...fields } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "ID invalide." });
    }

    const allowedFields = [
      "gender",
      "age",
      "height",
      "heightUnit",
      "currentWeight",
      "currentWeightUnit",
      "goalWeight",
      "goalWeightUnit",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (fields[field] !== undefined) updates[field] = fields[field];
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Profil mis à jour.", user });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Champs requis manquants." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Identifiants incorrects." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Identifiants incorrects." });
    }

    const token = jwt.sign({ sub: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // ✅ Send the token in a secure, httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

// ✅ Récupération de l’utilisateur connecté (via middleware)
const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user || null);
  } catch (error) {
    res.status(400).json(null);
  }
};

module.exports = {
  signup,
  verifyMail,
  checkEmailValidation,
  updateOptionalUserData,
  login,
  currentUser,
};
