const User = require("../../app/models/User");
const Workspace = require("../../app/models/Workspace");
const Board = require("../../app/models/Board");

const getUsersService = async () => {
    return User.find().select('-password').lean();
};

const getUserByIdService = async (userId) => {
    return User.findById(userId).select('-password').lean();
};

const searchUsersService = async (searchValue) => {
    return User.find({
        $or: [
            {fullname: {$regex: searchValue, $options: "i"}},
            {email: {$regex: searchValue, $options: "i"}}
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
    const {_id, ...updateFields} = user;
    return User.findByIdAndUpdate
    (
        _id,
        {$set: updateFields},
        {new: true}
    ).lean();
};

const deleteUserService = async (id) => {
    return User.findByIdAndDelete(id).lean();
};

const checkUserRoleService = async (userId, {workspaceId, boardId}) => {
    if (!userId) throw new Error('User ID is required');

    // Ưu tiên kiểm tra workspace nếu có
    if (workspaceId) {
        const workspace = await Workspace.findById(workspaceId).lean();
        if (!workspace) return null;

        const memberId = workspace.memberIds.find(memberId => memberId.toString() === userId.toString());
        if (memberId) {
            return {
                role: 'workspaceMember',
            };
        }
    }

    // Nếu không có workspace, kiểm tra trong board
    if (boardId) {
        const board = await Board.findById(boardId).lean();
        if (!board) return null;

        const member = board.members.find(m => m.memberId.toString() === userId.toString());

        if (member) {
            return {
                role: member.role,
            };
        }

        const workspace = await Workspace.findById(board.workspaceId).lean();
        if (!workspace) return null;

        const memberId = workspace.memberIds.find(memberId => memberId.toString() === userId.toString());
        if (memberId) {
            return {
                role: 'workspaceMember',
            };
        }
    }

    return null;
};

const countUserWorkspaceService = async (userId) => {
    const user = await User.findById(userId).lean()
    if (user.service === 'premium') {
        return 'unlimited'
    }
    return Workspace.countDocuments({"memberIds": userId})
}


module.exports = {
    getUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
    searchUsersService,
    checkUserRoleService,
    countUserWorkspaceService,
};
