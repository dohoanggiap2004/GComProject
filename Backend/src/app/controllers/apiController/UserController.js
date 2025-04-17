const {
    getUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
    searchUsersService,
    checkUserRoleService, countUserWorkspaceService,
} = require("../../../services/apiService/userService");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");

class UserController {
    async getUsers(req, res) {
        try {
            const users = await getUsersService();

            if (!users) {
                return res.status(200).json({message: "User not found"});
            }

            res.status(200).json({
                data: users,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async getUserById(req, res) {
        try {
            const id = await getUserIdFromToken(req);
            const user = await getUserByIdService(id);

            if (!user) {
                return res.status(200).json({message: "User not found"});
            }

            res.status(200).json({
                data: user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async searchUserByEmailAndName(req, res) {
        try {
            if (!req?.query?.value)
                return res.status(200).json({data: []});

            const {value} = req.query;

            const users = await searchUsersService(value);

            if (!users) {
                return res.status(200).json({
                    data: []
                });
            }

            res.status(200).json({
                data: users,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async createUser(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "User information is required"});

            const user = req.body;
            const newUser = await createUserService(user);

            res.status(201).json({
                newUser: newUser,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async updateUser(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "User information is required"});

            const user = req.body;
            const result = await updateUserService(user);
            //   console.log(result)
            if (!result) return res.status(200).json({message: "No user changed"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async deleteUser(req, res) {
        try {
            if (!req?.query?._id)
                return res.status(400).json({message: "User information is required"});

            const id = req.query._id;
            const result = await deleteUserService(id);
            if (!result) return res.status(200).json({message: "No user be deleted"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async userRoleInWorkspaceOrBoard(req, res) {
        try {
            const { boardId, workspaceId } = req.query;
            const userId = await getUserIdFromToken(req);
            if (!boardId && !workspaceId) {
                return res.status(400).json({ message: "Workspace or board information is required" });
            }

            const roleInfo = await checkUserRoleService(userId, { workspaceId, boardId });

            if (!roleInfo) {
                return res.status(403).json({ message: "You do not have access" });
            }

            return res.status(200).json(roleInfo);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async countUserWorkspaces (req, res) {
        const userId = await getUserIdFromToken(req)
        if (!userId)
            return res.status(400).json({message: "User information is required"});
        try {
            const count = await countUserWorkspaceService(userId);
            res.status(200).json({
                data: count,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };
}

module.exports = new UserController();
