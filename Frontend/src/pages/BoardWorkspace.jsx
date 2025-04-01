import { useState, useEffect } from 'react';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { debounce } from 'lodash';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import NavbarWorkspace from "../components/Navbar/Navbar-Workspace.jsx";
import SidebarBoard from "../components/Sidebar/SidebarBoard.jsx";
import HeaderBoard from "../components/Header/HeaderBoard.jsx";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    createCard,
    createList,
    getBoardByBoardId,
    getBoardByWorkspaceId,
    updateCardIndex,
    updateCard, updateListIndex,
} from "../store/actions/boardAction.js";
import SortableList from "../components/SortableItem/SortableList.jsx";

function BoardWorkspace() {
    const location = useLocation();
    const workspaceName = location.state?.workspaceName || "Default Title";
    const workspaceId = location.state?.workspaceId || "Default Title";
    const { boardId } = useParams();
    const dispatch = useDispatch();
    const { board } = useSelector((state) => state.board);
    const [isAddingList, setIsAddingList] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [tempBoard, setTempBoard] = useState(null);
    const [reCardInfo, setReCardInfo] = useState(null);
    const [reListInfo, setReListInfo] = useState(null);

    useEffect(() => {
        dispatch(getBoardByWorkspaceId(workspaceId));
    }, [workspaceId, dispatch]);

    useEffect(() => {
        dispatch(getBoardByBoardId(boardId));
    }, [boardId, dispatch]);

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
        const newCard = { boardId, listId, _id, isCompleted: !isCompleted };
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
            <div className="flex-shrink-0 bg-gray-200">
                <NavbarWorkspace />
            </div>

            {/* Phần dưới: chia 2 cột (Sidebar trái - Nội dung phải) */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-72 flex-shrink-0 bg-gray-100 hidden md:flex">
                    <SidebarBoard workspaceName={workspaceName} workspaceId={workspaceId} />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex-1 flex flex-col bg-pink-300 overflow-hidden">
                    {/* HeaderBoard cố định ở đầu nội dung */}
                    <div className="flex-shrink-0 bg-gray-100 border-b">
                        <HeaderBoard workspaceId={workspaceId || 'default'} />
                    </div>

                    {/* Vùng board (màu hồng) chiếm toàn bộ không gian còn lại, cuộn ngang */}
                    <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={tempBoard?.lists?.map((list) => list._id) || []}
                                strategy={horizontalListSortingStrategy}
                            >
                                {/* Thêm min-w-max ở đây */}
                                <div className="flex space-x-4 min-w-max">
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
                                                // Mỗi list có chiều rộng cố định, để khi nhiều list thì cuộn ngang
                                                className="w-72 flex-shrink-0"
                                            />
                                        ))}

                                    {/* Form / button thêm list mới */}
                                    {isAddingList ? (
                                        <div className="bg-pink-400 p-2 rounded-lg hover:bg-pink-500 h-fit w-72 flex-shrink-0">
                                            <input
                                                type="text"
                                                value={listTitle}
                                                onChange={(e) => setListTitle(e.target.value)}
                                                placeholder="Enter a title or paste a link"
                                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                            />
                                            <div className="flex space-x-2 mt-2">
                                                <button
                                                    onClick={handleAddList}
                                                    className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                                                >
                                                    Add list
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsAddingList(false);
                                                        setListTitle('');
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="bg-pink-400 text-white p-2 rounded-lg hover:bg-pink-500 h-fit w-72 flex-shrink-0 text-start"
                                            onClick={() => setIsAddingList(true)}
                                        >
                                            + Add a list
                                        </button>
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
