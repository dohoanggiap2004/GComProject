import {MdAccessTime, MdDeleteOutline, MdOutlineAssignmentInd} from "react-icons/md";
import {updateTask} from "../../store/actions/taskAction.jsx";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import MemberTaskModal from "./MemberTaskModal.jsx";
import DateTaskPickModal from "./DateTaskPickModal.jsx";
import toast from "react-hot-toast";

const Task = ({task, handleDeleteTask}) => {
    const dispatch = useDispatch();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [time, setTime] = useState();
    const [date, setDate] = useState();
    const [formData, setFormData] = useState({
        title: task?.title || '',
        _id: task?._id,
        isCompleted: task?.isCompleted || false,
        assignedTo: task?.assignedTo || [],
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

    const handleChangeDueDate = async ({dueDate}) => {
        const formData2 = {
            ...formData,
            dueDate,
        }
        try {
            await dispatch(updateTask(formData2)).unwrap();
            setFormData(formData2)
            setIsDateModalOpen(false)
        } catch (err){
            toast.error(err);
        }
    }

    const formatDate = (date) => {
        // Check if date is a valid Date object
        if (!(date instanceof Date) || isNaN(date)) {
            return "";
        }
        return date.toLocaleDateString("en-US", {
            month: "short", // "Apr"
            day: "numeric", // "4"
        });
    };

    // Function to format the time from a Date object to "h:mm A" (e.g., "7:34 PM")
    const formatTime = (date) => {
        // Check if date is a valid Date object
        if (!(date instanceof Date) || isNaN(date)) {
            return "";
        }
        return date.toLocaleTimeString("en-US", {
            hour: "numeric", // "7"
            minute: "2-digit", // "34"
            hour12: true, // "PM"
        });
    };

    useEffect(() => {
        const dueDate = new Date(task.dueDate);
        setDate(formatDate(dueDate));
        setTime(formatTime(dueDate));
    }, [task?.dueDate]);

    return (
        <div
            className="flex items-center justify-between mt-2 p-1 bg-gray-100 rounded-lg shadow-xs hover:bg-gray-200 transition relative">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    value={task.isCompleted}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded-sm"
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
                        className="text-sm border rounded-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full min-w-20 me-4"
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
                <div className={'flex items-center'}>
                    {formData?.dueDate && (
                        <div className={'text-xs text-gray-600'}>{date} - {time} -</div>
                    )}
                    <button
                        className="hover:bg-gray-400 rounded-lg ms-1" title={'Due date'}
                        onClick={() => setIsDateModalOpen(true)}
                    >
                        <MdAccessTime/>
                    </button>
                </div>


                {/* Assign Icon */}
                <button className="hover:bg-gray-400 rounded-lg"
                        onClick={() => setIsMemberModalOpen(true)}
                        title={'Assign'}
                >
                    <MdOutlineAssignmentInd/>
                </button>

                <button className={'hover:bg-gray-400 rounded-lg'}
                        onClick={() => {
                            handleDeleteTask()
                        }}
                        title={'Delete'}
                >
                    <MdDeleteOutline/>
                </button>
            </div>

            {isMemberModalOpen && (
                <div
                    className={`absolute z-50 w-max right-0 md:top-6 md:left-auto md:right-0 md:ml-2`}
                >
                    <MemberTaskModal task={task} onClose={() => setIsMemberModalOpen(false)}/>
                </div>
            )}

            {isDateModalOpen && (
                <div
                    className={`absolute z-50 w-max right-0 md:top-6 md:left-auto md:right-0 md:ml-2`}
                >
                    <DateTaskPickModal onChangeDateTime={handleChangeDueDate}  onClose={() => setIsDateModalOpen(false)}/>
                </div>
            )}
        </div>
    )
}

export default Task;
