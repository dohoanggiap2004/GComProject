
const User = require("../../app/models/User");
const getUsersService = async () => {
    return User.find().lean();
};

const getUserByIdService = async (userId) => {
    return User.findById(userId).select('-password').lean();
};

const searchUsersService = async (searchValue) => {
    return User.find({
        $or: [
            { fullname: { $regex: searchValue, $options: "i" } },
            { email: { $regex: searchValue, $options: "i" } }
        ]
    })
        .select("_id fullname email")
        .limit(5)
        .lean();
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

module.exports = { getUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService, searchUsersService};
