const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = async (req, res, next) => {
  const { password } = req.body;

  if (Array.isArray(req.body)) {
    try {
      for (let user of req.body) {
        if (!user.password) {
          return res.status(400).json({ message: "Mot de passe requis pour chaque utilisateur" });
        }
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
      next();
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  } else {
    if (!password) {
      return res.status(400).json({ message: "Mot de passe requis" });
    }

    try {
      req.body.password = await bcrypt.hash(password, saltRounds);
      next();
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

exports.comparePassword = async (password, userPassword) => {
  try {
    const result = await bcrypt.compare(password, userPassword);
    return result;
  } catch (error) {
    throw error;
  }
};
