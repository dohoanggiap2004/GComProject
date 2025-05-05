const {
    getWorkspaceByMemberIdService,
    createWorkspaceService,
    updateWorkspaceService,
    deleteWorkspaceService,
    getWorkspaceByWorkspaceIdService,
    getMemberInBoardsByWorkspaceIdService
} = require("../../../services/apiService/workspaceService");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");
const {countUserWorkspaceService} = require("../../../services/apiService/userService");

class WorkspaceController {

    async getWorkspaceByMemberId(req, res) {
        try {
            const memberId = await getUserIdFromToken(req);
            if(!memberId)
                return res.status(400).json({
                    error: 1,
                    message: 'User information is required'
                });
            const workspace = await getWorkspaceByMemberIdService(memberId);

            if (!workspace) {
                return res.status(200).json({
                    error: 1,
                    message: "Workspace not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: workspace,
                message: "Workspaces retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getWorkspaceByWorkspaceId(req, res) {
        try {
            if (!req?.params?.workspaceId)
                return res.status(400).json({
                    error: 1,
                    message: "Workspace information is required"
                });
            const workspaceId = req.params.workspaceId;
            const result = await getWorkspaceByWorkspaceIdService(workspaceId);

            if (!result) {
                return res.status(200).json({
                    error: 1,
                    message: "Workspace not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Workspace retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getMemberInBoardsByWorkspaceId(req, res) {
        try {
            if (!req?.params?.workspaceId)
                return res.status(400).json({
                    error: 1,
                    message: "Workspace information is required"
                });
            const workspaceId = req.params.workspaceId;
            const result = await getMemberInBoardsByWorkspaceIdService(workspaceId);

            if (!result) {
                return res.status(200).json({
                    error: 1,
                    message: "Workspace not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Members retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async createWorkspace(req, res) {
        try {
            const memberId = await getUserIdFromToken(req);
            if (!req?.body?.name || !memberId)
                return res.status(400).json({
                    error: 1,
                    message: "Workspace information is required"
                });
            const workspace = req.body;
            const existQuantityWorkspace = await countUserWorkspaceService(memberId)
            if (existQuantityWorkspace === undefined) {
                return res.status(400).json({
                    error: 1,
                    message: "Something went wrong with retrieving the number of workspaces."
                });
            }

            if (existQuantityWorkspace === 'unlimited') {
                const newWorkspace = await createWorkspaceService(workspace, memberId);
                return res.status(201).json({
                    error: 0,
                    data: newWorkspace,
                    message: "Workspace created successfully"
                });
            } else if (existQuantityWorkspace >= 5) {
                return res.status(400).json({
                    error: 1,
                    message: "Reached the limitation to create a new workspace"
                });
            }

            const newWorkspace = await createWorkspaceService(workspace, memberId);
            return res.status(201).json({
                error: 0,
                data: newWorkspace,
                message: "Workspace created successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async updateWorkspace(req, res) {
        try {
            if (!req?.body?._id)
                return res.status(400).json({
                    error: 1,
                    message: "Workspace information is required"
                });

            const workspace = req.body;
            const result = await updateWorkspaceService(workspace);

            if (!result) return res.status(200).json({
                error: 1,
                message: "No board changed"
            });

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Workspace updated successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async deleteWorkspace(req, res) {
        try {
            if (!req?.query?._id)
                return res.status(400).json({
                    error: 1,
                    message: "Workspace information is required"
                });

            const id = req.query._id;
            const result = await deleteWorkspaceService(id);

            if (!result) return res.status(200).json({
                error: 1,
                message: "No workspace be deleted"
            });

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Workspace deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new WorkspaceController();
