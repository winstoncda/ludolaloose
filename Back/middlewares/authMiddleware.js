const jwt = require("jsonwebtoken");
const User = require("../models/user.schema");

const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès interdit. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.sub).select("-password");
    next();
  } catch (error) {
    console.error("Erreur de token :", error);
    return res
      .status(401)
      .json({ message: "Accès non autorisé. Token invalide." });
  }
};

module.exports = protect;
