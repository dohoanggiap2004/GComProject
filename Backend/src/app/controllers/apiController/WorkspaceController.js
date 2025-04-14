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
            // console.log('check memberId', memberId);
            const workspace = await getWorkspaceByMemberIdService(memberId);

            if (!workspace) {
                return res.status(200).json({message: "Workspace not found"});
            }

            res.status(200).json({
                data: workspace,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async getWorkspaceByWorkspaceId(req, res) {
        try {
            if (!req?.params?.workspaceId)
                return res.status(400).json({message: "Workspace information is required"});
            const workspaceId = req.params.workspaceId;
            const result = await getWorkspaceByWorkspaceIdService(workspaceId);

            if (!result) {
                return res.status(200).json({message: "Workspace not found"});
            }

            res.status(200).json({
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async getMemberInBoardsByWorkspaceId(req, res) {
        try {
            if (!req?.params?.workspaceId)
                return res.status(400).json({message: "Workspace information is required"});
            const workspaceId = req.params.workspaceId;
            const result = await getMemberInBoardsByWorkspaceIdService(workspaceId);

            if (!result) {
                return res.status(200).json({message: "Workspace not found"});
            }

            res.status(200).json({
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async createWorkspace(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Workspace information is required"});
            const memberId = await getUserIdFromToken(req);
            const workspace = req.body;
            const existQuantityWorkspace = await countUserWorkspaceService(memberId)
            if (existQuantityWorkspace === undefined) {
                return res.status(400).json({message: "Something went wrong with retrieving the number of workspaces."});
            }

            if (existQuantityWorkspace === 'unlimited') {
                const newWorkspace = await createWorkspaceService(workspace, memberId);
                return res.status(201).json({
                    newWorkspace: newWorkspace,
                });
            } else if (existQuantityWorkspace >= 5) {
                return res.status(400).json({message: "Reached the limitation to create a new workspace"});
            }

            const newWorkspace = await createWorkspaceService(workspace, memberId);
            res.status(201).json({
                newWorkspace: newWorkspace,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async updateWorkspace(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Workspace information is required"});

            const workspace = req.body;
            const result = await updateWorkspaceService(workspace);
            console.log(result)
            if (!result) return res.status(200).json({message: "No board changed"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async deleteWorkspace(req, res) {
        try {
            if (!req?.query)
                return res.status(400).json({message: "Workspace information is required"});

            const id = req.query._id;
            const result = await deleteWorkspaceService(id);
            console.log('check res', result)
            if (!result) return res.status(200).json({message: "No workspace be deleted"});

            res.status(200).json({
                result: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

}

module.exports = new WorkspaceController();
