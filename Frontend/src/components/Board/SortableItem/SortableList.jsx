import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";
import {useEffect, useRef, useState} from "react";
import SortableCard from "./SortableCard.jsx";
import {CSS} from "@dnd-kit/utilities";
import {IoIosMore} from "react-icons/io";
import {MdDragIndicator} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";
import {deleteList, updateList} from "../../../store/actions/boardAction.jsx";
import toast from "react-hot-toast";
import {GoPlus} from "react-icons/go";
import {createPortal} from "react-dom";

const SortableList = ({list, cards, onToggleCheck, onAddCard, boardId}) => {
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: list._id});
    const listRef = useRef();
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const {role} = useSelector(state => state.user);
    const {setNodeRef: setDroppableRef} = useDroppable({id: list._id});
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardContent, setNewCardContent] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false); // State to toggle title editing
    const [newTitle, setNewTitle] = useState(list.title); // State to hold the new title
    const titleInputRef = useRef(null);
    const dispatch = useDispatch();

    const style = {
        transform: transform
            ? `${CSS.Transform.toString(transform)} rotate(${isDragging ? '5deg' : '0deg'}) scale(${isDragging ? 1.05 : 1})`
            : `rotate(0deg) scale(1)`,
        transition: transition || 'transform 200ms ease, opacity 200ms ease, filter 200ms ease',
        opacity: isDragging ? 0.7 : 1,
        filter: isDragging ? 'blur(2px)' : 'none',
        zIndex: isDragging ? 100 : 1,
        boxShadow: isDragging ? '0 15px 30px rgba(0, 0, 0, 0.2)' : 'none',
        willChange: 'transform, opacity, filter',
    };

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

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };



    const handleTitleDoubleClick = () => {
        setIsEditingTitle(true);
        setNewTitle(list.title);
    };

    // Handle title change submission (on Enter or blur)
    const handleTitleSubmit = () => {
        if (newTitle.trim()) {
            const payload = {
                boardId: boardId,
                _id: list._id,
                title: newTitle,
            }
            dispatch(updateList(payload))
            setIsEditingTitle(false);
        }
    };

    // Handle Enter key to submit the new title
    const handleTitleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleTitleSubmit();
        }
    };

    // Handle blur to submit the new title
    const handleTitleBlur = () => {
        handleTitleSubmit();
    };

    // Auto-focus the input field when it appears
    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleDeleteList = async () => {
        const payload = {
            boardId: boardId,
            listId: list._id,
        }
        try {
            await dispatch(deleteList(payload)).unwrap();
            toast.success('Deleted the list', {
                duration: 3000,
            });
        } catch (err) {
            toast.error(err || 'Error while deleting the list', {
                duration: 3000,
            });
        }
    }

    const toggleMenu = () => {
        if (!isOpen && listRef.current) {
            const rect = listRef.current.getBoundingClientRect();
            setMenuPosition({
                x: rect.right - 250, // hoặc chỉnh tùy vị trí
                y: rect.top + 40
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div
            ref={(node) => {
                setSortableRef(node);
                setDroppableRef(node);
                listRef.current = node;
            }}

            style={style}
            className={`bg-gray-100 px-2 py-1 w-64 rounded-lg transition-all duration-200 ease-in-out relative ${
                isDragging ? 'shadow-lg' : 'shadow-xs'} max-h-164 overflow-y-auto`}
        >
            <div className="flex justify-between items-center mb-2">
                {/* Drag handle */}
                <div
                    {...(
                        role !== 'viewer' ? listeners : {}
                    )}
                    {...attributes}
                    className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-700"
                >
                    <MdDragIndicator className="w-5 h-5"/>
                </div>

                {/* Tiêu đề/Input (không kéo thả) */}
                <div className="flex-1" onMouseDown={(e) => e.stopPropagation()}>
                    {role !== 'viewer' && isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={handleTitleBlur}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="text-sm font-semibold text-gray-700 w-full p-1 rounded-md border border-gray-300 focus:outline-hidden focus:border-blue-500"
                        />
                    ) : (
                        <h3
                            onDoubleClick={handleTitleDoubleClick}
                            className="text-sm font-semibold text-gray-700 cursor-pointer"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            {list.title}
                        </h3>
                    )}
                </div>

                {/* Nút menu (không kéo thả) */}
                <button
                    onClick={toggleMenu}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
                >
                    <IoIosMore className="w-5 h-5"/>
                </button>
            </div>

            <SortableContext items={cards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
                {Array.isArray(cards) && cards.length > 0 && cards.map((card) => (
                    <SortableCard
                        key={card._id}
                        card={card}
                        onToggleCheck={() => onToggleCheck(card.isCompleted, card._id, list._id)}
                    />
                ))}
            </SortableContext>
            {role !== 'viewer' && (
                isAddingCard ? (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={newCardContent}
                            onChange={(e) => setNewCardContent(e.target.value)}
                            placeholder="Enter a title or paste a link"
                            className="w-full p-2 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:border-blue-500"
                        />
                        <div className="flex space-x-2 items-center">
                            <button
                                onClick={handleAddCardSubmit}
                                className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-lg hover:bg-blue-600 mt-2 mb-2"
                            >
                                Add card
                            </button>
                            <button
                                onClick={handleCancelAddCard}
                                className="text-gray-500 hover:text-gray-700 mt-2 mb-2"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleAddCardClick}
                        className="text-gray-700 text-sm font-semibold hover:bg-gray-300 w-full p-1 py-1.5 rounded-md shadow-md text-start mb-2"
                    >
                        <div className={'flex items-center'}>
                            <GoPlus className={'mr-2 w-4 h-4'}/> Add a card
                        </div>
                    </button>
                )
            )}
            {role !== 'viewer' && isOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        className="fixed top-10 w-64 bg-white shadow-lg rounded-lg p-3 border border-gray-100 z-50"
                        style={{ top: menuPosition.y, left: menuPosition.x}}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-semibold text-gray-800">List actions</div>
                            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <ul className="text-gray-700">
                            <li className="p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm">Add card</li>
                            <li className="p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm">Copy list</li>
                            <li className="p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm">Move list</li>
                            <li className="p-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm">Watch</li>
                        </ul>
                        <hr className="my-2 border-gray-200"/>
                        <div className="text-sm font-semibold text-gray-800 mb-2">Change list color</div>
                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                            <p className="font-medium">Upgrade to change list colors</p>
                            <p className="text-xs mt-1">List colors can make your board fun and help organize your board
                                visually.</p>
                            <button className="mt-2 text-blue-600 underline text-xs">Start free trial</button>
                        </div>
                        <hr className="my-2 border-gray-200"/>
                        <hr className="my-2 border-gray-200"/>
                        <button onClick={handleDeleteList}
                                className="p-2 rounded-md text-red-600 hover:bg-gray-100 cursor-pointer text-sm">
                            Archive this list
                        </button>
                    </div>, document.body
                )}
        </div>
    );
};

export default SortableList;
