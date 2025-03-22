const {
    getWorkspaceByMemberIdService, createWorkspaceService,
    updateWorkspaceService,
    deleteWorkspaceService
} = require("../../../services/apiService/workspaceService");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");

class WorkspaceController {

    async getWorkspaceByMemberId(req, res) {
        try {
            const memberId = await getUserIdFromToken(req, res);
            console.log('check memberId', memberId);
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

    async createWorkspace(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Workspace information is required"});
            const memberId = await getUserIdFromToken(req, res);
            const workspace = req.body;
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
            if (!result) return res.status(200).json({message: "No workspace be deleted"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

}

module.exports = new WorkspaceController();
