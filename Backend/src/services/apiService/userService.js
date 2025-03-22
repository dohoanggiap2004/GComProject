
const User = require("../../app/models/User");
const getUsersService = async () => {
    return User.find();
};

const getUserByIdService = async (userId) => {
    return User.findById(userId);
};

const createUserService = async (user) => {
    const newUser = new User(user);
    return await newUser.save();
};

const updateUserService = async (user) => {
    const { _id, ...updateFields } = user;
    return User.findByIdAndUpdate(_id, updateFields, {new: true});
};

const deleteUserService = async (id) => {
    return User.findByIdAndDelete(id);
};

module.exports = { getUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService, };
