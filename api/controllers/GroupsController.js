const Group = require("../models/GroupModel");
const User = require("../models/UserModel");
const SantaModel = require("../models/SantaModel");

const CreateGroup = async (req, res) => {
  try {
    const { name, max_count } = req.body;

    const user_id = req.user.id;
    console.log("req");

    if (!name || !user_id) {
      return res.status(400).json({ error: "Group name and user ID are required." });
    }

    const newGroup = new Group({
      user_ids: [user_id],
      name: name,
      max_count: max_count || 10,
    });

    await newGroup.save();

    await User.findByIdAndUpdate(user_id, {
      $push: { groups_id: newGroup._id },
    });

    res.status(201).json({ message: "Group created successfully!", group: newGroup });
  } catch (error) {
    res.status(500).json({ error: "Server error while creating group." });
  }
};

const AddUserToGroup = async (req, res) => {
  try {
    const { group_id, user_id } = req.body;

    if (!group_id || !user_id) {
      return res.status(400).json({ error: "group_id and User_id to invite are required." });
    }

    const group = await Group.findById(group_id);

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    if (group.user_ids.includes(user_id) || group.invitation_status.some((inv) => inv.user_id.toString() === user_id)) {
      return res.status(400).json({ error: "User is already in the group or has been invited." });
    }

    group.invitation_status.push({
      user_id: user_id,
    });

    await group.save();

    res.status(200).json({ message: "User invited successfully.", group });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getAllGroupName = async (req, res) => {
  const groups = await Group.find({}, "name -_id");
  res.status(200).json(groups);
};

const getAllGroup = async (req, res) => {
  const groups = await Group.find({});
  res.status(200).json(groups);
};

const getSanta = async (req, res) => {
  try {
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({ message: "groupId requis" });
    }

    const existingSanta = await SantaModel.findOne({ group_id: groupId });

    if (existingSanta) {
      return res.status(400).json({ message: "Les Secret Santa existent déjà pour ce groupe" });
    }

    const group = await Group.findById(groupId).populate("user_ids", "firstName").select("user_ids");

    if (!group || group.user_ids.length === 0) {
      return res.status(404).json({ message: "Groupe non trouvé ou aucun utilisateur" });
    }

    const users = group.user_ids;
    const numUsers = users.length;

    if (numUsers < 2) {
      return res
        .status(400)
        .json({ message: "Le groupe doit contenir au moins deux utilisateurs pour effectuer l'attribution" });
    }

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const isValidAssignment = (users, shuffledUsers) => {
      return !shuffledUsers.some((user, index) => user._id.toString() === users[index]._id.toString());
    };

    let shuffledUsers;
    do {
      shuffledUsers = shuffleArray([...users]);
    } while (!isValidAssignment(users, shuffledUsers));

    const assignments = users.map((user, index) => ({
      from: user._id,
      to: shuffledUsers[index]._id,
    }));

    const santaRecord = new SantaModel({
      assignments,
      group_id: groupId,
    });

    await santaRecord.save();

    res.status(200).json({ message: "Attributions enregistrées", assignments });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { CreateGroup, AddUserToGroup, getAllGroupName, getAllGroup, getSanta };
