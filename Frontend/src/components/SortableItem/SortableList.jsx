import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import SortableCard from "./SortableCard.jsx";
import { CSS } from "@dnd-kit/utilities";

const SortableList = ({ list, cards, onToggleCheck, onAddCard }) => {
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: list._id });

    const { setNodeRef: setDroppableRef } = useDroppable({ id: list._id });
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardContent, setNewCardContent] = useState('');

    // Hiệu ứng khi kéo: nghiêng góc, mờ đi, và phóng to nhẹ
    const style = {
        transform: transform
            ? `${CSS.Transform.toString(transform)} rotate(${isDragging ? '5deg' : '0deg'}) scale(${isDragging ? 1.05 : 1})`
            : `rotate(0deg) scale(1)`,
        transition: transition || 'transform 200ms ease, opacity 200ms ease, filter 200ms ease',
        opacity: isDragging ? 0.7 : 1, // Hơi mờ đi khi kéo
        filter: isDragging ? 'blur(2px)' : 'none', // Làm mờ khi kéo
        zIndex: isDragging ? 100 : 1, // Đưa list đang kéo lên trên
        boxShadow: isDragging ? '0 15px 30px rgba(0, 0, 0, 0.2)' : 'none', // Đổ bóng khi kéo
        willChange: 'transform, opacity, filter', // Tối ưu hiệu suất
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

    return (
        <div
            ref={(node) => {
                setSortableRef(node);
                setDroppableRef(node);
            }}
            style={style}
            {...attributes}
            className={`bg-gray-100 px-4 py-3 w-72 rounded-lg transition-all duration-200 ease-in-out ${
                isDragging ? 'shadow-lg' : 'shadow-sm'
            }`}
        >
            <h3
                className="text-md font-bold text-gray-700 mb-2 cursor-grab"
                {...listeners} // Kéo list bằng tiêu đề
            >
                {list.title}
            </h3>
            <SortableContext items={cards.map((card) => card._id)} strategy={verticalListSortingStrategy}>
                {Array.isArray(cards) && cards.length > 0 && cards.map((card) => (
                    <SortableCard
                        key={card._id}
                        card={card}
                        onToggleCheck={() => onToggleCheck(card.isCompleted, card._id, list._id)}
                    />
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

export default SortableList;
