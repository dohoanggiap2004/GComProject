import {useState, useEffect} from 'react';
import {closestCenter, DndContext, useDroppable} from '@dnd-kit/core';
import {debounce} from 'lodash';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import NavbarWorkspace from "../components/Navbar/Navbar-Workspace.jsx";
import SidebarBoard from "../components/Sidebar/SidebarBoard.jsx";
import HeaderBoard from "../components/Header/HeaderBoard.jsx";
import {useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    createCard,
    createList,
    getBoardByBoardId,
    getBoardByWorkspaceId, reOrderCard,
    updateCard
} from "../store/actions/boardAction.js";

// Component cho card
const SortableCard = ({card, onToggleCheck}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: card._id,
    });

    const style = {
        transform: isDragging
            ? `${CSS.Transform.toString(transform)} rotate(5deg) scale(1.05)`
            : CSS.Transform.toString(transform),
        transition: transition || 'transform 300ms ease', // Đảm bảo di chuyển mượt mà
        opacity: isDragging ? 0.6 : 1, // Giảm độ mờ khi kéo
        zIndex: isDragging ? 100 : 1, // Đưa card lên trên cùng
        boxShadow: isDragging ? '0 10px 20px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)', // Bóng đổ lớn hơn
                                                                                                   // khi kéo
        willChange: 'transform', // Tối ưu hiệu suất
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
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    </svg>
                )}
            </span>

            {/* Phần kéo-thả chỉ áp dụng cho tiêu đề */}
            <span className="flex-1 cursor-grab" {...listeners}>
                {card.title}
            </span>

            {/* Các nút hành động */}
            <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
