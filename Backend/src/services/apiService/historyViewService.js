const Board = require('../../app/models/Board');
const HistoryView = require('../../app/models/HistoryView');

const getBoardsInHistoryViewByUserIdService = async (userId) => {
    const historyView = await HistoryView.findOne({ userId }).lean();

    if (!historyView || !historyView.boardIds.length) {
        return [];
    }

    const allBoards = await Board.find({
        _id: { $in: historyView.boardIds }
    })
        .select('title background')
        .lean();

    if (!allBoards.length) {
        return [];
    }

    const boardMap = {};
    allBoards.forEach(board => {
        boardMap[board._id.toString()] = board;
    });

    const orderedBoards = historyView.boardIds
        .map(id => boardMap[id.toString()])
        .filter(board => board);

    return orderedBoards;
}

const createHistoryViewService = async (userId, boardId) => {
    const historyView = await HistoryView.findOne({userId}).lean()
    if(!historyView){
        const newHistoryView = new HistoryView({
            userId,
            boardIds: [boardId],
        });
        await newHistoryView.save()
        return getBoardsInHistoryViewByUserIdService(userId);
    }else{
        return updateHistoryViewService(userId, boardId)
    }

}

const updateHistoryViewService = async (userId, boardId) => {
    const historyView = await HistoryView.findOne({userId});

    if (!historyView) {
        return null;
    }

    let updatedBoardIds = [...historyView.boardIds];

    updatedBoardIds = updatedBoardIds.filter(id =>
        id.toString() !== boardId.toString()
    );

    updatedBoardIds.push(boardId);

    if (updatedBoardIds.length > 10) {
        updatedBoardIds.shift();
    }

    const updatedHisView = await HistoryView.findByIdAndUpdate(
        historyView._id,
        { $set: { boardIds: updatedBoardIds } },
        { new: true }
    ).lean();

    return getBoardsInHistoryViewByUserIdService(updatedHisView.userId);
}

module.exports = {
    getBoardsInHistoryViewByUserIdService,
    createHistoryViewService,
}
