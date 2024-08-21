const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token != undefined) {
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(token, jwtKey, (error, decoded) => {
          if (error) {
            reject(error);
          } else {
            resolve(decoded);
          }
        });
      });
      req.user = payload;

      next();
    } else {
      res.status(403).json({ message: "Accès interdit: token manquant" });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Accès interdit: token invalide" });
  }
};

exports.checkRole = async (req, res, next) => {
  if (req.user.admin) {
    res.status(200);
    next();
  } else {
    res.status(500).json({ message: "Vous n'avez pas les droits d'accept" });
  }
};
