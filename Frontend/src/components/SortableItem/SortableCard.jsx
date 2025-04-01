import { useState } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { createPortal } from 'react-dom';
import CardModal from '../Modal/CardModal.jsx';
import {EditSVG} from "../Icon/icons.jsx";

const SortableCard = ({ card, onToggleCheck }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card._id,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px) rotate(${isDragging ? 8 : 0}deg) scale(${isDragging ? 1.1 : 1})`
            : '',
        transition: transition || 'transform 200ms ease',
        opacity: isDragging ? 0.5 : 1,
        filter: isDragging ? 'blur(2px)' : 'none',
        zIndex: isDragging ? 100 : 1,
        boxShadow: isDragging ? '0 15px 30px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        willChange: 'transform',
    };

    const handleToggleCheck = (e) => {
        e.stopPropagation();
        onToggleCheck();
    };

    const handleOpenModal = () => {
        console.log('Card clicked, opening modal'); // Kiểm tra sự kiện
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={`group relative bg-white p-2 mb-2 text-sm rounded-lg shadow-md hover:border-2 hover:border-cyan-500 ${
                    isDragging ? 'shadow-lg' : 'shadow-sm'
                } flex items-center cursor-pointer`}
                onClick={handleOpenModal} // Mở modal khi click vào card
            >
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

                <span className="flex-1 cursor-grab" {...listeners}>
                    {card.title}
                </span>

                <div
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <EditSVG/>
                </div>
            </div>

            {/* Sử dụng createPortal để render modal trực tiếp vào body */}
            {isModalOpen &&
                createPortal(
                    <CardModal
                        card={card}
                        onClose={() => setIsModalOpen(false)}
                    />,
                    document.body
                )}
        </>
    );
};

export default SortableCard;
