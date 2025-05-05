const {
    getUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
    searchUsersService,
    checkUserRoleService,
    countUserWorkspaceService,
} = require("../../../services/apiService/userService");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");

class UserController {
    async getUsers(req, res) {
        try {
            const users = await getUsersService();

            if (!users) {
                return res.status(404).json({
                    error: 1,
                    message: "Users not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: users,
                message: "Users retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getUserById(req, res) {
        try {
            const id = await getUserIdFromToken(req);
            if (!id) {
                return res.status(400).json({
                    error: 1,
                    message: "User ID is required"
                });
            }

            const user = await getUserByIdService(id);

            if (!user) {
                return res.status(404).json({
                    error: 1,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: user,
                message: "User retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async searchUserByEmailAndName(req, res) {
        try {
            if (!req?.query?.value) {
                return res.status(200).json({
                    error: 0,
                    data: [],
                    message: "No search query provided"
                });
            }

            const { value } = req.query;
            const users = await searchUsersService(value);

            if (!users) {
                return res.status(200).json({
                    error: 0,
                    data: [],
                    message: "No users found matching search criteria"
                });
            }

            return res.status(200).json({
                error: 0,
                data: users,
                message: "Users search completed successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async createUser(req, res) {
        try {
            if (!req?.body) {
                return res.status(400).json({
                    error: 1,
                    message: "User information is required"
                });
            }

            const user = req.body;
            const newUser = await createUserService(user);

            return res.status(201).json({
                error: 0,
                data: newUser,
                message: "User created successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async updateUser(req, res) {
        try {
            if (!req?.body) {
                return res.status(400).json({
                    error: 1,
                    message: "User information is required"
                });
            }

            const user = req.body;
            const result = await updateUserService(user);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "User updated successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async deleteUser(req, res) {
        try {
            if (!req?.query?._id) {
                return res.status(400).json({
                    error: 1,
                    message: "User ID is required"
                });
            }

            const id = req.query._id;
            const result = await deleteUserService(id);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "User deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async userRoleInWorkspaceOrBoard(req, res) {
        try {
            const { boardId, workspaceId } = req.query;
            const userId = await getUserIdFromToken(req);

            if ((!boardId && !workspaceId) || !userId) {
                return res.status(400).json({
                    error: 1,
                    message: "Workspace/Board ID and User ID are required"
                });
            }

            const roleInfo = await checkUserRoleService(userId, { workspaceId, boardId });

            if (!roleInfo) {
                return res.status(403).json({
                    error: 1,
                    message: "You do not have access"
                });
            }

            return res.status(200).json({
                error: 0,
                data: roleInfo,
                message: "User role retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async countUserWorkspaces(req, res) {
        try {
            const userId = await getUserIdFromToken(req);
            if (!userId) {
                return res.status(400).json({
                    error: 1,
                    message: "User ID is required"
                });
            }

            const count = await countUserWorkspaceService(userId);

            return res.status(200).json({
                error: 0,
                data: count,
                message: "Workspace count retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new UserController();