const SortableList = ({list, cards, onToggleCheck, onAddCard}) => {
    const {setNodeRef: setSortableRef} = useSortable({id: list._id});
    const {setNodeRef: setDroppableRef} = useDroppable({id: list._id});
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
        <div ref={(node) => {
            setSortableRef(node); // Cho phép list được kéo
            setDroppableRef(node); // Biến list thành vùng thả
        }} className="bg-gray-100 px-4 py-3 w-72 rounded-lg">
            <h3 className="text-md font-bold text-gray-700 mb-2">{list.title}</h3>
            <SortableContext items={cards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
                {Array.isArray(cards) && cards.length > 0 && cards.map((card) => (
                    <SortableCard key={card._id} card={card}
                                  onToggleCheck={() => onToggleCheck(card.isCompleted, card._id, list._id)}/>
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

function BoardWorkspace() {
    const location = useLocation();
    const workspaceName = location.state?.workspaceName || "Default Title";
    const workspaceId = location.state?.workspaceId || "Default Title";
    const {boardId} = useParams();
    const dispatch = useDispatch();
    const {board} = useSelector((state) => state.board);
    const [isAddingList, setIsAddingList] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [tempBoard, setTempBoard] = useState(null);
    const [reCardInfo, setReCardInfo] = useState(null);

    useEffect(() => {
        dispatch(getBoardByWorkspaceId(workspaceId));
    }, [workspaceId, dispatch]);

    useEffect(() => {
        dispatch(getBoardByBoardId(boardId));
    }, [boardId, dispatch]);

    const handleAddCard = (listId, content) => {
        const newCard = {title: content, listId, boardId};
        dispatch(createCard(newCard));
    };

    const handleToggleCheck = (isCompleted, _id, listId) => {
        const newCard = {boardId, listId, _id, isCompleted: !isCompleted};
        dispatch(updateCard(newCard));
    };

    // Đồng bộ tempBoard với board khi board thay đổi
    useEffect(() => {
        if (board && Array.isArray(board.lists)) {
            setTempBoard({
                ...board,
                lists: board.lists.map((list) => (
                    {
                        ...list,
                        cards: [...list.cards],
                    }
                )),
            });
        }
    }, [board]);

    // Helper: Tìm vị trí card
    const findCardPosition = (lists, cardId) => {
        for (const list of lists) {
            const index = list.cards.findIndex((card) => card._id === cardId);
            if (index !== -1) {
                return { listId: list._id, cardIndex: index };
            }
        }
        return null;
    };

    // Hàm xử lý drag over (vẫn giữ nguyên)
    const debouncedHandleDragOver = debounce((event) => {
        const { active, over } = event;
        if (!over || !tempBoard) return;

        const activeId = active.id; // ID của card đang kéo
        const overId = over.id;     // Có thể là ID của list hoặc card

        // Tìm list chứa card đang kéo
        const sourceList = tempBoard.lists.find((list) =>
            list.cards.some((card) => card._id === activeId)
        );
        if (!sourceList) return;

        // Xác định list đích: nếu overId khớp với list._id thì đó là list đích, nếu không thì tìm trong card của các list
        let destList = tempBoard.lists.find((list) => list._id === overId);
        if (!destList) {
            destList = tempBoard.lists.find((list) =>
                list.cards.some((card) => card._id === overId)
            );
        }
        if (!destList) return;

        // Tạo bản sao của tempBoard để tránh thay đổi state trực tiếp
        const newBoard = {
            ...tempBoard,
            lists: tempBoard.lists.map((list) => ({
                ...list,
                cards: [...list.cards],
            })),
        };

        if (sourceList._id === destList._id) {
            // Nếu kéo trong cùng 1 list, xử lý reorder card
            const newList = newBoard.lists.find((list) => list._id === sourceList._id);
            const activeIndex = newList.cards.findIndex((card) => card._id === activeId);
            const overIndex = newList.cards.findIndex((card) => card._id === overId);
            // Nếu vị trí không thay đổi, không cần xử lý
            if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return;

            const [movedCard] = newList.cards.splice(activeIndex, 1);
            newList.cards.splice(overIndex, 0, movedCard);
        } else {
            // Nếu kéo giữa 2 list khác nhau
            const newSourceList = newBoard.lists.find((list) => list._id === sourceList._id);
            const newDestList = newBoard.lists.find((list) => list._id === destList._id);
            const activeIndex = newSourceList.cards.findIndex((card) => card._id === activeId);
            let overIndex = newDestList.cards.findIndex((card) => card._id === overId);
            if (overIndex === -1) {
                overIndex = newDestList.cards.length;
            }
            const [movedCard] = newSourceList.cards.splice(activeIndex, 1);
            newDestList.cards.splice(overIndex, 0, movedCard);
        }

        // Cập nhật state tạm
        setTempBoard(newBoard);
    }, 16);

    const handleDragOver = (event) => {
        debouncedHandleDragOver(event);
    };

    // Xử lý drag end: Lấy vị trí mới từ tempBoard và vị trí cũ từ board
    const handleDragEnd = (event) => {
        const { active } = event;
        if (!tempBoard || !board) return;

        const activeId = active.id;

        // Lấy vị trí hiện tại của card từ tempBoard (sau khi kéo)
        const destPosition = findCardPosition(tempBoard.lists, activeId);
        if (!destPosition) return;
        const { listId: destListId, cardIndex: destCardIndex } = destPosition;

        // Lấy vị trí ban đầu của card từ board (trước khi kéo)
        const sourcePosition = findCardPosition(board.lists, activeId);
        if (!sourcePosition) return;
        const { listId: sourceListId, cardIndex: sourceCardIndex } = sourcePosition;

        // Tạo object thông tin reorder
        const newReorderInfo = {
            boardId,
            sourceListId,
            destListId,
            sourceCardIndex,
            destCardIndex,
        };
        setReCardInfo(newReorderInfo);
    };

    // useEffect để dispatch action mỗi khi reCardInfo thay đổi (khác null)
    useEffect(() => {
        if (reCardInfo) {
            dispatch(reOrderCard(reCardInfo));

            setReCardInfo(null);
        }
    }, [reCardInfo, dispatch]);

    const handleAddList = (e) => {
        e.preventDefault();
        const payload = {boardId, title: listTitle};
        dispatch(createList(payload));
        setIsAddingList(false);
        setListTitle('');
    };

    return (
        <>
            <NavbarWorkspace/>
            <div className="flex">
                <SidebarBoard workspaceName={workspaceName} workspaceId={workspaceId}/>
                <div className="w-full">
                    <HeaderBoard/>
                    <div className="min-h-screen bg-pink-300 p-4 w-full">
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="flex space-x-4 overflow-x-auto">
                                {tempBoard &&
                                    Array.isArray(tempBoard.lists) &&
                                    tempBoard.lists.length > 0 &&
                                    tempBoard.lists.map((list) => (
                                        <SortableList
                                            key={list._id}
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
