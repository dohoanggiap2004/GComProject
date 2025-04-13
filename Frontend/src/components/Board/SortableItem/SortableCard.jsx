import {useState} from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {createPortal} from 'react-dom';
import CardModal from '../../Card/CardModal.jsx';
import {CompletedSVG, EditSVG} from "../../Icon/icons.jsx";
import {FaCheckCircle} from 'react-icons/fa';
import {useSelector} from "react-redux";

const SortableCard = ({card, onToggleCheck}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: card._id,
    });
    const {role} = useSelector((state) => state.user);
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
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={`group relative bg-white p-2 mb-2 rounded-lg shadow-md hover:border-2 hover:border-cyan-500 ${
                    isDragging ? 'shadow-lg' : 'shadow-xs'
                } flex items-center cursor-pointer`}
                onClick={role !== 'viewer' ? handleOpenModal : undefined}
            >
                <div className={'flex items-center'}>
                    <div className="mr-2 cursor-pointer z-40"
                         onClick={role !== 'viewer' ? handleToggleCheck : undefined}>
                        {card.isCompleted ? (
                            <FaCheckCircle className={'w-4 h-4'} color={'green'}/>
                        ) : (
                            <CompletedSVG/>
                        )}
                    </div>

                    <div className="cursor-grab text-xs"  {...(role !== 'viewer' ? listeners : {})}>
                        {card.title}
                    </div>
                </div>

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
                        cardProp={card}
                        onClose={() => setIsModalOpen(false)}
                        onToggleCheck={onToggleCheck}
                    />,
                    document.body
                )}
        </>
    );
};

export default SortableCard;
