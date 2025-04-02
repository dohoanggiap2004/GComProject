import {MdAccessTime, MdDeleteOutline, MdOutlineAssignmentInd} from "react-icons/md";
import {updateTask} from "../../store/actions/taskAction.js";
import { useState } from "react";
import {useDispatch} from "react-redux";

const Task = ({task, handleDeleteTask}) => {
    const dispatch = useDispatch();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [formData, setFormData] = useState({
        title: task?.title || '',
        _id: task?._id,
        isCompleted: task?.isCompleted || false,
        assignedTo: task?.assignedTo || [] ,
        dueDate: task?.dueDate || null,
    });

    // Hàm xử lý khi double-click vào tiêu đề
    const handleDoubleClickTitle = (title) => {
        setFormData({
            ...formData,
            title: title,
        })
        setIsEditingTitle(true);
    };

    // Hàm xử lý khi người dùng thay đổi tiêu đề
    const handleTitleChange = (e) => {
        setFormData({
            ...formData,
            title: e.target.value,
        })
    };

    // Hàm xử lý khi người dùng nhấn Enter hoặc blur để lưu tiêu đề
    const handleTitleSave = () => {
        if (formData.title.trim()) {
            dispatch(updateTask(formData))
        }
        setIsEditingTitle(false);
    };

    const handleCheckboxChange = () => {
        setFormData(prevFormData => {
            const updatedFormData = {
                ...prevFormData,
                isCompleted: !prevFormData.isCompleted
            };

            dispatch(updateTask(updatedFormData));
            return updatedFormData;
        });
    };

    return (
        <div className="flex items-center justify-between mt-2 p-1 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    value={task.isCompleted}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                {/* Tiêu đề: Hiển thị input khi đang chỉnh sửa, ngược lại hiển thị text */}
                {isEditingTitle ? (
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        onBlur={() => handleTitleSave(task._id)} // Lưu khi click ra ngoài
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleTitleSave(task._id); // Lưu khi nhấn Enter
                            }
                        }}
                        autoFocus
                        className="text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full min-w-20 me-4"
                    />
                ) : (
                    <div
                        className="cursor-grab text-sm min-w-20 min-h-3"
                        onDoubleClick={() => handleDoubleClickTitle(task.title)} // Double-click để chỉnh sửa
                    >
                        {task.title}
                    </div>
                )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
                {/* Comment Icon with Count */}
                <div className="hover:bg-gray-400 rounded-lg">
                    <MdAccessTime/>
                </div>
                {/* More Options Icon */}
                <button className="hover:bg-gray-400 rounded-lg">
                    <MdOutlineAssignmentInd/>
                </button>
                <button className={'hover:bg-gray-400 rounded-lg'}
                        onClick={() => {
                            handleDeleteTask()
                        }}
                >
                    <MdDeleteOutline/>
                </button>
            </div>
        </div>
    )
}

export default Task;
