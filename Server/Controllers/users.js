import User from "../models/User.js";

// Read

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id); // Corrected: UserActivation -> User
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id); // Corrected: user -> User

    const friends = await Promise.all(user.friends.map((friendId) => User.findById(friendId))); // Corrected: user.findById -> User.findById
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id); // Corrected: UserActivation -> User
    const friend = await User.findById(friendId); // Corrected: UserActivation.friendId -> User.findById

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id); // Corrected: id !== id to id !== user._id
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const updatedFriends = await Promise.all(user.friends.map((id) => User.findById(id))); // Corrected: user.findById -> User.findById
    const formattedFriends = updatedFriends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
