import { useState, useEffect } from 'react';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    updateCard
} from "../store/actions/boardAction.js";
import {reorderCards} from "../store/reducers/boardReducer.js";

// Component cho card
const SortableCard = ({ card, onToggleCheck }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card._id,
    });

    const style = {
        transform: isDragging ? `${CSS.Transform.toString(transform)} rotate(5deg)` : CSS.Transform.toString(transform),
        transition: transition || 'transform 200ms ease',
        opacity: isDragging ? 0.6 : 1,
    };

    const handleToggleCheck = (e) => {
        e.stopPropagation(); // Ngăn sự kiện lan truyền nếu cần
        onToggleCheck();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`relative bg-white p-2 mb-2 text-sm rounded-lg shadow-md hover:border-2 hover:border-cyan-500 ${
                isDragging ? 'shadow-lg' : 'shadow-sm'
            } flex items-center`}
        >
            {/* Checkbox không bị ảnh hưởng bởi listeners */}
            <span className="mr-2 cursor-pointer z-40" onClick={handleToggleCheck}>
                {card.isCompleted ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                )}
            </span>

            {/* Phần kéo-thả chỉ áp dụng cho tiêu đề */}
            <span className="flex-1 cursor-grab" {...listeners}>
                {card.title}
            </span>

            {/* Các nút hành động */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2v1h8V5a2 2 0 00-2-2z"
                        />
                    </svg>
                </span>
                <span className="cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                        />
                    </svg>
                </span>
            </div>
        </div>
    );
};

// Component cho list
const SortableList = ({ list, cards, onToggleCheck, onAddCard }) => {
    const { setNodeRef } = useSortable({ id: list._id });
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardContent, setNewCardContent] = useState('');

    const handleAddCardClick = () => {
        setIsAddingCard(true);
    };

    const handleAddCardSubmit = () => {
        if (newCardContent.trim()) {
            onAddCard(list._id, newCardContent);
            setNewCardContent('');
            setIsAddingCard(false);
        }
    };

    const handleCancelAddCard = () => {
        setNewCardContent('');
        setIsAddingCard(false);
    };

    return (
        <div ref={setNodeRef} className="bg-gray-100 px-4 py-3 w-72 rounded-lg">
            <h3 className="text-md font-bold text-gray-700 mb-2">{list.title}</h3>
            <SortableContext items={cards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
                {Array.isArray(cards) && cards.length > 0 && cards.map((card) => (
                    <SortableCard key={card._id} card={card} onToggleCheck={() => onToggleCheck(card.isCompleted, card._id, list._id)} />
                ))}
            </SortableContext>
            {isAddingCard ? (
                <div className="mt-2">
                    <input
                        type="text"
                        value={newCardContent}
                        onChange={(e) => setNewCardContent(e.target.value)}
                        placeholder="Enter a title or paste a link"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex space-x-2 mt-2">
                        <button
                            onClick={handleAddCardSubmit}
                            className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                        >
                            Add card
                        </button>
                        <button
                            onClick={handleCancelAddCard}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleAddCardClick}
                    className="text-gray-700 hover:bg-gray-300 w-full p-1 rounded-md shadow-md text-start mt-2"
                >
                    + Add a card
                </button>
            )}
        </div>
    );
};

// Component chính
function BoardWorkspace() {
    const location = useLocation();
    const workspaceName = location.state?.workspaceName || "Default Title";
    const workspaceId = location.state?.workspaceId || "Default Title";
    const { boardId } = useParams();
    const dispatch = useDispatch();
    const { board } = useSelector((state) => state.board);
    const [isAddingList, setIsAddingList] = useState(false);
    const [listTitle, setListTitle] = useState("");

    useEffect(() => {
        dispatch(getBoardByWorkspaceId(workspaceId));
    }, [workspaceId, dispatch]);

    useEffect(() => {
        dispatch(getBoardByBoardId(boardId));
    }, [boardId, dispatch]);

    useEffect(() => {
        console.log('check board', board)
    }, [board]);

    const handleAddCard = (listId, content) => {
        const newCard = {
            title: content,
            listId: listId,
            boardId: boardId,
        };
        dispatch(createCard(newCard));
    };

    const handleToggleCheck = (isCompleted, _id, listId) => {
        const newCard = {
            boardId: boardId,
            listId: listId,
            _id: _id,
            isCompleted: !isCompleted,
        }
        dispatch(updateCard(newCard));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        let sourceListId = null;
        let sourceCardIndex = -1;

        // Vì board.lists là một mảng, duyệt qua từng list để tìm card được kéo
        board.lists.forEach((list) => {
            const idx = list.cards.findIndex((card) => card._id === activeId);
            if (idx !== -1) {
                sourceListId = list._id;
                sourceCardIndex = idx;
            }
        });

        if (!sourceListId) return;

        let destListId = null;
        let destCardIndex = -1;

        // Nếu over.id trùng với list _id
        const overList = board.lists.find((list) => list._id === overId);
        if (overList) {
            destListId = overList._id;
            destCardIndex = overList.cards.length;
        } else {
            // Nếu không, tìm card trong các list
            board.lists.forEach((list) => {
                const idx = list.cards.findIndex((card) => card._id === overId);
                if (idx !== -1) {
                    destListId = list._id;
                    destCardIndex = idx;
                }
            });
        }

        if (!destListId) return;

        // Dispatch action để cập nhật vị trí card
        dispatch(reorderCards({ sourceListId, destListId, sourceCardIndex, destCardIndex }));
    };

    const handleAddList = (e) => {
        e.preventDefault();
        const payload = {
            boardId: boardId,
            title: listTitle,
        }
        dispatch(createList(payload));
        setIsAddingList(false)
    }

    return (
        <>
            <NavbarWorkspace />
            <div className={'flex'}>
                <SidebarBoard workspaceName={workspaceName} workspaceId={workspaceId} />
                <div className={'w-full'}>
                    <HeaderBoard />
                    <div className="min-h-screen bg-pink-300 p-4 w-full">
                        <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
                            <div className="flex space-x-4 overflow-x-auto">
                                {board && Array.isArray(board.lists) && board.lists.length > 0 && Object.entries(board.lists).map(([listId, list]) => (
                                    <SortableList
                                        key={listId}
                                        list={list}
                                        cards={list.cards}
                                        onToggleCheck={handleToggleCheck}
                                        onAddCard={handleAddCard}
                                    />
                                ))}
                                {isAddingList ? (
                                    <div className="bg-pink-400 p-2 rounded-lg hover:bg-pink-500 h-full w-72">
                                        <input
                                            type="text"
                                            value={listTitle}
                                            onChange={(e) => setListTitle(e.target.value)}
                                            placeholder="Enter a title or paste a link"
                                            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                        />
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={(e) => handleAddList(e)}
                                                className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                                            >
                                                Add list
                                            </button>
                                            <button
                                                onClick={() => {setIsAddingList(false); setListTitle('')}}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="bg-pink-400 text-white p-2 rounded-lg hover:bg-pink-500 h-full w-72 text-start"
                                        onClick={() => setIsAddingList(true)}
                                    >
                                        + Add a list
                                    </button>
                                )}
                            </div>
                        </DndContext>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BoardWorkspace;
