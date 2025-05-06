import { useState, useEffect } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { debounce } from 'lodash';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import NavbarWorkspace from "../components/Workspace/Navbar/Navbar-Workspace.jsx";
import SidebarBoard from "../components/Board/SidebarBoard.jsx";
import NavbarBoard from "../components/Board/Navbar/NavbarBoard.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    createCard,
    createList,
    getBoardByBoardId,
    updateCardIndex,
    updateCard, updateListIndex,
} from "../store/actions/boardAction.jsx";
import SortableList from "../components/Board/SortableItem/SortableList.jsx";
import {getWorkspaceByWorkspaceId} from "../store/actions/workspaceAction.jsx";
import {createHistoryView} from "../store/actions/historyviewAction.jsx";

function BoardWorkspace() {
    const { boardId } = useParams();
    const dispatch = useDispatch();
    const { board } = useSelector((state) => state.board);
    const { role } = useSelector(state => state.user)
    const [isAddingList, setIsAddingList] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [tempBoard, setTempBoard] = useState(null);
    const [reCardInfo, setReCardInfo] = useState(null);
    const [reListInfo, setReListInfo] = useState(null);

    useEffect(() => {
        if(boardId !== null){
            dispatch(getBoardByBoardId(boardId));
            dispatch(createHistoryView({
                boardId: boardId,
            }))
        }
    }, [boardId]);

    useEffect(() => {
        if(board?.workspaceId !== null){
            dispatch(getWorkspaceByWorkspaceId(board?.workspaceId));
        }
    }, [board]);

    const handleAddCard = (listId, content) => {
        const newCard = { title: content, listId, boardId };
        dispatch(createCard(newCard));
    };

    const handleAddList = (e) => {
        e.preventDefault();
        const payload = { boardId, title: listTitle };
        dispatch(createList(payload));
        setIsAddingList(false);
        setListTitle('');
    };

    const handleToggleCheck = (isCompleted, _id, listId) => {
        const newCard = {
            boardId,
            listId, _id,
            isCompleted: !isCompleted,
            completedAt: !isCompleted ? new Date() : null
        };
        dispatch(updateCard(newCard));
    };

    useEffect(() => {
        if (board && Array.isArray(board.lists)) {
            setTempBoard({
                ...board,
                lists: board.lists.map((list) => ({
                    ...list,
                    cards: [...list.cards],
                })),
            });
        }
    }, [board]);

    const findCardPosition = (lists, cardId) => {
        for (const list of lists) {
            const index = list.cards.findIndex((card) => card._id === cardId);
            if (index !== -1) {
                return { listId: list._id, cardIndex: index };
            }
        }
        return null;
    };

    const debouncedHandleDragOver = debounce((event) => {
        const { active, over } = event;
        if (!over || !tempBoard) return;

        const activeId = active.id;
        const overId = over.id;

        const isDraggingList = tempBoard.lists.some((list) => list._id === activeId);

        if (isDraggingList) {
            const activeIndex = tempBoard.lists.findIndex((list) => list._id === activeId);
            const overIndex = tempBoard.lists.findIndex((list) => list._id === overId);

            if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

            const newBoard = { ...tempBoard, lists: [...tempBoard.lists] };
            const [movedList] = newBoard.lists.splice(activeIndex, 1);
            newBoard.lists.splice(overIndex, 0, movedList);
            setTempBoard(newBoard);
        } else {
            const sourceList = tempBoard.lists.find((list) =>
                list.cards.some((card) => card._id === activeId)
            );
            if (!sourceList) return;

            let destList = tempBoard.lists.find((list) => list._id === overId);
            if (!destList) {
                destList = tempBoard.lists.find((list) =>
                    list.cards.some((card) => card._id === overId)
                );
            }
            if (!destList) return;

            const newBoard = {
                ...tempBoard,
                lists: tempBoard.lists.map((list) => ({
                    ...list,
                    cards: [...list.cards],
                })),
            };

            if (sourceList._id === destList._id) {
                const newList = newBoard.lists.find((list) => list._id === sourceList._id);
                const activeIndex = newList.cards.findIndex((card) => card._id === activeId);
                const overIndex = newList.cards.findIndex((card) => card._id === overId);
                if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

                const [movedCard] = newList.cards.splice(activeIndex, 1);
                newList.cards.splice(overIndex, 0, movedCard);
            } else {
                const newSourceList = newBoard.lists.find((list) => list._id === sourceList._id);
                const newDestList = newBoard.lists.find((list) => list._id === destList._id);
                const activeIndex = newSourceList.cards.findIndex((card) => card._id === activeId);
                let overIndex = newDestList.cards.findIndex((card) => card._id === overId);
                if (overIndex === -1) overIndex = newDestList.cards.length;

                const [movedCard] = newSourceList.cards.splice(activeIndex, 1);
                newDestList.cards.splice(overIndex, 0, movedCard);
            }
            setTempBoard(newBoard);
        }
    }, 16);

    const handleDragOver = (event) => {
        debouncedHandleDragOver(event);
    };

    const handleDragEnd = (event) => {
        const { active } = event;
        if (!tempBoard || !board) return;

        const activeId = active.id;
        const isDraggingList = board.lists.some((list) => list._id === activeId);

        if (isDraggingList) {
            const sourceIndex = board.lists.findIndex((list) => list._id === activeId);
            const destIndex = tempBoard.lists.findIndex((list) => list._id === activeId);

            if (sourceIndex !== destIndex) {
                const newReorderInfo = {
                    boardId,
                    sourceIndex,
                    destIndex,
                };
                setReListInfo(newReorderInfo);
            }
        } else {
            const destPosition = findCardPosition(tempBoard.lists, activeId);
            if (!destPosition) return;
            const { listId: destListId, cardIndex: destCardIndex } = destPosition;

            const sourcePosition = findCardPosition(board.lists, activeId);
            if (!sourcePosition) return;
            const { listId: sourceListId, cardIndex: sourceCardIndex } = sourcePosition;

            const newReorderInfo = {
                boardId,
                sourceListId,
                destListId,
                sourceCardIndex,
                destCardIndex,
            };
            setReCardInfo(newReorderInfo);
        }
    };

    useEffect(() => {
        if (reCardInfo) {
            dispatch(updateCardIndex(reCardInfo));
            setReCardInfo(null);
        }
    }, [reCardInfo, dispatch]);

    useEffect(() => {
        if (reListInfo) {
            dispatch(updateListIndex(reListInfo));
            setReListInfo(null);
        }
    }, [reListInfo, dispatch]);

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar cố định trên cùng */}
            <div className="shrink-0 bg-gray-200">
                <NavbarWorkspace />
            </div>

            {/* Phần dưới: chia 2 cột (Sidebar trái - Nội dung phải) */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 shrink-0 border-r-2 border-gray-200 hidden md:flex">
                    <SidebarBoard/>
                </div>

                {/* Nội dung bên phải */}
                <div
                    className="flex-1 flex flex-col overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url(${board?.background})` }}
                >
                    <div className="shrink-0">
                        <NavbarBoard/>
                    </div>

                    {/* Vùng board (màu hồng) chiếm toàn bộ không gian còn lại, cuộn ngang */}
                    <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={tempBoard?.lists?.map((list) => list._id) || []}
                                strategy={horizontalListSortingStrategy}
                            >

                                <div className="flex space-x-4 min-w-max items-start">
                                    {/* Hiển thị các list */}
                                    {tempBoard?.lists?.length > 0 &&
                                        tempBoard.lists.map((list) => (
                                            <SortableList
                                                key={list._id}
                                                list={list}
                                                cards={list.cards}
                                                onToggleCheck={handleToggleCheck}
                                                onAddCard={handleAddCard}
                                                boardId={boardId}
                                                className="w-64 shrink-0"
                                            />
                                        ))}

                                    {/* Form / button thêm list mới */}
                                    {role !== 'viewer' && (
                                        isAddingList ? (
                                        <div className="bg-gray-200 p-2 rounded-lg h-fit w-64 shrink-0">
                                            <input
                                                type="text"
                                                value={listTitle}
                                                onChange={(e) => setListTitle(e.target.value)}
                                                placeholder="Enter a list name"
                                                className="w-full p-1 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:border-blue-500"
                                            />
                                            <div className="flex space-x-2 mt-2">

                                                <button
                                                    onClick={handleAddList}
                                                    className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 text-sm font-semibold"
                                                >
                                                    Add list
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsAddingList(false);
                                                        setListTitle('');
                                                    }}
                                                    className="text-gray-500 hover:bg-gray-300 p-1 px-2 rounded-md"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="p-2 text-gray-700 rounded-lg hover:bg-gray-400 h-fit w-64 shrink-0 text-start text-sm font-semibold"
                                            onClick={() => setIsAddingList(true)}
                                        >
                                            + Add another list
                                        </button>
                                        )
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default BoardWorkspace;
