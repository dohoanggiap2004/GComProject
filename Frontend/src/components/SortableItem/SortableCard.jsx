// Component cho card
import {useSortable} from "@dnd-kit/sortable";

const SortableCard = ({card, onToggleCheck}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: card._id,
    });

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px) rotate(${isDragging ? 8 : 0}deg) scale(${isDragging ? 1.1 : 1})`
            : '',
        transition: transition || 'transform 200ms ease',
        opacity: isDragging ? 0.5 : 1,
        filter: isDragging ? 'blur(2px)' : 'none', // Làm mờ khi kéo
        zIndex: isDragging ? 100 : 1,
        boxShadow: isDragging ? '0 15px 30px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        willChange: 'transform',
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


export default SortableCard
