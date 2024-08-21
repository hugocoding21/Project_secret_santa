const { comparePassword } = require("../middlewares/hashPassword");
const Group = require("../models/GroupModel");
const SantaModel = require("../models/SantaModel");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const users = req.body;
  if (Array.isArray(req.body)) {
    for (const user of users) {
      const { email, password, firstName, lastName, year, gender } = user;

      if (!email || !password || !firstName || !lastName || !year || gender === undefined) {
        return res.status(400).json({ message: "Entrer tous les champs requis pour chaque utilisateur" });
      }
    }
    try {
      const newUsers = await User.insertMany(users);
      res.status(201).json(newUsers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  } else {
    const { email, password, firstName, lastName, year, gender } = req.body;

    if (!email || !password || !firstName || !lastName || !year || gender === undefined) {
      return res.status(400).json({ message: "Entrer tous les champs requis" });
    }

    try {
      const newUser = await new User(req.body).save();
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur server" });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passeword requis" });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Invalide email ou mot de passe" });
    }
    const isCorrect = await comparePassword(password, user.password);

    if (isCorrect) {
      const userData = {
        id: user._id,
        email: user.email,
        admin: user.admin,
      };
      const token = await jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "10h" });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Email ou mot de passe invalide" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur server" });
  }
};

const getAll = async (req, res) => {
  try {
    let groups = await Group.find({});
    res.status(200).json(groups);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Erreur server" });
  }
};

const handleInvitation = async (req, res) => {
  const { groupId } = req.params;
  const { status: newStatus } = req.body;
  const userId = req.user.id;

  try {
    let group;

    /* Refused invitation */
    if (newStatus === false) {
      group = await Group.findOneAndUpdate(
        { _id: groupId, "invitation_status.user_id": userId },
        { $set: { "invitation_status.$.status": newStatus } },
        { new: true }
      );
    }

    /* Accepted invitation */
    if (newStatus === true) {
      group = await Group.findOneAndUpdate(
        { _id: groupId, "invitation_status.user_id": userId },
        {
          $set: { "invitation_status.$.status": newStatus },
          $addToSet: { user_ids: userId },
        },
        { new: true }
      );
    }

    if (!group) {
      return res.status(404).json({ message: "Groupe ou invitation non trouvée" });
    }

    res.status(200).json({ message: "Statut de l'invitation mis à jour", group });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getMySanta = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({ message: "groupId requis" });
    }

    const santaRecord = await SantaModel.findOne({ group_id: groupId, "assignments.from": userId })
      .populate("assignments.to", "firstName lastName -_id")
      .select("assignments");

    if (!santaRecord) {
      return res.status(404).json({ message: "Vous n'avez pas de santa" });
    }

    const mySanta = santaRecord.assignments[0].to;

    res.status(200).json({
      message: `Votre Secret Santa est ${mySanta.firstName} ${mySanta.lastName}`,
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { register, login, handleInvitation, getAll, getMySanta };
