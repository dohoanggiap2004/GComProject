const Board = require('../app/models/Board');
const Workspace = require('../app/models/Workspace');
const getUserIdFromToken = require("../utils/getUserIdFromToken");

const checkReOrderListCardPermission = async (req, res, next) => {
    try {
        const userId = await getUserIdFromToken(req)
        const boardId = req.params.boardId || req.body.boardId || req.query.boardId;

        if (!boardId) return res.status(400).json({ message: 'Board ID is required' });
        const board = await Board.findById(boardId).lean();
        // console.log(board)
        if (!board) return res.status(404).json({ message: 'Board not found' });

        // Tìm thành viên trong board
        const boardMember = board.members.find(member => member.memberId.toString() === userId.toString());

        if (boardMember && boardMember.role === 'admin') {
            return next();
        }

        if (boardMember && boardMember.role === 'member') {
            return next();
        }

        // Nếu không phải admin trong board thì check trong workspace
        const workspace = await Workspace.findById(board.workspaceId).lean();
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        const isWorkspaceMember = workspace.memberIds.some(id => id.toString() === userId.toString());

        if (isWorkspaceMember) {
            return next();
        }

        return res.status(403).json({ message: 'Permission denied' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = checkReOrderListCardPermission;
