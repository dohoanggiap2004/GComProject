const Workspace = require('../app/models/Workspace');
const getUserIdFromToken = require("../utils/getUserIdFromToken");

const checkWorkspaceMember = async (req, res, next) => {
    const workspaceId = req.params.workspaceId || req.body._id || req.query._id;
    const userId = await getUserIdFromToken(req)

    if (!workspaceId) {
        return res.status(400).json({ message: "Workspace ID is required" });
    }

    try {
        const workspace = await Workspace.findById(workspaceId).lean();
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.memberIds.some(id => id.toString() === userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: "You are not authorized to access this workspace" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = checkWorkspaceMember;
